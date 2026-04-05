const mongoose = require('mongoose');

const guessCharacterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  aliases: [{ type: String }],
  clues: [{ type: String, required: true }], // 5 clues
  image: { type: String }, // Optional image for final reveal
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

module.exports = mongoose.model('GuessCharacter', guessCharacterSchema);
