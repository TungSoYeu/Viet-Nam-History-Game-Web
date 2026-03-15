const Question = require('../models/Question');

// @desc    Tạo câu hỏi mới
// @route   POST /api/questions
exports.createQuestion = async (req, res) => {
    try {
        const question = await Question.create(req.body);
        res.status(201).json({ success: true, data: question });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Lấy danh sách câu hỏi (Phân trang)
// @route   GET /api/questions
exports.getQuestions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const questions = await Question.find().skip(skip).limit(limit);
        const total = await Question.countDocuments();

        res.status(200).json({
            success: true,
            count: questions.length,
            pagination: { total, page, pages: Math.ceil(total / limit) },
            data: questions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

// @desc    Lấy ngẫu nhiên N câu hỏi cho game
// @route   GET /api/questions/random
exports.getRandomQuestions = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        // Sử dụng $sample của MongoDB để lấy ngẫu nhiên hiệu năng cao
        const questions = await Question.aggregate([{ $sample: { size: limit } }]);
        
        res.status(200).json({ success: true, count: questions.length, data: questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Cập nhật câu hỏi
// @route   PUT /api/questions/:id
exports.updateQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!question) return res.status(404).json({ success: false, message: 'Không tìm thấy câu hỏi' });

        res.status(200).json({ success: true, data: question });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Xóa câu hỏi
// @route   DELETE /api/questions/:id
exports.deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) return res.status(404).json({ success: false, message: 'Không tìm thấy câu hỏi' });

        res.status(200).json({ success: true, message: 'Đã xóa câu hỏi thành công' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getQuestionsByRegion = async (req, res, next) => {
    try {
        const { region } = req.params;
        
        // Tìm các câu hỏi thuộc mode territory và khớp với cứ điểm
        const questions = await Question.find({ 
            type: 'territory', 
            location: region 
        });

        if (!questions || questions.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Chưa có dữ liệu câu hỏi cho cứ điểm này." 
            });
        }

        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    } catch (error) {
        next(error);
    }
};