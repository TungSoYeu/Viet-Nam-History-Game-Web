// backend/controllers/gameController.js
exports.checkAnswer = (req, res) => {
  const { questionId, userAnswer } = req.body;
  
  // Tạm thời luôn cho đúng để test giao diện
  const isCorrect = true; 

  if (isCorrect) {
    res.json({ message: "Tuyệt vời! Lịch sử đã ghi danh bạn.", correct: true });
  } else {
    res.json({ message: "Rất tiếc! Bạn bị mất một ngọn nến.", correct: false });
  }
};