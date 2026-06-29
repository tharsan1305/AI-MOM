const express = require('express'); // trigger restart
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { checkMaintenanceMode } = require('./middleware/maintenanceMiddleware');
const Settings = require('./models/Settings');

dotenv.config({ override: true });

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }
});
app.set('io', io); // Make io accessible in routes/controllers

// Connect Database (called inside startServer)

// Security Middleware
app.use(helmet());
app.use(cookieParser());

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// We need raw body for Razorpay webhooks
app.use(express.json({
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Maintenance Mode Middleware (Applies to all /api routes)
app.use('/api', checkMaintenanceMode);

// Public Settings Route (used by frontend to check maintenance mode on boot)
app.get('/api/settings/public', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json({ success: true, maintenanceMode: settings ? settings.maintenanceMode : false });
  } catch (error) {
    res.json({ success: true, maintenanceMode: false });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/templates', require('./routes/template'));
app.use('/api/brand', require('./routes/brand'));
app.use('/api/infographic', require('./routes/infographic'));
app.use('/api/images', require('./routes/image'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', require('./routes/payment'));
app.use('/api/webhooks', require('./routes/webhook'));
app.use('/api', require('./routes/geminiRoutes'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'MinuteCraft Server is running', timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const startServer = async () => {
  await connectDB();
  
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 MinuteCraft Server running on port ${PORT}`);
  });
};

startServer();
