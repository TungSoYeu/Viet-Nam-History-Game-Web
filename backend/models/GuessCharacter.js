const mongoose = require('mongoose');

const guessCharacterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  aliases: [{ type: String }],
  clues: [{ type: String, required: true }], // 5 clues
  image: { type: String }, // Optional image for final reveal
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
}, { timestamps: true });

module.exports = mongoose.model('GuessCharacter', guessCharacterSchema);
