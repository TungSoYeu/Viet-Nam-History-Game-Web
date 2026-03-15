const mongoose = require('mongoose');

const chronologicalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  events: [{
    text: { type: String, required: true },
    order: { type: Number, required: true }
  }],
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
}, { timestamps: true });

module.exports = mongoose.model('Chronological', chronologicalSchema);
