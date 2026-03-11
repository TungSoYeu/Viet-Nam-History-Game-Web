const Question = require('../models/Question');
const User = require('../models/User');
const Matching = require('../models/Matching');
const Challenge = require('../models/Challenge');

// --- MODE 1 & 2: TRẢ LỜI CÂU HỎI TIÊU CHUẨN ---
exports.checkAnswer = async (req, res) => {
  const { questionId, userAnswer, userId, mode } = req.body;
  try {
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Không tìm thấy câu hỏi!" });

    const isCorrect = question.correctAnswer === userAnswer;
    let experienceGain = isCorrect ? 10 : 0;
    
    // Nếu là Time Attack (Mode 3), thưởng XP cao hơn nếu có Combo (xử lý ở frontend và gửi lên hoặc tính ở đây)
    if (mode === 'timeAttack' && isCorrect) experienceGain = 15;

    let updatedUser = null;
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        if (isCorrect) {
          user.experience += experienceGain;
        } else {
          // Chỉ trừ nến ở các chế độ không phải Time Attack
          if (mode !== 'timeAttack') {
            user.lives = Math.max(0, user.lives - 1);
          }
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
  try {
    const matchings = await Matching.aggregate([{ $sample: { size: 1 } }]);
    if (matchings.length === 0) return res.status(404).json({ message: "Chưa có dữ liệu nối chữ" });
    res.json(matchings[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- MODE 5: ASYNCHRONOUS PVP ---

// 1. Tạo lời thách đấu (Player 1)
exports.createPvPChallenge = async (req, res) => {
  const { creatorId, opponentId } = req.body;
  try {
    // Lấy 10 câu hỏi ngẫu nhiên dùng chung
    const questions = await Question.aggregate([{ $sample: { size: 10 } }]);
    const questionIds = questions.map(q => q._id);

    const challenge = new Challenge({
      creator: creatorId,
      challenger: opponentId, // Có thể cụ thể hoặc để trống cho global challenge
      questions: questionIds,
      status: 'pending'
    });

    await challenge.save();
    res.json({ success: true, challengeId: challenge._id, questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Nộp kết quả (Dùng cho cả P1 và P2)
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
      
      // Tính toán người thắng
      if (challenge.challengerScore > challenge.creatorScore) {
        challenge.winner = challenge.challenger;
      } else if (challenge.challengerScore < challenge.creatorScore) {
        challenge.winner = challenge.creator;
      } else {
        // Hòa điểm thì xét thời gian
        challenge.winner = challenge.challengerTime < challenge.creatorTime ? challenge.challenger : challenge.creator;
      }

      // Thưởng XP cho người thắng
      const winnerUser = await User.findById(challenge.winner);
      if (winnerUser) {
        winnerUser.experience += 50; // Thưởng lớn cho PvP
        await winnerUser.save();
      }
    }

    await challenge.save();
    res.json({ success: true, challenge });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Lấy danh sách thách đấu đang chờ của tôi
exports.getMyChallenges = async (req, res) => {
    const { userId } = req.params;
    try {
        const challenges = await Challenge.find({
            $or: [
                { challenger: userId, status: 'pending' },
                { challenger: null, creator: { $ne: userId }, status: 'pending' }
            ]
        }).populate('creator', 'username');
        res.json(challenges);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Lấy tất cả các thách đấu đang chờ (cho global lobby)
exports.getPendingChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ status: 'pending' }).populate('creator', 'username');
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
