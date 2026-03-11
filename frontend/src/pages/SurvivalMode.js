import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Questions from '../components/Questions';
import Lives from '../components/Lives';

export default function SurvivalMode() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy tất cả câu hỏi ngẫu nhiên cho chế độ sinh tồn
    fetch(`http://localhost:5000/api/questions/all`)
      .then(res => {
          if (!res.ok) throw new Error("Chưa có API /all");
          return res.json();
      })
      .then(data => {
        setQuestions(data.sort(() => Math.random() - 0.5));
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải câu hỏi:", err);
        // Fallback: Nếu backend chưa có route /all, có thể báo lỗi hoặc fetch đại 1 lesson
        setLoading(false);
      });
  }, []);

  const handleAnswer = (userAnswer) => {
    const question = questions[currentIndex];
    const userId = localStorage.getItem('userId');

    fetch('http://localhost:5000/api/submit-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        questionId: question._id, 
        userAnswer,
        userId: userId
      })
    })
    .then(res => res.json())
    .then(data => {
      setFeedback(data);
      if (data.correct) {
        setScore(prev => prev + data.experienceGain);
      } else {
        setLives(prev => Math.max(0, prev - 1));
      }
    })
    .catch(err => console.error("Lỗi khi gửi đáp án:", err));
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      alert(`Đại thắng! Bạn đã vượt qua tất cả thử thách với ${score} điểm!`);
      navigate('/modes');
    }
  };

  if (loading) return <div className="p-8 text-center text-amber-900 font-bold">Đang dàn trận...</div>;
  if (questions.length === 0) return (
    <div className="p-8 text-center">
        <p className="text-red-800 mb-4">Chưa thể tải dữ liệu câu hỏi.</p>
        <button onClick={() => navigate('/modes')} className="btn-historical">Quay lại</button>
    </div>
  );

  if (lives <= 0) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-4xl font-bold text-red-600 mb-4">Sử Sách Đã Khép</h2>
        <p className="text-xl mb-8">Bạn đã anh dũng hy sinh. Hãy tu dưỡng thêm để quay lại!</p>
        <button onClick={() => navigate('/modes')} className="btn-historical">Rút Quân về Sa Bàn</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="p-6 min-h-screen max-w-2xl mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-12">
        <button onClick={() => navigate('/modes')} className="text-deep-bronze font-bold">Thoát</button>
        <div className="text-red-600 font-bold text-xl flex items-center gap-2">
            🔥 SINH TỒN
        </div>
        <Lives count={lives} />
      </div>

      <div className="historical-card flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-8 p-4 border-b-2 border-amber-100 w-full flex justify-between">
          <span className="text-amber-800 font-bold uppercase text-sm">Câu số {currentIndex + 1}</span>
          <span className="text-amber-800 font-bold uppercase text-sm">Điểm: {score}</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-10 italic">"{currentQuestion.content}"</h2>
        
        <Questions question={currentQuestion} onAnswer={handleAnswer} feedback={feedback} />

        {feedback && (
          <div className={`mt-8 p-6 rounded-lg w-full border-2 ${feedback.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <p className="font-bold text-xl mb-2">{feedback.message}</p>
            <button onClick={nextQuestion} className="px-8 py-3 bg-amber-700 text-white rounded-lg font-bold">Kế Tiếp ➔</button>
          </div>
        )}
      </div>
    </div>
  );
}
