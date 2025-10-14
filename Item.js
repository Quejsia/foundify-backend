const mongoose = require('mongoose');
const ItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  type: { type: String, enum: ['lost','found'], default: 'lost' },
  photo: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reward: { type: Number, default: 0 },
  claimed: { type: Boolean, default: false },
  claimCode: String,
  claimRequests: [{ requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, message: String, status: String, time: Date }],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Item', ItemSchema);
