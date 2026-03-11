import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Questions from '../components/Questions';

export default function PvPBattle() {
  const navigate = useNavigate();
  const location = useLocation();
  const { challengeId, questions: initialQuestions } = location.state || {};
  
  const [questions, setQuestions] = useState(initialQuestions || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (userAnswer) => {
    const question = questions[currentIndex];
    const isCorrect = question.correctAnswer === userAnswer;
    
    setFeedback({
      correct: isCorrect,
      message: isCorrect ? "Chính xác!" : "Sai rồi!",
      correctAnswer: isCorrect ? null : question.correctAnswer
    });

    if (isCorrect) setScore(prev => prev + 1);
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      submitFinalResult();
    }
  };

  const submitFinalResult = () => {
    const endTime = Date.now();
    const totalTime = Math.floor((endTime - startTime) / 1000);
    const userId = localStorage.getItem('userId');

    fetch('http://localhost:5000/api/pvp/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        challengeId,
        userId,
        score,
        time: totalTime
      })
    })
    .then(res => res.json())
    .then(() => setIsFinished(true));
  };

  if (!challengeId) return <div className="p-8 text-center">Lỗi dữ liệu trận đấu.</div>;

  if (isFinished) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-4xl font-bold text-purple-700 mb-4">HOÀN THÀNH THỬ THÁCH!</h2>
        <p className="text-2xl mb-8">Bạn đạt {score}/10 câu đúng.</p>
        <p className="mb-8 italic">Kết quả sẽ được cập nhật sau khi đối thủ hoàn tất.</p>
        <button onClick={() => navigate('/pvp')} className="btn-historical">Quay lại Võ Đài</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="p-6 min-h-screen max-w-2xl mx-auto flex flex-col">
      <div className="mb-8 flex justify-between items-center bg-purple-100 p-4 rounded-lg border-2 border-purple-300">
        <span className="font-bold text-purple-900">CÂU HỎI: {currentIndex + 1}/10</span>
        <span className="font-bold text-purple-900">ĐIỂM: {score}</span>
      </div>

      <div className="historical-card flex-1 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-10">"{currentQuestion.content}"</h2>
        <Questions question={currentQuestion} onAnswer={handleAnswer} feedback={feedback} />
        
        {feedback && (
          <div className="mt-8 text-center">
            <p className={`text-xl font-bold ${feedback.correct ? 'text-green-600' : 'text-red-600'}`}>
              {feedback.message}
            </p>
            <button onClick={nextQuestion} className="mt-4 px-8 py-2 bg-purple-700 text-white rounded-lg font-bold">
              Tiếp Theo ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
