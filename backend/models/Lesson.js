const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true },
  imageUrl: { type: String },
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
  },
  wiki: {
    content: { type: String }, 
    images: [{ type: String }], 
    maps: [{ type: String }],   
    videoUrl: { type: String }  
  },
  
  flashcards: [{
    front: { type: String, required: true }, 
    back: { type: String, required: true },  
    image: { type: String }
  }]
});

module.exports = mongoose.model('Lesson', lessonSchema);
