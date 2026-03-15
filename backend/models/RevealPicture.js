const mongoose = require('mongoose');

const revealPictureSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  answer: { type: String, required: true },
  questions: [{
    q: { type: String, required: true },
    a: { type: String, required: true }
  }], // 9 questions
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
}, { timestamps: true });

module.exports = mongoose.model('RevealPicture', revealPictureSchema);
