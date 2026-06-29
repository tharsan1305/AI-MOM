const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { sendEmail } = require('../utils/sendEmail');
const { createNotification } = require('../utils/notificationHelper');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Please provide all fields' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, lastLogin: Date.now() });
    const token = generateToken(user._id);
    
    // Notify admin via Sockets and DB
    await createNotification('registration', 'New User Registered', `${name} (${email}) has joined the platform.`, { userId: user._id });
    const io = req.app.get('io');
    if (io) {
      io.emit('admin_notification', {
        type: 'registration',
        title: 'New User Registered',
        message: `${name} has joined the platform.`
      });
    }

    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar, plan: user.plan },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Please provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar, plan: user.plan },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google OAuth Login
// @route   POST /api/auth/google
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, avatar: picture, googleId });
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.avatar = user.avatar || picture;
    }
    
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar, plan: user.plan },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Google authentication failed' });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: 'No account with that email' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#6366f1">MinuteCraft — Password Reset</h2>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0">Reset Password</a>
        <p style="color:#666;font-size:12px">This link expires in 30 minutes. If you didn't request this, ignore this email.</p>
      </div>`;

    await sendEmail({ to: user.email, subject: 'MinuteCraft — Password Reset', html });
    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ success: false, message: 'Token is invalid or has expired' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.json({ success: true, token, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, googleAuth, forgotPassword, resetPassword };
