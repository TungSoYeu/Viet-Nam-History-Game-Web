import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Star, ArrowLeft, MapPin } from 'lucide-react';
import API_BASE_URL from '../config/api';
import AnimatedPage from '../components/animations/AnimatedPage';
import BouncyButton from '../components/animations/BouncyButton';
import ParticlesBackground from '../components/animations/ParticlesBackground';

// Danh sách các danh nhân tiêu biểu để làm avatar mặc định
const HISTORICAL_AVATARS = [
  "/assets/images/ngo_quyen.png",
  "/assets/images/le_loi.png",
  "/assets/images/tran_hung_dao.png",
  "/assets/images/hai_ba_trung.png",
  "/assets/images/ba_trieu.png",
  "/assets/images/ly_thuong_kiet.png"
];

export default function Leaderboard() {
  const navigate = useNavigate();
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/leaderboard`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Gán avatar danh nhân ngẫu nhiên nếu user không có avatar
          const enrichedData = data.map((user, idx) => ({
            ...user,
            defaultAvatar: HISTORICAL_AVATARS[idx % HISTORICAL_AVATARS.length]
          }));
          setTopUsers(enrichedData);
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
          gradientBg: "linear-gradient(135deg, #ca8a04, #eab308)",
          border: "border-yellow-500/50",
          icon: <Crown className="text-yellow-300 mb-1 drop-shadow-lg" size={32} />,
          height: "h-48 sm:h-56",
          order: "order-2",
          text: "text-yellow-300",
          shadow: "shadow-[0_10px_40px_rgba(234,179,8,0.3)]",
          delay: 0.2
        };
      case 1: // Silver
        return {
          gradientBg: "linear-gradient(135deg, #64748b, #94a3b8)",
          border: "border-slate-400/50",
          icon: <Medal className="text-slate-300 mb-1 drop-shadow-lg" size={28} />,
          height: "h-40 sm:h-48",
          order: "order-1",
          text: "text-slate-300",
          shadow: "shadow-[0_10px_30px_rgba(148,163,184,0.2)]",
          delay: 0.1
        };
      case 2: // Bronze
        return {
          gradientBg: "linear-gradient(135deg, #c2410c, #ea580c)",
          border: "border-orange-500/50",
          icon: <Medal className="text-orange-300 mb-1 drop-shadow-lg" size={28} />,
          height: "h-36 sm:h-40",
          order: "order-3",
          text: "text-orange-300",
          shadow: "shadow-[0_10px_30px_rgba(249,115,22,0.2)]",
          delay: 0.3
        };
      default: return null;
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-xl font-black text-amber-400 animate-pulse flex items-center gap-3 italic">
         <Star className="animate-spin" /> Đang tra cứu Bảng Phong Thần...
      </div>
    </div>
  );

  const podiumData = topUsers.slice(0, 3);
  const runnerUpData = topUsers.slice(3, 10);

  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center relative" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <ParticlesBackground type="dust" />
        
        {/* Header */}
        <div className="w-full max-w-6xl mb-8 sm:mb-12 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-4 relative z-10">
          <div className="flex justify-center sm:justify-start">
            <BouncyButton onClick={() => navigate('/modes')}>
              <div className="px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
              >
                <ArrowLeft size={18} /> Quay lại
              </div>
            </BouncyButton>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-widest uppercase text-center flex items-center justify-center space-x-3" style={{ background: 'linear-gradient(135deg, #f0d48a, #d4a053)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Bảng Phong Thần
          </h1>
          <div className="hidden sm:flex justify-end"></div>
        </div>

        {/* Podium Section (Top 3) */}
        <div className="w-full max-w-4xl flex items-end justify-center gap-2 sm:gap-6 mb-12 sm:mb-16 px-2 relative z-10">
          {podiumData.map((user, idx) => {
            const styles = getPodiumStyles(idx);
            const userAvatar = user.avatar ? (user.avatar.startsWith('/') ? `${API_BASE_URL}${user.avatar}` : user.avatar) : user.defaultAvatar;

            return (
              <motion.div 
                key={user._id} 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 10, delay: styles.delay }}
                className={`${styles.order} flex flex-col items-center w-full max-w-[180px]`}
              >
                <div className="relative mb-3 sm:mb-4 group">
                  <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className={`absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 z-10 transition-transform group-hover:scale-110`}
                  >
                    {styles.icon}
                  </motion.div>
                  <div className={`w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-3 sm:border-4 ${styles.border} overflow-hidden shadow-xl relative z-0`} style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <img src={userAvatar} alt={user.username} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 shadow-lg text-white font-black text-xs sm:text-base" style={{ background: styles.gradientBg, borderColor: 'rgba(255,255,255,0.2)' }}>
                    {idx + 1}
                  </div>
                </div>
                
                <div className="text-center mb-3 sm:mb-4 px-1">
                  <p className="font-black text-white text-xs sm:text-sm md:text-base truncate w-20 sm:w-32 md:w-40">{user.username}</p>
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(212,160,83,0.8)' }}>{user.experience} EXP</p>
                </div>

                <div className={`w-full ${styles.height} rounded-t-2xl sm:rounded-t-3xl flex flex-col items-center justify-start pt-6 sm:pt-8 ${styles.shadow}`} style={{ background: styles.gradientBg, border: '1px solid rgba(255,255,255,0.15)' }}>
                  <div className="hidden sm:block">
                    <Star className={`${styles.text} opacity-20 mb-2`} size={32} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Runner Up List (4th - 10th) with Ancient Border */}
        <div className="w-full max-w-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-2xl relative z-10" 
          style={{ 
            background: 'rgba(255,255,255,0.04)', 
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Decorative Corner Borders */}
          <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none opacity-60" style={{ backgroundImage: 'url(/assets/images/border-ancient.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', transform: 'rotate(0deg)' }}></div>
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-60" style={{ backgroundImage: 'url(/assets/images/border-ancient.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', transform: 'rotate(90deg)' }}></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none opacity-60" style={{ backgroundImage: 'url(/assets/images/border-ancient.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', transform: 'rotate(-90deg)' }}></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none opacity-60" style={{ backgroundImage: 'url(/assets/images/border-ancient.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', transform: 'rotate(180deg)' }}></div>

          <motion.div 
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3 sm:gap-4 relative z-10"
          >
            {runnerUpData.length === 0 ? (
              <p className="text-center py-8 font-bold italic" style={{ color: 'rgba(255,255,255,0.4)' }}>Bảng danh dự còn để trống...</p>
            ) : (
              runnerUpData.map((user, idx) => {
                const rank = idx + 4;
                const isTop5 = rank === 4 || rank === 5;
                const userAvatar = user.avatar ? (user.avatar.startsWith('/') ? `${API_BASE_URL}${user.avatar}` : user.avatar) : user.defaultAvatar;

                return (
                  <motion.div 
                    key={user._id} 
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all cursor-default`}
                    style={{ 
                      background: isTop5 ? 'rgba(212,160,83,0.08)' : 'rgba(255,255,255,0.03)', 
                      border: isTop5 ? '1px solid rgba(212,160,83,0.2)' : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: isTop5 ? '0 4px 16px rgba(0,0,0,0.2)' : 'none'
                    }}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <span className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-black rounded-lg text-xs sm:text-sm shrink-0`} 
                        style={{ 
                          background: isTop5 ? 'rgba(212,160,83,0.2)' : 'rgba(255,255,255,0.06)', 
                          color: isTop5 ? '#f0d48a' : 'rgba(255,255,255,0.5)' 
                        }}>
                        {rank}
                      </span>
                      <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full border-2 overflow-hidden shrink-0" style={{ borderColor: 'rgba(212,160,83,0.3)', background: 'rgba(255,255,255,0.03)' }}>
                        <img src={userAvatar} alt={user.username} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-black text-white text-sm sm:text-base flex items-center gap-1.5 truncate">
                          {user.username}
                          {isTop5 && <Star size={12} className="text-amber-500 fill-amber-500 shrink-0" />}
                        </h3>
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
                           <MapPin size={10} /> <span className="truncate">{user.province || user.city || 'Ẩn danh'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="text-base sm:text-xl font-black text-amber-400">{user.experience.toLocaleString()}</p>
                      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>Kinh nghiệm</p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </div>

        <div className="mt-12 sm:mt-16 text-center pb-4 relative z-10">
           <p className="font-bold italic mb-6 text-sm sm:text-base" style={{ color: 'rgba(255,255,255,0.4)' }}>Hãy rèn luyện sử sách để được ghi danh trên Bảng Phong Thần!</p>
           <BouncyButton onClick={() => navigate('/modes')}>
             <div className="btn-primary px-8 sm:px-12 py-3 sm:py-4 shadow-xl flex items-center gap-3 text-sm sm:text-base">
               <Trophy size={20} /> TIẾP TỤC TRANH TÀI
             </div>
           </BouncyButton>
        </div>
      </div>
    </AnimatedPage>
  );
}