import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, Crown, Star, ArrowLeft, MapPin, User } from 'lucide-react';
import API_BASE_URL from '../config/api';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/leaderboard`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTopUsers(data);
        } else {
          setTopUsers([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải bảng xếp hạng:", err);
        setLoading(false);
      });
  }, []);

  const getPodiumStyles = (index) => {
    switch (index) {
      case 0: // Gold
        return {
          bg: "bg-gradient-to-b from-yellow-300 to-yellow-500",
          border: "border-yellow-200",
          icon: <Crown className="text-yellow-100 mb-1" size={32} />,
          height: "h-56 sm:h-64",
          order: "order-2",
          text: "text-yellow-950",
          shadow: "shadow-[0_10px_40px_rgba(234,179,8,0.4)]"
        };
      case 1: // Silver
        return {
          bg: "bg-gradient-to-b from-slate-300 to-slate-400",
          border: "border-slate-200",
          icon: <Medal className="text-slate-100 mb-1" size={28} />,
          height: "h-48 sm:h-56",
          order: "order-1",
          text: "text-slate-900",
          shadow: "shadow-[0_10px_30px_rgba(148,163,184,0.3)]"
        };
      case 2: // Bronze
        return {
          bg: "bg-gradient-to-b from-orange-300 to-orange-500",
          border: "border-orange-200",
          icon: <Medal className="text-orange-100 mb-1" size={28} />,
          height: "h-40 sm:h-48",
          order: "order-3",
          text: "text-orange-950",
          shadow: "shadow-[0_10px_30px_rgba(249,115,22,0.3)]"
        };
      default: return null;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <div className="text-2xl font-black text-amber-900 animate-pulse flex items-center gap-3 italic">
         <Star className="animate-spin" /> Đang tra cứu Bảng Phong Thần...
      </div>
    </div>
  );

  const podiumData = topUsers.slice(0, 3);
  const runnerUpData = topUsers.slice(3, 10);

  return (
    <div className="min-h-screen history-bg p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl mb-12 flex justify-between items-center">
        <button 
          onClick={() => navigate('/modes')} 
          className="px-6 py-3 bg-white/80 backdrop-blur rounded-2xl font-bold border-2 border-amber-900/10 text-amber-900 flex items-center gap-2 hover:bg-amber-900 hover:text-white transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft size={20} /> Quay lại
        </button>
        <h1 className="historical-title text-3xl sm:text-5xl tracking-widest uppercase">Bảng Phong Thần</h1>
        <div className="w-32 hidden sm:block"></div>
      </div>

      {/* Podium Section (Top 3) */}
      <div className="w-full max-w-4xl flex items-end justify-center gap-2 sm:gap-6 mb-16 px-2">
        {podiumData.map((user, idx) => {
          const styles = getPodiumStyles(idx);
          const userAvatar = user.avatar ? (user.avatar.startsWith('/') ? `${API_BASE_URL}${user.avatar}` : user.avatar) : null;

          return (
            <div key={user._id} className={`${styles.order} flex flex-col items-center w-full max-w-[200px] animate-fade-in-up`} style={{ animationDelay: `${idx * 150}ms` }}>
              <div className="relative mb-4 group">
                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 z-10 transition-transform group-hover:scale-110`}>
                  {styles.icon}
                </div>
                <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 ${styles.border} overflow-hidden bg-white shadow-xl relative z-0`}>
                  {userAvatar ? (
                    <img src={userAvatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-amber-100 text-amber-800">
                      <User size={32} />
                    </div>
                  )}
                </div>
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full ${styles.bg} flex items-center justify-center border-2 border-white shadow-lg text-white font-black text-sm sm:text-lg`}>
                  {idx + 1}
                </div>
              </div>
              
              <div className="text-center mb-4 px-2">
                <p className="font-black text-amber-900 text-sm sm:text-lg truncate w-24 sm:w-40">{user.username}</p>
                <p className="text-[10px] sm:text-xs text-amber-700 font-bold uppercase tracking-widest">{user.experience} EXP</p>
              </div>

              <div className={`w-full ${styles.height} ${styles.bg} rounded-t-3xl border-x-4 border-t-4 ${styles.border} flex flex-col items-center justify-start pt-8 ${styles.shadow}`}>
                <div className="hidden sm:block">
                  <Star className={`${styles.text} opacity-20 mb-2`} size={40} />
                  <Star className={`${styles.text} opacity-20 mb-2 ml-4`} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Runner Up List (4th - 10th) */}
      <div className="w-full max-w-2xl bg-white/40 backdrop-blur-md rounded-3xl border-2 border-amber-900/10 p-4 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500/50 via-amber-800 to-amber-500/50"></div>
        <div className="flex flex-col gap-4">
          {runnerUpData.length === 0 ? (
            <p className="text-center py-8 text-amber-800 font-bold italic">Bảng danh dự còn để trống...</p>
          ) : (
            runnerUpData.map((user, idx) => {
              const rank = idx + 4;
              const isTop5 = rank === 4 || rank === 5;
              const userAvatar = user.avatar ? (user.avatar.startsWith('/') ? `${API_BASE_URL}${user.avatar}` : user.avatar) : null;

              return (
                <div 
                  key={user._id} 
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all hover:translate-x-2 ${isTop5 ? 'bg-amber-100/50 border-amber-300 shadow-md' : 'bg-white/60 border-amber-100 hover:border-amber-300'}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className={`w-8 h-8 flex items-center justify-center font-black rounded-lg ${isTop5 ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'}`}>
                      {rank}
                    </span>
                    <div className={`w-12 h-12 rounded-full border-2 border-amber-200 overflow-hidden bg-white`}>
                      {userAvatar ? (
                        <img src={userAvatar} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-amber-50 text-amber-400">
                           <User size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-amber-950 text-base sm:text-lg flex items-center gap-2">
                        {user.username}
                        {isTop5 && <Star size={14} className="text-amber-500 fill-amber-500" />}
                      </h3>
                      <div className="flex items-center gap-1 text-amber-600/70 text-xs font-bold uppercase">
                         <MapPin size={12} /> {user.province || user.city || 'Ẩn danh'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-black text-amber-800">{user.experience.toLocaleString()}</p>
                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">Kinh nghiệm</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-16 text-center">
         <p className="text-amber-800/60 font-bold italic mb-6">Hãy rèn luyện sử sách để được ghi danh trên Bảng Phong Thần!</p>
         <button 
           onClick={() => navigate('/modes')} 
           className="btn-historical bg-amber-900 text-white px-12 py-4 shadow-xl flex items-center gap-3 hover:scale-105 transition-transform"
         >
           <Trophy size={20} /> TIẾP TỤC TRANH TÀI
         </button>
      </div>
    </div>
  );
}