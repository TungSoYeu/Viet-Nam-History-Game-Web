import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Questions from '../components/Questions';
import API_BASE_URL from '../config/api';
import AnimatedPage from '../components/animations/AnimatedPage';
import BouncyButton from '../components/animations/BouncyButton';
import ParticlesBackground from '../components/animations/ParticlesBackground';

export default function PvPBattle() {
  const navigate = useNavigate();
  const location = useLocation();
  const { challengeId, questions: initialQuestions } = location.state || {};
  
  const [questions] = useState(initialQuestions || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (userAnswer) => {
    const question = questions[currentIndex];
    if (!question) return;

    const userStr = String(userAnswer || "").toLowerCase().trim();
    const correctStr = String(question.correctAnswer || "").toLowerCase().trim();
    const isCorrect = userStr === correctStr;
    
    setFeedback({
      correct: isCorrect,
      message: isCorrect ? "Chính xác!" : "Sai rồi!",
      correctAnswer: isCorrect ? null : question.correctAnswer,
      explanation: question.explanation
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

    fetch(`${API_BASE_URL}/api/pvp/submit`, {
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

  if (!challengeId || !questions || questions.length === 0) {
    return (
      <AnimatedPage>
        <div className="p-8 text-center flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
          <h2 className="text-2xl font-bold text-red-500 mb-4 uppercase tracking-widest">Mất kết nối với trận đấu</h2>
          <p className="mb-8 opacity-70">Dữ liệu trận đấu không khả dụng (có thể do bạn đã tải lại trang).</p>
          <BouncyButton onClick={() => navigate('/pvp')}>
            <div className="btn-primary px-8 py-3">Quay lại Võ Đài</div>
          </BouncyButton>
        </div>
      </AnimatedPage>
    );
  }

  if (isFinished) {
    return (
      <AnimatedPage>
        <div className="p-8 text-center flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white relative">
          <ParticlesBackground type="embers" />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10"
          >
            <h2 className="text-4xl font-black text-amber-400 mb-4 uppercase tracking-tighter drop-shadow-lg">HOÀN THÀNH THỬ THÁCH!</h2>
            <p className="text-2xl mb-8">Bạn đạt <span className="text-amber-500 font-black">{score}/10</span> câu đúng.</p>
            <p className="mb-8 italic opacity-60">Kết quả sẽ được cập nhật sau khi đối thủ hoàn tất.</p>
            <BouncyButton onClick={() => navigate('/pvp')}>
              <div className="btn-primary px-10 py-4 text-lg">Quay lại Võ Đài</div>
            </BouncyButton>
          </motion.div>
        </div>
      </AnimatedPage>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-slate-900 text-white relative flex flex-col p-6">
        <ParticlesBackground type="embers" />
        
        <div className="relative z-10 max-w-2xl mx-auto w-full flex-1 flex flex-col">
          <div className="mb-8 flex justify-between items-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl">
            <span className="font-bold text-amber-400 tracking-wider">CÂU HỎI: {currentIndex + 1}/10</span>
            <div className="flex items-center gap-2">
               <span className="text-xs opacity-50 uppercase font-bold">Điểm số</span>
               <span className="font-black text-white text-xl">{score}</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="historical-card flex-1 flex flex-col items-center justify-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-[2rem] p-8 shadow-2xl"
            >
              <h2 className="text-2xl sm:text-3xl font-black mb-10 text-center leading-tight">
                "{currentQuestion.content}"
              </h2>
              
              <div className="w-full">
                <Questions question={currentQuestion} onAnswer={handleAnswer} feedback={feedback} />
              </div>
              
              {feedback && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`mt-8 p-6 rounded-2xl w-full border ${feedback.correct ? 'bg-green-500/20 border-green-500/40 text-green-100' : 'bg-red-500/20 border-red-500/40 text-red-100'}`}
                >
                  <p className="font-black text-xl mb-2 flex items-center gap-2">
                    {feedback.correct ? "✓ CHÍNH XÁC!" : "✗ SAI RỒI!"}
                  </p>
                    <p className="mb-4 italic opacity-80 leading-relaxed text-sm">
                      Đáp án và phần giải thích sẽ chỉ được công bố khi kết thúc trận đấu.
                    </p>
                    <BouncyButton onClick={nextQuestion} className="w-full sm:w-auto">
                      <div className="px-8 py-3 bg-white text-slate-900 rounded-xl font-black uppercase tracking-wider text-sm">
                        Tiếp Theo ➔
                    </div>
                  </BouncyButton>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AnimatedPage>
  );
}
