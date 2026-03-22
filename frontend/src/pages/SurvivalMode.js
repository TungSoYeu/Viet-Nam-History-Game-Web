import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, AlertCircle, Swords, ArrowLeft, ChevronRight } from 'lucide-react';
import Questions from '../components/Questions';
import PeriodSelector from '../components/PeriodSelector';
import API_BASE_URL from '../config/api';

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

    fetch(`${API_BASE_URL}${endpoint}`)
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

    fetch(`${API_BASE_URL}/api/submit-answer`, {
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
        description="Vượt qua 10 câu hỏi hiểm hóc. Sai 1 câu là phải chơi lại từ đầu!"
        onSelect={(id) => setSelectedPeriod(id)}
        onBack={() => navigate('/modes')}
      />
    );
  }

  if (isVictory) {
    return (
      <div className="p-6 text-center flex flex-col items-center justify-center min-h-screen" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(34,197,94,0.1) 0%, #1a1a2e 70%)' }}>
        <div className="animate-bounce-in">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.1))', border: '2px solid rgba(34,197,94,0.3)' }}>
            <Trophy size={48} className="text-green-400" />
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black mb-3 uppercase" style={{ background: 'linear-gradient(135deg, #86efac, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chinh Phục Thành Công!</h2>
        <p className="text-base mb-8 max-w-md" style={{ color: 'rgba(255,255,255,0.5)' }}>Bạn đã vượt qua 10 thử thách lịch sử với số điểm tuyệt đối!</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => window.location.reload()} className="px-8 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>🔄 Tiếp Tục Ải Khác</button>
          <button onClick={() => navigate('/modes')} className="px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>← Về Sa Bàn</button>
        </div>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="p-6 text-center flex flex-col items-center justify-center min-h-screen" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(239,68,68,0.08) 0%, #1a1a2e 70%)' }}>
        <div className="animate-shake">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1))', border: '2px solid rgba(239,68,68,0.3)' }}>
            <AlertCircle size={48} className="text-red-400" />
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black mb-3 uppercase" style={{ background: 'linear-gradient(135deg, #fca5a5, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Thử Thách Thất Bại</h2>
        <p className="text-base mb-8 max-w-md italic" style={{ color: 'rgba(255,255,255,0.5)' }}>"Chưa đủ kiến thức để vượt ải. Hãy quay lại dùi mài sử học!"</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => window.location.reload()} className="px-8 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}>🔄 Thử Lại Ngay</button>
          <button onClick={() => navigate('/timeline')} className="px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>📚 Vào Học Thuật</button>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-t-red-400 border-r-transparent border-b-transparent border-l-transparent animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Đang dàn trận...</p>
      </div>
    </div>
  );

  if (questions.length === 0) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="text-center">
        <p className="text-red-400 mb-4 font-semibold">Chưa thể tải dữ liệu câu hỏi.</p>
        <button onClick={() => navigate('/modes')} className="btn-primary px-6 py-3 text-sm">Quay lại</button>
      </div>
    </div>
  );

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate('/modes')} className="text-sm font-semibold flex items-center gap-1 transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <ArrowLeft size={18} /> Thoát
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Swords size={16} className="text-red-400" />
            <span className="text-xs font-bold text-red-400 uppercase">10/10</span>
          </div>
          <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>{currentIndex + 1} / 10</span>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar mb-6">
          <div className="progress-bar-fill" style={{ width: `${((currentIndex + 1) / 10) * 100}%` }}></div>
        </div>

        {/* Question Card */}
        <div className="flex-1 flex flex-col rounded-2xl p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex justify-between mb-6">
            <span className="text-xs font-bold uppercase" style={{ color: 'rgba(212,160,83,0.7)' }}>Thử thách #{currentIndex + 1}</span>
            <span className="score-badge gold">⭐ {score} XP</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-8 leading-relaxed">"{currentQuestion.content}"</h2>
          
          <Questions question={currentQuestion} onAnswer={handleAnswer} feedback={feedback} />

          {feedback && (
            <div className={`mt-6 p-5 rounded-xl border animate-fade-in ${feedback.correct ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
              <p className={`font-bold text-base mb-2 ${feedback.correct ? 'text-green-400' : 'text-red-400'}`}>{feedback.correct ? '✅' : '❌'} {feedback.message}</p>
              {feedback.explanation && (
                <p className="text-sm italic mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>"{feedback.explanation}"</p>
              )}
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

