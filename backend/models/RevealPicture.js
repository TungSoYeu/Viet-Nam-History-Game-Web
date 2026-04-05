const mongoose = require('mongoose');

const revealPictureSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  answer: { type: String, required: true },
  questions: [{
    q: { type: String, required: true },
    a: { type: String, required: true }
  }], // 9 questions
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  visibilityScope: {
    type: String,
    enum: ['global', 'class'],
    default: 'global'
  },
  classroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    default: null,
    index: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.model('RevealPicture', revealPictureSchema);
