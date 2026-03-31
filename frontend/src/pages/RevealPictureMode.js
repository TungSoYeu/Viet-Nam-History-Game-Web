import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, HelpCircle, Trophy, X, Search, CheckCircle } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

export default function RevealPictureMode() {
  const navigate = useNavigate();
  const [pictureData, setPictureData] = useState(null);
  const [tileQuestions, setTileQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revealedTiles, setRevealedTiles] = useState([]);
  const [selectedTile, setSelectedTile] = useState(null);
  const [answerInput, setAnswerInput] = useState('');
  const [guessFullImage, setGuessFullImage] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(100); // Điểm khởi điểm, mở mỗi ô trừ dần

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/reveal-picture/random`);
        setPictureData({
          imageUrl: res.data.imageUrl,
          answer: res.data.answer
        });
        setTileQuestions(res.data.questions);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reveal picture:", err);
        alert("Lỗi tải dữ liệu!");
        navigate('/modes');
      }
    };
    fetchData();
  }, [navigate]);

  const saveXP = async (xpGained) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      await axios.post(`${API_BASE_URL}/api/user/add-xp`, { userId, xp: xpGained });
    } catch (err) {
      console.error("Error saving XP:", err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-amber-500" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>Đang tải bức tranh bí ẩn...</div>;

  const handleTileClick = (index) => {
    if (revealedTiles.includes(index)) return;
    setSelectedTile(index);
    setAnswerInput('');
  };

  // Helper function to remove Vietnamese diacritics
  const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
  };

  const handleAnswerSubmit = () => {
    const userAnsClean = removeAccents(answerInput.toLowerCase().trim());
    const correctAnsClean = removeAccents(tileQuestions[selectedTile].a.toLowerCase().trim());
    
    // Split correct answer into significant words (ignore short words like "và", "của", "là")
    const correctWords = correctAnsClean.split(' ').filter(w => w.length > 2);
    
    // Check if user answer is an exact match OR contains the full correct answer OR contains at least 70% of the significant words of the correct answer
    const exactMatch = userAnsClean === correctAnsClean;
    const containsCorrect = userAnsClean.length > 2 && (userAnsClean.includes(correctAnsClean) || correctAnsClean.includes(userAnsClean));
    const wordsMatched = correctWords.some(word => userAnsClean.includes(word));

    if (exactMatch || containsCorrect || (correctWords.length > 0 && wordsMatched)) {
      setRevealedTiles([...revealedTiles, selectedTile]);
      setScore(prev => prev - 5); // Mỗi ô lật ra bị trừ 5 điểm thưởng cuối
    } else {
      alert(`Chưa chính xác! Đáp án đúng là: ${tileQuestions[selectedTile].a}`);
      // Lật luôn nhưng trừ nặng điểm để tránh bế tắc
      setRevealedTiles([...revealedTiles, selectedTile]);
      setScore(prev => prev - 15);
    }
    setSelectedTile(null);
  };

  const handleGuessImage = () => {
    const userGuessClean = removeAccents(guessFullImage.toLowerCase().trim());
    const correctGuessClean = removeAccents(pictureData.answer.toLowerCase().trim());
    
    const correctWords = correctGuessClean.split(' ').filter(w => w.length > 2);
    const wordsMatchedCount = correctWords.filter(word => userGuessClean.includes(word)).length;
    const isMostlyCorrect = correctWords.length > 0 && wordsMatchedCount >= Math.ceil(correctWords.length * 0.5);

    if (userGuessClean === correctGuessClean || 
        (userGuessClean.length > 3 && (userGuessClean.includes(correctGuessClean) || correctGuessClean.includes(userGuessClean))) ||
        isMostlyCorrect
    ) {
      setIsFinished(true);
      saveXP(score > 0 ? score : 10);
    } else {
      alert("Chưa chính xác! Hãy lật thêm ô hoặc quan sát kỹ hơn.");
      setScore(prev => Math.max(0, prev - 10)); // Không để điểm âm
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <div className="p-8 rounded-3xl shadow-2xl max-w-xl w-full text-center animate-bounce-in" style={{ background: '#16213e', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
          <h2 className="text-3xl md:text-4xl font-black text-amber-400 mb-4 uppercase drop-shadow-md">Nhãn Quan Sắc Bén!</h2>
          <p className="text-xl font-bold text-white mb-6">Đây chính là <span className="text-amber-500 uppercase">{pictureData.answer}</span></p>
          <img src={pictureData.imageUrl} alt="Result" className="w-full h-auto max-h-64 object-cover rounded-xl mb-6 shadow-2xl" style={{ border: '2px solid rgba(255,255,255,0.1)' }} />
          <p className="text-2xl font-black text-green-400 mb-8 drop-shadow-sm">Phần thưởng: {score > 0 ? score : 10} XP</p>
          <div className="flex gap-4">
              <button onClick={() => window.location.reload()} className="btn-primary flex-1 py-4 text-sm font-bold bg-white/10 hover:bg-white/20 text-white transition rounded-xl">Thử tranh khác</button>
              <button onClick={() => navigate('/modes')} className="btn-primary flex-1 py-4 text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white transition rounded-xl">Trở về</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="w-full max-w-4xl grid grid-cols-[1fr_auto_1fr] items-center mb-6 gap-2">
        <div className="flex justify-start">
          <button onClick={() => navigate('/modes')} className="btn-primary px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition">
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Thoát</span>
          </button>
        </div>
        <h1 className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-widest text-center flex items-center justify-center gap-2 drop-shadow-md text-white" style={{ background: 'linear-gradient(135deg, #f0d48a 0%, #d4a053 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <ImageIcon size={24} className="text-amber-500 hidden sm:block" /> Lật Mở Tranh Cổ
        </h1>
        <div className="flex justify-end">
          <div className="text-xs sm:text-sm md:text-lg font-bold text-amber-400 px-3 py-1.5 md:px-4 md:py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>+{score} XP</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        {/* VÙNG ẢNH VÀ LƯỚI CHE */}
        <div className="flex-1 relative w-full aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-2xl" style={{ border: '4px solid rgba(212,160,83,0.3)', background: '#0f3460' }}>
          {/* Ảnh nền thực sự (dùng ảnh nền CSS để không bị vỡ layout nếu URL lỗi) */}
          <div 
            className="absolute inset-0 w-full h-full transition-all duration-1000"
            style={{ 
                backgroundImage: `url("${pictureData.imageUrl}")`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#1E293B'
            }}
          />
          
          {/* Lưới 3x3 che đè lên */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <div 
                key={index} 
                onClick={() => handleTileClick(index)}
                className={`border origin-center flex items-center justify-center transition-all duration-700 cursor-pointer shadow-lg backdrop-blur-md
                  ${revealedTiles.includes(index) ? 'opacity-0 pointer-events-none scale-0 rotate-[360deg]' : 'hover:scale-[1.02] hover:z-10 hover:shadow-2xl'}`}
                style={!revealedTiles.includes(index) ? {
                  background: 'linear-gradient(135deg, rgba(30,58,138,0.95) 0%, rgba(15,23,42,0.98) 100%)',
                  borderColor: 'rgba(212,160,83,0.5)',
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)'
                } : {}}
              >
                {!revealedTiles.includes(index) && (
                  <span className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-200 to-amber-600 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">?</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* VÙNG ĐOÁN TÊN TRANH */}
        <div className="w-full md:w-80 flex flex-col justify-center p-6 rounded-2xl shadow-xl border" style={{ background: '#16213e', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h3 className="text-xl font-black text-white uppercase mb-4 text-center border-b pb-4 flex items-center justify-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <Search size={20} className="text-amber-500" /> Giải Mã
          </h3>
          <p className="text-sm mb-6 text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>Nhập tên sự kiện, trận đánh hoặc nhân vật có trong bức tranh này.</p>
          <input 
            type="text" 
            placeholder="Ví dụ: Trận Bạch Đằng..."
            value={guessFullImage}
            onChange={(e) => setGuessFullImage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGuessImage()}
            className="w-full p-4 rounded-xl outline-none font-bold text-lg text-center text-white mb-6 transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <button onClick={handleGuessImage} className="btn-primary py-4 w-full text-lg font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition">Xác Nhận Đoán</button>
        </div>
      </div>

      {/* POPUP HỎI ĐÁP ĐỂ MỞ Ô */}
      {selectedTile !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4 animate-fade-in" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full relative border" style={{ background: '#16213e', borderColor: 'rgba(212,160,83,0.3)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <h3 className="text-xl font-black text-amber-500 uppercase flex items-center gap-2">
                <HelpCircle size={24} /> Thử Thách Mở Ô
              </h3>
              <button onClick={() => setSelectedTile(null)} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            <p className="text-xl font-bold text-white mb-8 leading-relaxed text-center">
              {tileQuestions[selectedTile].q}
            </p>
            <input 
              type="text" 
              placeholder="Nhập câu trả lời ngắn gọn..."
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnswerSubmit()}
              autoFocus
              className="w-full p-4 rounded-xl outline-none font-bold text-lg mb-6 text-center text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,160,83,0.3)' }}
            />
            <button onClick={handleAnswerSubmit} className="btn-primary py-4 w-full text-lg font-bold bg-green-600 hover:bg-green-500 text-white rounded-xl transition">
              Trả Lời & Lật Ô
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
