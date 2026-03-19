const mongoose = require('mongoose');
const Question = require('../models/Question');
const User = require('../models/User');
const Matching = require('../models/Matching');
const Challenge = require('../models/Challenge');
const Chronological = require('../models/Chronological');
const GuessCharacter = require('../models/GuessCharacter');
const RevealPicture = require('../models/RevealPicture');

exports.checkAnswer = async (req, res) => {
  const { questionId, userAnswer, userId, mode } = req.body;
  try {
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Không tìm thấy câu hỏi!" });

    const isCorrect = question.correctAnswer === userAnswer;
    let experienceGain = isCorrect ? 10 : 0;
    
    if (mode === 'timeAttack' && isCorrect) experienceGain = 15;

    let updatedUser = null;
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        if (isCorrect) {
          user.experience += experienceGain;
        }
        await user.save();
        updatedUser = user;
      }
    }

    res.json({
      correct: isCorrect,
      experienceGain,
      correctAnswer: isCorrect ? null : question.correctAnswer, 
      explanation: question.explanation,
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống", error: err });
  }
};

// --- MODE 4: MATCHING GAME ---
exports.getRandomMatching = async (req, res) => {
  const { lessonId } = req.query;
  try {
    let query = {};
    if (lessonId && lessonId !== 'all') {
        query.lessonId = new mongoose.Types.ObjectId(lessonId);
    }

    let matchings = await Matching.aggregate([{ $match: query }, { $sample: { size: 1 } }]);

    if (matchings.length === 0) {
        matchings = await Matching.aggregate([{ $sample: { size: 1 } }]);
    }

    if (matchings.length === 0) return res.status(200).json(null); // Tránh lỗi 404
    res.json(matchings[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- MODE 5: ASYNCHRONOUS PVP ---
exports.createPvPChallenge = async (req, res) => {
  const { creatorId, opponentId, lessonId } = req.body;
  try {
    let query = {};
    if (lessonId && lessonId !== 'all') query.lessonId = new mongoose.Types.ObjectId(lessonId);
    
    const questions = await Question.aggregate([{ $match: query }, { $sample: { size: 10 } }]);
    if (questions.length < 5) return res.status(400).json({ message: "Không đủ câu hỏi để tạo thách đấu!" });

    const challenge = new Challenge({
      creator: creatorId,
      challenger: opponentId,
      questions: questions.map(q => q._id),
      status: 'pending'
    });

    await challenge.save();
    res.json({ success: true, challengeId: challenge._id, questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitPvPResult = async (req, res) => {
  const { challengeId, userId, score, time } = req.body;
  try {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ message: "Thách đấu không tồn tại" });

    if (challenge.creator.toString() === userId) {
      challenge.creatorScore = score;
      challenge.creatorTime = time;
    } else {
      challenge.challenger = userId;
      challenge.challengerScore = score;
      challenge.challengerTime = time;
      challenge.status = 'completed';
      
      if (challenge.challengerScore > challenge.creatorScore) challenge.winner = challenge.challenger;
      else if (challenge.challengerScore < challenge.creatorScore) challenge.winner = challenge.creator;
      else challenge.winner = challenge.challengerTime < challenge.creatorTime ? challenge.challenger : challenge.creator;

      const winnerUser = await User.findById(challenge.winner);
      if (winnerUser) {
        winnerUser.experience += 50; 
        await winnerUser.save();
      }
    }

    await challenge.save();
    res.json({ success: true, challenge });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find({
            $or: [
                { challenger: req.params.userId, status: 'pending' },
                { challenger: null, creator: { $ne: req.params.userId }, status: 'pending' }
            ]
        }).populate('creator', 'username').populate('questions'); 
        res.json(challenges);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPendingChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ status: 'pending' })
        .populate('creator', 'username').populate('questions'); 
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- MODE 6: TERRITORY MAP ---
exports.getQuestionsByLocation = async (req, res) => {
  try {
    const questions = await Question.aggregate([
      { $match: { type: 'territory', location: req.params.location } },
      { $sample: { size: 3 } }
    ]);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unlockTerritory = async (req, res) => {
  const { userId, location } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    if (!user.unlockedTerritories.includes(location)) {
      user.unlockedTerritories.push(location);
      user.experience += 100;
      await user.save();
    }
    res.json({ success: true, unlockedTerritories: user.unlockedTerritories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addExperience = async (req, res) => {
  const { userId, xp } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });
    
    user.experience += xp;
    await user.save();
    res.json({ success: true, experience: user.experience });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// CÁC HÀM XỬ LÝ 4 MODE CHƠI MỚI (ĐÃ SỬA LỖI 404)
// ==========================================

exports.getRandomChronological = async (req, res) => {
    try {
        const data = await Chronological.aggregate([{ $sample: { size: 1 } }]);
        // Nếu không có dữ liệu, trả về object rỗng kèm message thay vì 404 để frontend không bị crash
        if (data.length === 0) return res.status(200).json({ events: [] });
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRandomMillionaire = async (req, res) => {
    try {
        const questions = await Question.aggregate([
            { $match: { type: 'millionaire' } },
            { $sample: { size: 15 } }
        ]);
        if (questions.length === 0) return res.status(200).json([]);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRandomGuessCharacter = async (req, res) => {
    try {
        const data = await GuessCharacter.aggregate([{ $sample: { size: 1 } }]);
        if (data.length === 0) return res.status(200).json(null);
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRandomRevealPicture = async (req, res) => {
    try {
        const data = await RevealPicture.aggregate([{ $sample: { size: 1 } }]);
        if (data.length === 0) return res.status(200).json(null);
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};