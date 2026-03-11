import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Questions from '../components/Questions';
import Lives from '../components/Lives';
import PeriodSelector from '../components/PeriodSelector';

export default function SurvivalMode() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState(null); // 'all' or lessonId
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  useEffect(() => {
    if (!selectedPeriod) return;

    setLoading(true);
    const endpoint = selectedPeriod === 'all' 
        ? '/api/questions/all' 
        : `/api/questions/${selectedPeriod}`;

    fetch(`http://localhost:5000${endpoint}`)
      .then(res => res.json())
      .then(data => {
        // Shuffle and take only 10 questions for Challenge Mode
        const sampledQuestions = data
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
        setQuestions(sampledQuestions);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải câu hỏi:", err);
        setLoading(false);
      });
  }, [selectedPeriod]);

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
        // Strict Rule: One mistake = Failure
        setIsFailed(true);
      }
    })
    .catch(err => console.error("Lỗi khi gửi đáp án:", err));
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsVictory(true);
    }
  };

  if (!selectedPeriod) {
    return (
      <PeriodSelector 
        title="Chinh Phục Sử Việt"
        description="Vượt qua 10 câu hỏi hiểm hóc của một thời kỳ để được vinh danh. Lưu ý: Sai 1 câu là phải chơi lại từ đầu!"
        onSelect={(id) => setSelectedPeriod(id)}
        onBack={() => navigate('/modes')}
      />
    );
  }

  if (isVictory) {
      return (
        <div className="p-8 text-center flex flex-col items-center justify-center min-h-screen bg-green-50">
          <div className="text-8xl mb-6">🏆</div>
          <h2 className="text-5xl font-black text-green-700 mb-4 uppercase">Chinh Phục Thành Công!</h2>
          <p className="text-2xl mb-8 text-green-900 font-bold">Bạn đã vượt qua 10 thử thách lịch sử với số điểm tuyệt đối!</p>
          <div className="flex gap-4">
              <button onClick={() => window.location.reload()} className="btn-historical bg-green-700 hover:bg-green-800">Tiếp Tục Ải Khác</button>
              <button onClick={() => navigate('/modes')} className="btn-historical bg-gray-600">Về Sa Bàn</button>
          </div>
        </div>
      );
  }

  if (isFailed) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-screen bg-red-50">
        <div className="text-8xl mb-6">🏮</div>
        <h2 className="text-5xl font-black text-red-700 mb-4 uppercase">Thử Thách Thất Bại</h2>
        <p className="text-2xl mb-8 text-red-900 italic">"Chưa đủ kiến thức để vượt ải. Hãy quay lại dùi mài sử học!"</p>
        <div className="flex gap-4">
            <button onClick={() => window.location.reload()} className="btn-historical bg-red-700 hover:bg-red-800">Thử Lại Ngay</button>
            <button onClick={() => navigate('/timeline')} className="btn-historical bg-amber-700 hover:bg-amber-800">Vào Học Thuật</button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center text-amber-900 font-bold">Đang dàn trận...</div>;
  if (questions.length === 0) return (
    <div className="p-8 text-center">
        <p className="text-red-800 mb-4">Chưa thể tải dữ liệu câu hỏi.</p>
        <button onClick={() => navigate('/modes')} className="btn-historical">Quay lại</button>
    </div>
  );

  const currentQuestion = questions[currentIndex];

  return (
    <div className="p-6 min-h-screen max-w-2xl mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-12">
        <button onClick={() => navigate('/modes')} className="text-deep-bronze font-bold">Thoát</button>
        <div className="text-red-600 font-bold text-xl flex items-center gap-2">
            ⚔️ CHINH PHỤC (10/10)
        </div>
        <div className="text-amber-800 font-black">
            {currentIndex + 1} / 10
        </div>
      </div>

      <div className="historical-card flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-8 p-4 border-b-2 border-amber-100 w-full flex justify-between">
          <span className="text-amber-800 font-bold uppercase text-sm">Thử thách thứ {currentIndex + 1}</span>
          <span className="text-amber-800 font-bold uppercase text-sm">Điểm: {score}</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-10 italic">"{currentQuestion.content}"</h2>
        
        <Questions question={currentQuestion} onAnswer={handleAnswer} feedback={feedback} />

        {feedback && (
          <div className={`mt-8 p-6 rounded-lg w-full border-2 ${feedback.correct ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <p className="font-bold text-xl mb-2">{feedback.message}</p>
            {feedback.explanation && (
                <p className="mb-4 italic text-sm text-gray-600">"{feedback.explanation}"</p>
            )}
            <button onClick={nextQuestion} className="px-8 py-3 bg-amber-700 text-white rounded-lg font-bold">Kế Tiếp ➔</button>
          </div>
        )}
      </div>
    </div>
  );
}
