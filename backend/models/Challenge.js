const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creatorScore: { type: Number, default: 0 },
  creatorTime: { type: Number, default: 0 },
  challenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  challengerScore: { type: Number, default: 0 },
  challengerTime: { type: Number, default: 0 },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);
