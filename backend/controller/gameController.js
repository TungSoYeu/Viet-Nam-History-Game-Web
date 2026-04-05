const mongoose = require('mongoose');
const Question = require('../models/Question');
const User = require('../models/User');
const Matching = require('../models/Matching');
const Challenge = require('../models/Challenge');
const Chronological = require('../models/Chronological');
const GuessCharacter = require('../models/GuessCharacter');
const RevealPicture = require('../models/RevealPicture');
const { getTheme4Content } = require('../services/theme4ContentService');

function pickRandom(items = []) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

exports.checkAnswer = async (req, res) => {
  const { questionId, userAnswer, userId, mode } = req.body;
  try {
    if (!questionId || !mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ message: "ID câu hỏi không hợp lệ!" });
    }

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Không tìm thấy câu hỏi!" });

    const correctAns = String(question.correctAnswer || "").toLowerCase().trim();
    const userAns = String(userAnswer || "").toLowerCase().trim();
    const isCorrect = correctAns === userAns;

    console.log("=== CHECK ANSWER DEBUG ===");
    console.log("Question ID: ", questionId);
    console.log("String DB (Raw): ", question.correctAnswer);
    console.log("String received (Raw): ", userAnswer);
    console.log("Cleaned DB: ", correctAns, " (Length: ", correctAns.length, ")");
    console.log("Cleaned User: ", userAns, " (Length: ", userAns.length, ")");
    console.log("Result isCorrect: ", isCorrect);
    console.log("==========================");

    let experienceGain = isCorrect ? 10 : 0;
    
    if (mode === 'timeAttack' && isCorrect) experienceGain = 15;

    let updatedUser = null;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      try {
        const user = await User.findById(userId);
        if (user) {
          if (isCorrect) {
            user.experience += experienceGain;
          }
          await user.save();
          updatedUser = user;
        }
      } catch (saveErr) {
        console.error("Error saving user XP:", saveErr);
        // We don't want to throw 500 just because XP saving failed.
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
    console.error("CRASH IN CHECKANSWER:", err);
    res.status(500).json({ message: "Lỗi hệ thống", error: err.message });
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

    if (matchings.length === 0) {
      const theme4Content = await getTheme4Content();
      const round = pickRandom(theme4Content?.gameData?.connectingHistoryRounds);
      if (!round) return res.status(200).json(null);

      return res.json({
        title: round.title,
        type: round.id,
        instruction: round.instruction,
        pairs: round.pairs,
        source: 'theme4',
      });
    }

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
        if (data.length === 0) {
            const theme4Content = await getTheme4Content();
            const flow = Array.isArray(theme4Content?.gameData?.historicalFlowSets)
                ? theme4Content.gameData.historicalFlowSets[0]
                : theme4Content?.gameData?.historicalFlowSet;

            if (!flow) return res.status(200).json({ events: [] });

            return res.json({
                title: flow.title,
                instruction: flow.instruction,
                events: (flow.sentences || []).map((sentence, index) => ({
                    id: sentence.id,
                    text: sentence.text,
                    order: index + 1,
                    group: sentence.group,
                })),
                source: 'theme4',
            });
        }

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

        if (questions.length === 0) {
            const theme4Content = await getTheme4Content();
            const fallbackQuestions = (theme4Content?.gameData?.crosswordSets || []).flatMap((set) =>
                (set.clues || []).map((clue, index) => ({
                    _id: `${set.id}-${index + 1}`,
                    content: clue.question,
                    question: clue.question,
                    options: clue.options,
                    correctAnswer: clue.correctAnswer,
                    keyword: set.acceptedAnswers?.[0] || set.keyword,
                    source: 'theme4',
                }))
            );

            return res.status(200).json(fallbackQuestions);
        }

        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRandomGuessCharacter = async (req, res) => {
    try {
        const data = await GuessCharacter.aggregate([{ $sample: { size: 1 } }]);
        if (data.length === 0) {
            const theme4Content = await getTheme4Content();
            const item = pickRandom(theme4Content?.gameData?.historicalRecognitionItems);

            if (!item) return res.status(200).json(null);

            return res.json({
                name: item.acceptedAnswers?.[0] || item.title,
                aliases: item.acceptedAnswers || [],
                clues: [item.prompt, item.explanation].filter(Boolean),
                image: item.imageUrl,
                prompt: item.prompt,
                type: item.type,
                source: 'theme4',
            });
        }

        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRandomRevealPicture = async (req, res) => {
    try {
        const data = await RevealPicture.aggregate([{ $sample: { size: 1 } }]);
        if (data.length === 0) {
            const theme4Content = await getTheme4Content();
            const reveal = pickRandom(theme4Content?.gameData?.revealPictureSets);

            if (!reveal) return res.status(200).json(null);

            return res.json({
                imageUrl: reveal.imageUrl,
                answer: reveal.answer,
                questions: reveal.questions,
                acceptedAnswers: reveal.acceptedAnswers,
                caption: reveal.caption,
                source: 'theme4',
            });
        }

        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
