import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Questions from '../components/Questions';
import PeriodSelector from '../components/PeriodSelector';

export default function TimeAttackMode() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (!selectedPeriod) return;

    setLoading(true);
    const endpoint = selectedPeriod === 'all' 
        ? '/api/questions/all' 
        : `/api/questions/${selectedPeriod}`;

    fetch(`http://localhost:5000${endpoint}`)
      .then(res => res.json())
      .then(data => {
        // Shuffle and take only 10 questions for Time Attack Mode
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

  useEffect(() => {
    if (loading || isGameOver || timeLeft <= 0 || !selectedPeriod) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isGameOver, timeLeft, selectedPeriod]);

  const handleAnswer = (userAnswer) => {
    const question = questions[currentIndex];
    const userId = localStorage.getItem('userId');

    fetch('http://localhost:5000/api/submit-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        questionId: question._id, 
        userAnswer, 
        userId, 
        mode: 'timeAttack' 
      })
    })
    .then(res => res.json())
    .then(data => {
      setFeedback(data);
      if (data.correct) {
        setScore(prev => prev + 20 + (combo * 5));
        setCombo(prev => prev + 1);
        // Cộng thêm thời gian cho mỗi câu đúng (3s) + combo bonus
        setTimeLeft(prev => Math.min(120, prev + 3 + Math.floor(combo / 2)));
      } else {
        setCombo(0);
        // Trừ thời gian nếu sai (5s)
        setTimeLeft(prev => Math.max(0, prev - 5));
      }
    });
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsGameOver(true);
    }
  };

  if (!selectedPeriod) {
    return (
      <PeriodSelector 
        title="Thử Thách Nén Nhang"
        description="Hãy chọn thời kỳ bạn am hiểu nhất để chạy đua với thời gian!"
        onSelect={(id) => setSelectedPeriod(id)}
        onBack={() => navigate('/modes')}
      />
    );
  }

  if (loading) return <div className="p-8 text-center text-blue-900 font-bold">Đang mồi lửa nén nhang...</div>;

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-800 mb-4 font-bold">Chưa có dữ liệu câu hỏi cho thử thách này!</p>
        <button onClick={() => navigate('/modes')} className="btn-historical">Quay lại Sa Bàn</button>
      </div>
    );
  }

  if (isGameOver || timeLeft <= 0) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-4xl font-bold text-red-700 mb-4">NHANG ĐÃ TÀN!</h2>
        <p className="text-2xl mb-2 font-bold">Điểm số đạt được: {score}</p>
        <p className="text-lg mb-8 italic">Vận tốc lật mở sử sách thật đáng nể!</p>
        <button onClick={() => navigate('/modes')} className="btn-historical">Quay lại Sa Bàn</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  // Tính % chiều dài nén nhang (60s mặc định ban đầu là 100%)
  const incenseHeight = (timeLeft / 60) * 100;

  return (
    <div className="p-6 min-h-screen max-w-4xl mx-auto flex gap-8">
      {/* Cột trái: Nén nhang (Incense burning) */}
      <div className="w-24 flex flex-col items-center justify-end pb-12 relative">
        <div className="text-sm font-bold text-amber-900 mb-2 uppercase vertical-text">Nén Nhang Thời Gian</div>
        <div className="w-6 h-96 bg-gray-200 rounded-full overflow-hidden flex flex-col justify-end border-2 border-amber-900 p-0.5">
          <div 
            className="w-full bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-full transition-all duration-1000 relative"
            style={{ height: `${Math.min(100, incenseHeight)}%` }}
          >
            {/* Đốm lửa đang cháy */}
            <div className="absolute top-0 left-0 w-full h-2 bg-white animate-pulse shadow-[0_0_15px_rgba(255,165,0,0.8)]"></div>
          </div>
        </div>
        <div className="w-12 h-6 bg-amber-800 mt-0 rounded-b-lg shadow-lg"></div>
        <div className="text-2xl font-bold mt-4 text-red-600">{timeLeft}s</div>
      </div>

      {/* Cột phải: Game Play */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate('/modes')} className="btn-historical px-4 flex items-center gap-1">
            <ArrowLeft size={18} /> Thoát
          </button>
          <div className="flex gap-4">
            <div className="bg-orange-100 px-4 py-2 rounded-lg border border-orange-300">
               <span className="text-sm text-orange-800 font-bold uppercase">Combo:</span>
               <span className="text-2xl font-black text-orange-600 ml-2">{combo}</span>
            </div>
            <div className="bg-amber-100 px-4 py-2 rounded-lg border border-amber-300">
               <span className="text-sm text-amber-800 font-bold uppercase">Điểm:</span>
               <span className="text-2xl font-black text-amber-600 ml-2">{score}</span>
            </div>
          </div>
        </div>

        <div className="historical-card flex-1 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 leading-relaxed italic">"{currentQuestion.content}"</h2>
          
          <Questions question={currentQuestion} onAnswer={handleAnswer} feedback={feedback} />

          {feedback && (
            <div className={`mt-8 p-6 rounded-lg w-full border-2 animate-fade-in ${feedback.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className="font-bold text-2xl mb-2">{feedback.message}</p>
              {feedback.correct ? (
                <p className="text-green-600 font-bold">+3 giây nhang!</p>
              ) : (
                <p className="text-red-600 font-bold">-5 giây nhang!</p>
              )}
              <button onClick={nextQuestion} className="mt-4 px-12 py-3 bg-amber-700 text-white rounded-lg font-bold hover:bg-amber-800 transition shadow-lg flex items-center gap-2 mx-auto justify-center">
                Kế Tiếp <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
