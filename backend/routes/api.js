// backend/routes/api.js
const express = require('express');
const router = express.Router();
const gameController = require('../controller/gameController');

const Lesson = require('../models/Lesson');
const Question = require('../models/Question');

const User = require('../models/User');
const Matching = require('../models/Matching');
const { isAdmin } = require('../middleware/authMiddleware');

// Đường dẫn đăng ký người chơi mới
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });

  try {
    let existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" });

    const user = new User({ username, password });
    await user.save();
    res.json({ success: true, message: "Đăng ký thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi đăng ký", error: err });
  }
});

// Đường dẫn đăng nhập (Nghiêm ngặt)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Tên đăng nhập không tồn tại!" });
    }
    
    if (user.password !== password) {
      return res.status(401).json({ message: "Mật khẩu không chính xác!" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi đăng nhập", error: err });
  }
});

// Đường dẫn đổi mật khẩu
router.patch('/user/change-password', async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });
        
        if (user.password !== oldPassword) {
            return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
        }
        
        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: "Đổi mật khẩu thành công" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADMIN ROUTES ---
router.post('/admin/questions', isAdmin, async (req, res) => {
    try {
        const question = new Question(req.body);
        await question.save();
        res.json({ success: true, question });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/admin/lessons', isAdmin, async (req, res) => {
    try {
        const lesson = new Lesson(req.body);
        await lesson.save();
        res.json({ success: true, lesson });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/admin/matching', isAdmin, async (req, res) => {
    try {
        const matching = new Matching(req.body);
        await matching.save();
        res.json({ success: true, matching });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Đường dẫn lấy danh sách các triều đại
router.get('/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ order: 1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách triều đại", error: err });
  }
});

// Đường dẫn lấy bảng xếp hạng
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find().sort({ experience: -1 }).limit(10);
    res.json(topUsers);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy bảng xếp hạng", error: err });
  }
});

// Đường dẫn lấy tất cả câu hỏi
router.get('/questions/all', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách câu hỏi", error: err });
  }
});

// Đường dẫn lấy danh sách câu hỏi theo triều đại
router.get('/questions/:lessonId', async (req, res) => {
  try {
    const questions = await Question.find({ lessonId: req.params.lessonId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách câu hỏi", error: err });
  }
});

// Đường dẫn gửi câu trả lời, sử dụng controller
router.post('/submit-answer', gameController.checkAnswer);

// Matching Game (Mode 4)
router.get('/matching/all', async (req, res) => {
  try {
    const games = await Matching.find();
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/matching/random', gameController.getRandomMatching);

// PvP Mode (Mode 5)
router.post('/pvp/create', gameController.createPvPChallenge);
router.post('/pvp/submit', gameController.submitPvPResult);
router.get('/pvp/challenges/:userId', gameController.getMyChallenges);

router.get('/pvp/pending', gameController.getPendingChallenges);

module.exports = router;