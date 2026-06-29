const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

// Helper to get exactly 32 bytes key from the ENCRYPTION_KEY environment variable.
const getEncryptionKey = () => {
  const keyStr = process.env.ENCRYPTION_KEY || 'default_insecure_key_do_not_use_in_prod';
  if (keyStr.length >= 64) {
    // If it's a 64-character hex string (32 bytes), parse it
    return Buffer.from(keyStr.substring(0, 64), 'hex');
  }
  // Fallback hashing to ensure 32 bytes if they provided a shorter/weird string
  return crypto.createHash('sha256').update(String(keyStr)).digest();
};

const encrypt = (text) => {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption failed:', error.message);
    throw new Error('Failed to encrypt data');
  }
};

const decrypt = (encryptedText) => {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;
  try {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedData = textParts.join(':');
    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error.message);
    throw new Error('Failed to decrypt data');
  }
};

module.exports = {
  encrypt,
  decrypt
};
