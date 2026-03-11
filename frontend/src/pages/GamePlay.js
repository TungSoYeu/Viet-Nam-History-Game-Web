// frontend/src/pages/GamePlay.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Questions from '../components/Questions';
import Lives from '../components/Lives';

export default function GamePlay() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/questions/${lessonId}`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải câu hỏi:", err);
        setLoading(false);
      });
  }, [lessonId]);

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
      alert(`Chúc mừng! Bạn đã hoàn thành triều đại này với ${score} điểm!`);
      navigate('/timeline');
    }
  };

  if (loading) return <div className="p-8 text-center text-amber-900">Đang chuẩn bị thử thách...</div>;
  if (questions.length === 0) return <div className="p-8 text-center text-red-800">Không có câu hỏi nào cho triều đại này.</div>;
  if (lives <= 0) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-4xl font-bold text-red-600 mb-4">Dập Tắt Ngọn Nến</h2>
        <p className="text-xl mb-8">Rất tiếc, bạn đã hết sinh mệnh. Hãy ôn tập lại lịch sử nhé!</p>
        <button onClick={() => navigate('/timeline')} className="btn-historical">Quay lại Dòng Thời Gian</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="p-6 min-h-screen max-w-2xl mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-12">
        <button 
          onClick={() => navigate('/timeline')} 
          className="text-deep-bronze font-bold flex items-center gap-2 hover:opacity-70 transition"
        >
          <span className="text-xl">📜</span> Thoát
        </button>
        <div className="flex-1 bg-amber-100 h-3 rounded-full mx-8 border border-amber-200 shadow-inner">
          <div 
            className="bg-yellow-600 h-3 rounded-full shadow-sm transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <Lives count={lives} />
      </div>

      <div className="historical-card flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-8 p-4 border-b-2 border-amber-100 w-full flex justify-between">
          <span className="text-amber-800 font-bold tracking-widest uppercase text-sm">CÂU HỎI {currentIndex + 1}/{questions.length}</span>
          <span className="text-amber-800 font-bold tracking-widest uppercase text-sm">ĐIỂM: {score}</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-10 leading-relaxed px-4 italic">
          "{currentQuestion.content}"
        </h2>
        <div className="w-full">
          <Questions 
            question={currentQuestion} 
            onAnswer={handleAnswer} 
            feedback={feedback}
          />
        </div>

        {feedback && (
          <div className={`mt-8 p-6 rounded-lg w-full transition-all border-2 ${feedback.correct ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <p className="font-bold text-xl mb-2">{feedback.message}</p>
            {feedback.explanation && (
              <p className="mb-6 italic text-gray-700 leading-relaxed">
                <span className="font-bold">Sử ký ghi lại:</span> "{feedback.explanation}"
              </p>
            )}
            <button 
              onClick={nextQuestion}
              className="px-8 py-3 bg-amber-700 text-white rounded-lg font-bold hover:bg-amber-800 transition shadow-lg"
            >
              Tiếp Theo ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
}