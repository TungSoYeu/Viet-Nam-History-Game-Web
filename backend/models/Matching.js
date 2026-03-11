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
  difficulty: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Matching', matchingSchema);
