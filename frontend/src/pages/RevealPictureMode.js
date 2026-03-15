import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, HelpCircle, Trophy, X, Search, CheckCircle } from 'lucide-react';
import axios from 'axios';

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
        const res = await axios.get('http://localhost:5000/api/reveal-picture/random');
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
      await axios.post('http://localhost:5000/api/user/add-xp', { userId, xp: xpGained });
    } catch (err) {
      console.error("Error saving XP:", err);
    }
  };

  if (loading) return <div className="min-h-screen bg-amber-50 text-amber-900 flex items-center justify-center text-2xl font-bold">Đang tải bức tranh bí ẩn...</div>;

  const handleTileClick = (index) => {
    if (revealedTiles.includes(index)) return;
    setSelectedTile(index);
    setAnswerInput('');
  };

  const handleAnswerSubmit = () => {
    const correctAns = tileQuestions[selectedTile].a.toLowerCase();
    if (answerInput.toLowerCase().includes(correctAns) || correctAns.includes(answerInput.toLowerCase())) {
      setRevealedTiles([...revealedTiles, selectedTile]);
      setScore(prev => prev - 5); // Mỗi ô lật ra bị trừ 5 điểm thưởng cuối
    } else {
      alert(`Sai rồi! Đáp án là: ${tileQuestions[selectedTile].a}`);
      // Lật luôn nhưng trừ nặng điểm
      setRevealedTiles([...revealedTiles, selectedTile]);
      setScore(prev => prev - 15);
    }
    setSelectedTile(null);
  };

  const handleGuessImage = () => {
    if (guessFullImage.toLowerCase().trim() === pictureData.answer.toLowerCase()) {
      setIsFinished(true);
      saveXP(score > 0 ? score : 10);
    } else {
      alert("Chưa chính xác! Hãy lật thêm ô hoặc quan sát kỹ hơn.");
      setScore(prev => prev - 10);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen history-bg flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-xl w-full text-center border-4 border-amber-600 animate-bounce-in">
          <h2 className="text-3xl md:text-4xl font-black text-green-600 mb-4 uppercase">Nhãn Quan Sắc Bén!</h2>
          <p className="text-xl font-bold text-gray-700 mb-6">Đây chính là <span className="text-red-600 uppercase">{pictureData.answer}</span></p>
          <img src={pictureData.imageUrl} alt="Result" className="w-full h-auto max-h-64 object-cover rounded-xl mb-6 border-4 border-amber-900" />
          <p className="text-2xl font-black text-amber-600 mb-8">Phần thưởng: {score > 0 ? score : 10} XP</p>
          <div className="flex gap-4">
              <button onClick={() => window.location.reload()} className="btn-historical flex-1 py-4">Thử tranh khác</button>
              <button onClick={() => navigate('/modes')} className="btn-historical flex-1 py-4">Trở về Doanh Trại</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen history-bg p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <button onClick={() => navigate('/modes')} className="btn-historical px-4 flex items-center gap-1">
          <ArrowLeft size={18} /> Thoát
        </button>
        <h1 className="text-2xl md:text-4xl font-black text-amber-900 uppercase tracking-widest text-center flex items-center gap-3">
          <ImageIcon size={32} /> Lật Mở Tranh Cổ
        </h1>
        <div className="text-xl font-bold text-amber-700 bg-amber-100 px-4 py-2 rounded-lg border border-amber-300">Thưởng: {score} XP</div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        {/* VÙNG ẢNH VÀ LƯỚI CHE */}
        <div className="flex-1 relative aspect-square md:aspect-video rounded-xl overflow-hidden border-8 border-amber-900 shadow-2xl bg-black">
          {/* Ảnh nền thực sự */}
          <img src={pictureData.imageUrl} alt="Mystery" className="absolute inset-0 w-full h-full object-cover" />
          
          {/* Lưới 3x3 che đè lên */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <div 
                key={index} 
                onClick={() => handleTileClick(index)}
                className={`border border-amber-900/50 flex items-center justify-center transition-all duration-500 cursor-pointer
                  ${revealedTiles.includes(index) ? 'opacity-0 pointer-events-none' : 'bg-[#e2c792] hover:bg-[#d4b572]'}`}
              >
                {!revealedTiles.includes(index) && (
                  <span className="text-3xl opacity-30 font-black text-amber-900">?</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* VÙNG ĐOÁN TÊN TRANH */}
        <div className="w-full md:w-80 flex flex-col justify-center bg-white p-6 rounded-xl border-2 border-amber-200 shadow-lg">
          <h3 className="text-xl font-black text-amber-900 uppercase mb-4 text-center border-b-2 border-amber-100 pb-2 flex items-center justify-center gap-2">
            <Search size={20} /> Giải Mã
          </h3>
          <p className="text-sm text-gray-600 mb-6 italic text-center">Nhập tên sự kiện, trận đánh hoặc nhân vật có trong bức tranh này.</p>
          <input 
            type="text" 
            placeholder="Ví dụ: Trận Bạch Đằng..."
            value={guessFullImage}
            onChange={(e) => setGuessFullImage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGuessImage()}
            className="w-full p-3 border-2 border-amber-400 rounded-lg outline-none focus:ring-4 ring-amber-100 mb-4 font-bold text-lg text-center"
          />
          <button onClick={handleGuessImage} className="btn-historical py-4 w-full text-lg">Xác Nhận Đoán</button>
        </div>
      </div>

      {/* POPUP HỎI ĐÁP ĐỂ MỞ Ô */}
      {selectedTile !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#fdf2d5] p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full border-4 border-amber-700 relative">
            <div className="flex justify-between items-center mb-6 border-b-2 border-amber-300 pb-2">
              <h3 className="text-xl font-black text-amber-900 uppercase flex items-center gap-2">
                <HelpCircle size={24} /> Thử Thách Mở Ô
              </h3>
              <button onClick={() => setSelectedTile(null)} className="text-red-600 font-bold p-1 hover:bg-red-50 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>
            <p className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
              {tileQuestions[selectedTile].q}
            </p>
            <input 
              type="text" 
              placeholder="Nhập câu trả lời ngắn gọn..."
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnswerSubmit()}
              autoFocus
              className="w-full p-4 border-2 border-amber-500 rounded-lg outline-none font-bold text-lg mb-6"
            />
            <button onClick={handleAnswerSubmit} className="btn-historical py-4 w-full text-lg bg-green-700 text-white">
              Trả Lời & Lật Ô
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
