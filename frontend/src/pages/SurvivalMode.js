import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, AlertCircle, Swords, ArrowLeft, ChevronRight } from 'lucide-react';
import Questions from '../components/Questions';
import PeriodSelector from '../components/PeriodSelector';
import Confetti from '../components/animations/Confetti';
import ComboIndicator from '../components/animations/ComboIndicator';
import API_BASE_URL from '../config/api';
import { buildApiHeaders, buildApiUrl } from '../utils/classroomContext';

export default function SurvivalMode() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState(null); 
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  useEffect(() => {
    if (!selectedPeriod) return;

    setLoading(true);
    const endpoint = selectedPeriod === 'all' 
        ? '/api/questions/all' 
        : `/api/questions/${selectedPeriod}`;

    fetch(buildApiUrl(endpoint), {
      headers: buildApiHeaders({ includeJson: false }),
    })
      .then(res => res.json())
      .then(data => {
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

    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch(`${API_BASE_URL}/api/submit-answer`, {
      method: 'POST',
      headers,
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
        setStreak(prev => prev + 1);
      } else {
        setStreak(0);
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
        description="Vượt qua 10 câu hỏi hiểm hóc. Sai 1 câu là phải chơi lại từ đầu!"
        onSelect={(id) => setSelectedPeriod(id)}
        onBack={() => navigate('/modes')}
      />
    );
  }

  if (isVictory) {
    return (
      <div className="theme-page game-screen h-screen flex flex-col items-center justify-center p-6 text-center overflow-y-auto overflow-x-hidden custom-scrollbar">
        <Confetti active={true} count={80} />
        <div className="animate-bounce-in">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.1))', border: '2px solid rgba(34,197,94,0.3)' }}>
            <Trophy size={48} className="text-green-400" />
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black mb-3 uppercase" style={{ background: 'linear-gradient(135deg, #86efac, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chinh Phục Thành Công!</h2>
        <p className="text-base mb-8 max-w-md game-text-muted">Bạn đã vượt qua 10 thử thách lịch sử với số điểm tuyệt đối!</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => window.location.reload()} className="px-8 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>🔄 Tiếp Tục Ải Khác</button>
          <button onClick={() => navigate('/modes')} className="px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]" style={{ background: 'var(--game-surface-subtle)', border: '1px solid var(--game-border)', color: 'var(--game-text-secondary)' }}>← Về Sa Bàn</button>
        </div>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="theme-page game-screen h-screen flex flex-col items-center justify-center p-6 text-center overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="animate-shake">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1))', border: '2px solid rgba(239,68,68,0.3)' }}>
            <AlertCircle size={48} className="text-red-400" />
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black mb-3 uppercase" style={{ background: 'linear-gradient(135deg, #fca5a5, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Thử Thách Thất Bại</h2>
        <p className="text-base mb-8 max-w-md italic game-text-muted">"Chưa đủ kiến thức để vượt ải. Hãy quay lại dùi mài sử học!"</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => window.location.reload()} className="px-8 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}>🔄 Thử Lại Ngay</button>
          <button onClick={() => navigate('/timeline')} className="px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]" style={{ background: 'var(--game-surface-subtle)', border: '1px solid var(--game-border)', color: 'var(--game-text-secondary)' }}>📚 Vào Học Thuật</button>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="theme-page game-screen h-screen flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-t-red-400 border-r-transparent border-b-transparent border-l-transparent animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold game-text-muted">Đang dàn trận...</p>
      </div>
    </div>
  );

  if (questions.length === 0) return (
    <div className="theme-page game-screen h-screen flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 mb-4 font-semibold">Chưa thể tải dữ liệu câu hỏi.</p>
        <button onClick={() => navigate('/modes')} className="btn-primary px-6 py-3 text-sm">Quay lại</button>
      </div>
    </div>
  );

  const currentQuestion = questions[currentIndex];

  return (
    <div className="theme-page game-screen h-screen flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar p-4 sm:p-6 bg-transparent relative z-10 text-white">
      <ComboIndicator streak={streak} show={!loading && !isFailed && !isVictory} />
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col min-h-0 custom-scrollbar overflow-y-auto pr-1 pb-4">
        {/* Top Bar */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-6">
          <div className="flex justify-start">
            <button onClick={() => navigate('/modes')} className="text-sm font-semibold flex items-center gap-1 transition-colors" style={{ color: 'var(--game-text-muted)' }}>
              <ArrowLeft size={18} /> <span className="hidden sm:inline">Thoát</span>
            </button>
          </div>
          <div className="flex justify-center flex-col sm:flex-row items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Swords size={16} className="text-red-400 hidden sm:block" />
            <span className="text-xs font-bold text-red-400 uppercase text-center">Tử Chiến</span>
          </div>
          <div className="flex justify-end">
            <span className="text-sm font-bold" style={{ color: 'var(--game-text-secondary)' }}>{currentIndex + 1}/10</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar mb-6">
          <div className="progress-bar-fill" style={{ width: `${((currentIndex + 1) / 10) * 100}%` }}></div>
        </div>

        {/* Question Card */}
          <div className="flex-1 flex flex-col rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl" style={{ background: 'var(--game-surface-strong)', border: '1px solid var(--game-border)' }}>
          <div className="flex justify-between mb-6">
            <span className="text-xs font-bold uppercase" style={{ color: 'rgba(212,160,83,0.7)' }}>Thử thách #{currentIndex + 1}</span>
            <span className="score-badge gold">⭐ {score} XP</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold mb-8 leading-relaxed" style={{ color: 'var(--game-text)' }}>"{currentQuestion.content}"</h2>
          
          <Questions question={currentQuestion} onAnswer={handleAnswer} feedback={feedback} />

          {feedback && (
            <div className={`mt-6 p-5 rounded-xl border animate-fade-in ${feedback.correct ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
              <p className={`font-bold text-base mb-2 ${feedback.correct ? 'text-green-400' : 'text-red-400'}`}>{feedback.correct ? '✅' : '❌'} {feedback.message}</p>
              <p className="text-sm italic mb-4 game-text-muted">
                Đáp án và giải thích sẽ chỉ được công bố khi hoàn thành chế độ.
              </p>
              <button onClick={nextQuestion} className="btn-primary px-6 py-3 text-sm flex items-center gap-2 mx-auto">
                Kế Tiếp <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

