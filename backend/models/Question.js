const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Nội dung câu hỏi là bắt buộc'],
        trim: true
    },
    options: {
        type: [String],
        validate: {
            validator: function(v) {
                return v.length === 4;
            },
            message: 'Phải có chính xác 4 đáp án'
        },
        required: true
    },
    correctAnswer: {
        type: String,
        required: [true, 'Đáp án đúng là bắt buộc']
    },
    explanation: {
        type: String,
        required: [true, 'Giải thích lịch sử là bắt buộc'],
        trim: true
    },
    // Đã thay thế historicalPeriod bằng lessonId để liên kết với bảng Lesson
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: [true, 'ID bài học (Triều đại) là bắt buộc']
    },
    difficulty: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);