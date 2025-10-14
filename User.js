const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'student' },
  contact: String,
  avatar: String,
  totalRewards: { type: Number, default: 0 },
  resetToken: String,
  resetExpires: Date,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', UserSchema);
