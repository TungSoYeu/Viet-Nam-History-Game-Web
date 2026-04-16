import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Star, ArrowLeft, MapPin } from 'lucide-react';
import API_BASE_URL from '../config/api';
import AnimatedPage from '../components/animations/AnimatedPage';
import BouncyButton from '../components/animations/BouncyButton';
import ParticlesBackground from '../components/animations/ParticlesBackground';
import SkeletonLoader from '../components/SkeletonLoader';
import AvatarFrame from '../components/AvatarFrame';
import RankBadge from '../components/RankBadge';
import { fetchClassroomLeaderboard } from '../services/classroomClient';
import { getActiveClassroomId, getActiveClassroomName } from '../utils/classroomContext';

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
  const activeClassroomId = getActiveClassroomId();
  const activeClassroomName = getActiveClassroomName();
  const [globalUsers, setGlobalUsers] = useState([]);
  const [classUsers, setClassUsers] = useState([]);
  const [activeTab, setActiveTab] = useState(activeClassroomId ? 'class' : 'global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch(`${API_BASE_URL}/api/leaderboard?limit=50`).then(res => res.json()),
      activeClassroomId
        ? fetchClassroomLeaderboard(activeClassroomId).then(res => res.users || [])
        : Promise.resolve([]),
    ])
      .then(([globalPayload, classPayload]) => {
        if (cancelled) return;
        const enrich = (users) =>
          Array.isArray(users)
            ? users.map((user, idx) => ({
                ...user,
                defaultAvatar: HISTORICAL_AVATARS[idx % HISTORICAL_AVATARS.length],
              }))
            : [];

        setGlobalUsers(enrich(globalPayload));
        setClassUsers(enrich(classPayload));
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải bảng xếp hạng:", err);
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeClassroomId]);

  const getPodiumStyles = (index) => {
    switch (index) {
      case 0: 
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
      case 1: 
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
      case 2: 
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
    <div className="theme-page min-h-screen flex flex-col items-center justify-center p-8" style={{ background: 'var(--page-bg-gradient)' }}>
      <div className="w-full max-w-4xl">
        <SkeletonLoader variant="podium" className="mb-12" />
        <SkeletonLoader variant="list" count={5} />
      </div>
    </div>
  );

  const displayUsers = activeTab === 'class' ? classUsers : globalUsers;
  const podiumData = displayUsers.slice(0, 3);
  const runnerUpData = displayUsers.slice(3, 10);

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
      <div className="theme-page min-h-screen p-4 sm:p-8 flex flex-col items-center relative" style={{ background: 'var(--page-bg-gradient)' }}>
        <ParticlesBackground type="dust" />
        
        {/* Header */}
        <div className="w-full max-w-6xl mb-8 sm:mb-12 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-4 relative z-10">
          <div className="flex justify-center sm:justify-start">
            <BouncyButton onClick={() => navigate('/modes')}>
              <div className="px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all text-sm"
                style={{ background: 'var(--page-card-soft)', border: '1px solid var(--page-card-border)', color: 'var(--text-secondary)' }}
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

        <div className="w-full max-w-4xl mb-8 flex flex-wrap items-center justify-center gap-3 relative z-10">
          {[
            { id: 'global', label: 'Toàn Hệ Thống', hint: 'Xếp hạng mọi tài khoản' },
            { id: 'class', label: activeClassroomName || 'Trong Lớp', hint: activeClassroomId ? 'Xếp hạng học sinh của lớp đang chọn' : 'Chọn lớp đang hoạt động để xem' },
          ].map((tab) => {
            const disabled = tab.id === 'class' && !activeClassroomId;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                disabled={disabled}
                onClick={() => setActiveTab(tab.id)}
                className="rounded-2xl px-4 py-3 text-left transition disabled:opacity-50"
                style={{
                  background: active ? 'rgba(245,158,11,0.14)' : 'var(--page-card-muted)',
                  border: active ? '1px solid rgba(245,158,11,0.4)' : '1px solid var(--page-card-border)',
                }}
              >
                <div className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>{tab.label}</div>
                <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{tab.hint}</div>
              </button>
            );
          })}
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
                  <div className="relative z-0">
                    <AvatarFrame 
                      avatar={userAvatar} 
                      username={user.username} 
                      xp={user.experience} 
                      size={window.innerWidth >= 768 ? 96 : window.innerWidth >= 640 ? 80 : 64} 
                    />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 shadow-lg text-white font-black text-xs sm:text-base" style={{ background: styles.gradientBg, borderColor: 'rgba(255,255,255,0.2)' }}>
                    {idx + 1}
                  </div>
                </div>
                
                <div className="text-center mb-3 sm:mb-4 px-1">
                  <p className="font-black text-xs sm:text-sm md:text-base truncate w-20 sm:w-32 md:w-40" style={{ color: 'var(--text-primary)' }}>{user.username}</p>
                  <div className="mt-2 flex justify-center">
                    <RankBadge xp={user.experience} compact />
                  </div>
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
            background: 'var(--page-card-soft)', 
            border: '1px solid var(--page-card-border)',
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
              <p className="text-center py-8 font-bold italic" style={{ color: 'var(--text-muted)' }}>Bảng danh dự còn để trống...</p>
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
                      background: isTop5 ? 'rgba(212,160,83,0.08)' : 'var(--page-card-muted)', 
                      border: isTop5 ? '1px solid rgba(212,160,83,0.2)' : '1px solid var(--page-card-border)',
                      boxShadow: isTop5 ? '0 4px 16px rgba(0,0,0,0.2)' : 'none'
                    }}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <span className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-black rounded-lg text-xs sm:text-sm shrink-0`} 
                        style={{ 
                          background: isTop5 ? 'rgba(212,160,83,0.2)' : 'var(--page-card-soft)', 
                          color: isTop5 ? '#f0d48a' : 'var(--text-muted)' 
                        }}>
                        {rank}
                      </span>
                      <div className="shrink-0 flex items-center justify-center">
                        <AvatarFrame 
                          avatar={userAvatar} 
                          username={user.username} 
                          xp={user.experience} 
                          size={window.innerWidth >= 640 ? 48 : 36} 
                        />
                      </div>
                      <div className="min-w-0 flex-1 ml-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-black text-sm sm:text-base flex items-center gap-1.5 truncate" style={{ color: 'var(--text-primary)' }}>
                            {user.username}
                            {isTop5 && <Star size={12} className="text-amber-500 fill-amber-500 shrink-0" />}
                          </h3>
                          <RankBadge xp={user.experience} compact />
                        </div>
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>
                           <MapPin size={10} /> <span className="truncate">{user.province || user.city || 'Ẩn danh'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="text-base sm:text-xl font-black text-amber-400">{user.experience.toLocaleString()}</p>
                      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Kinh nghiệm</p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </div>

        <div className="mt-12 sm:mt-16 text-center pb-4 relative z-10">
           <p className="font-bold italic mb-6 text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>Hãy rèn luyện sử sách để được ghi danh trên Bảng Phong Thần!</p>
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
