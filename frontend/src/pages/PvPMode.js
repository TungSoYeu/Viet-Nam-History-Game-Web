import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PvPMode() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = () => {
    fetch(`http://localhost:5000/api/pvp/challenges/${userId}`)
      .then(res => res.json())
      .then(data => {
        setChallenges(data);
        setLoading(false);
      });
  };

  const createGlobalChallenge = () => {
    fetch('http://localhost:5000/api/pvp/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creatorId: userId })
    })
    .then(res => res.json())
    .then(data => {
      // Chuyển đến màn hình đấu (P1 đấu trước)
      navigate('/pvp/battle', { state: { challengeId: data.challengeId, questions: data.questions } });
    });
  };

  const acceptChallenge = (challenge) => {
    // Lấy thông tin câu hỏi của challenge đó (cần API hoặc gửi kèm)
    // Giả sử API trả về câu hỏi khi fetch danh sách hoặc có API lấy chi tiết
    fetch(`http://localhost:5000/api/questions/all`) // Fallback lấy ngẫu nhiên nếu chưa có detail API
      .then(res => res.json())
      .then(allQs => {
        // Trong thực tế, challenge.questions chứa ID, cần fetch đúng 10 ID đó
        // Ở đây demo: lấy 10 câu đầu
        navigate('/pvp/battle', { state: { challengeId: challenge._id, questions: allQs.slice(0, 10) } });
      });
  };

  return (
    <div className="p-8 min-h-screen flex flex-col items-center">
      <h1 className="historical-title text-4xl mb-8 text-purple-900">Võ Đài Đấu Trí</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Cột trái: Tạo mới */}
        <div className="historical-card flex flex-col items-center justify-center p-12 bg-purple-50 border-purple-200">
           <div className="text-6xl mb-6">⚔️</div>
           <h2 className="text-2xl font-bold mb-4 text-purple-900">Hạ Chiến Thư</h2>
           <p className="text-center text-gray-600 mb-8 italic">Thiết lập một trận đấu 10 câu hỏi và chờ đối thủ nghênh chiến.</p>
           <button onClick={createGlobalChallenge} className="btn-historical bg-purple-800 w-full py-4">
              Gửi Thư Thách Đấu
           </button>
        </div>

        {/* Cột phải: Danh sách chờ */}
        <div className="historical-card bg-white">
           <h2 className="text-xl font-bold mb-6 border-b-2 border-purple-100 pb-2 flex items-center gap-2">
              <span className="text-2xl">✉️</span> Thư Thách Đấu Gửi Đến
           </h2>
           
           {loading ? (
             <p className="text-center italic text-gray-500">Đang kiểm tra hòm thư...</p>
           ) : challenges.length === 0 ? (
             <p className="text-center italic text-gray-500 py-12">Hòm thư trống. Hãy tự mình hạ chiến thư!</p>
           ) : (
             <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px]">
               {challenges.map(c => (
                 <div key={c._id} className="p-4 bg-purple-50 rounded-lg border border-purple-100 flex justify-between items-center hover:shadow-md transition">
                    <div>
                      <p className="font-bold text-purple-900">{c.creator?.username} thách đấu</p>
                      <p className="text-xs text-gray-500 italic">10 câu hỏi ngẫu nhiên</p>
                    </div>
                    <button 
                      onClick={() => acceptChallenge(c)}
                      className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition shadow-sm"
                    >
                      Nghênh Chiến
                    </button>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>

      <button onClick={() => navigate('/modes')} className="mt-12 font-bold text-purple-900 underline">
        Quay về Sa Bàn
      </button>
    </div>
  );
}
