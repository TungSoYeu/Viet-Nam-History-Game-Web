const mongoose = require('mongoose');

const chronologicalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  events: [{
    text: { type: String, required: true },
    order: { type: Number, required: true }
  }],
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

module.exports = mongoose.model('Chronological', chronologicalSchema);
