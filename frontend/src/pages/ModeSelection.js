import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ModeSelection() {
  const navigate = useNavigate();

  const modes = [
    { id: 'campaign', name: "Vượt Ải Thời Gian", desc: "Học và trả lời theo từng triều đại lịch sử.", path: "/timeline", color: "bg-amber-100" },
    { id: 'survival', name: "Sinh Tồn Lịch Sử", desc: "Trả lời liên tục, sai 1 câu mất 1 mạng.", path: "/survival", color: "bg-red-100" },
    { id: 'timeAttack', name: "Thử Thách Thời Gian", desc: "60 giây đếm ngược. Trả lời càng nhanh càng tốt!", path: "/time-attack", color: "bg-blue-100" },
    { id: 'matching', name: "Nối Dữ Kiện", desc: "Ghép nối các sự kiện, nhân vật tương ứng.", path: "/matching", color: "bg-green-100" },
    { id: 'pvp', name: "Đấu Trí (PvP)", desc: "Thách đấu với người chơi khác.", path: "/pvp", color: "bg-purple-100" },
  ];

  return (
    <div className="p-8 min-h-screen flex flex-col items-center">
      <h1 className="historical-title text-4xl mb-2">Sa Bàn Chiến Thuật</h1>
      <p className="mb-8 text-gray-700 italic">"Hãy chọn con đường tu luyện của bạn..."</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {modes.map(mode => (
          <div 
            key={mode.id} 
            onClick={() => mode.path !== "#" && navigate(mode.path)}
            className={`flex flex-col p-6 rounded-xl border-2 border-amber-800 shadow-md transition-transform transform hover:-translate-y-1 ${mode.color} cursor-pointer`}
          >
            <h2 className="text-2xl font-bold text-amber-900 mb-2">{mode.name}</h2>
            <p className="text-amber-800">{mode.desc}</p>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/leaderboard')} className="mt-12 btn-historical">
        Xem Bảng Phong Thần
      </button>
    </div>
  );
}