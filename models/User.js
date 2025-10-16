const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  resetToken: { type: String },
  resetExpires: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
