import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setTopUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải bảng xếp hạng:", err);
        setLoading(false);
      });
  }, []);

  const getRankBadge = (index) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return `${index + 1}.`;
    }
  };

  return (
    <div className="p-8 min-h-screen flex flex-col items-center justify-center">
      <h1 className="historical-title text-4xl mb-12">Bảng Phong Thần</h1>
      
      {loading ? (
        <div className="text-xl italic text-amber-900">Đang tra cứu sử sách...</div>
      ) : (
        <div className="historical-card w-full max-w-xl">
          <div className="flex flex-col divide-y-2 divide-amber-100">
            {topUsers.length === 0 ? (
              <div className="py-8 text-center text-gray-600">Chưa có anh hùng nào được ghi danh.</div>
            ) : (
              topUsers.map((user, index) => (
                <div key={user._id} className="py-5 flex justify-between items-center text-lg font-semibold text-gray-800">
                  <span className="flex items-center gap-4">
                    <span className={`w-10 h-10 flex items-center justify-center rounded-full shadow-sm border ${index === 0 ? 'bg-yellow-400 border-amber-500' : 'bg-gray-100 border-gray-300'}`}>
                      {getRankBadge(index)}
                    </span> 
                    {user.username}
                  </span> 
                  <span className="font-mono text-amber-800">{user.experience} EXP</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      <button onClick={() => navigate('/timeline')} className="mt-12 btn-historical">
        Về Dòng Thời Gian
      </button>
    </div>
  );
}