const mongoose = require('mongoose');

const matchingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Character-Dynasty', 'Event-Year', 'Custom'], 
    default: 'Character-Dynasty' 
  },
  pairs: [{
    left: { type: String, required: true },
    right: { type: String, required: true },
    image: { type: String }
  }],
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  difficulty: { type: Number, default: 1 },
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

module.exports = mongoose.model('Matching', matchingSchema);
