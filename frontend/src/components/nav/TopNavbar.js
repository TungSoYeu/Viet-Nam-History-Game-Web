import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ScrollText, Castle, Swords, Trophy, User, Settings, Key, LogOut, ShieldCheck, GraduationCap, ChevronDown, ImageIcon, LayoutGrid, Milestone, Timer, Map, ScanSearch } from 'lucide-react';
import { theme4Modes } from '../../data/theme4Modes';

export default function TopNavbar({ 
  user, username, roleLabel, activeClassroomName, isTeacher,
  showModes, setShowModes, showUserMenu, setShowUserMenu, setShowProfile, handleLogout, getAvatarUrl, navRef
}) {
  const location = useLocation();

  const iconMap = {
    "turning-page": <ImageIcon size={20} />,
    "understanding-teammates": <Swords size={20} />,
    "historical-recognition": <ScanSearch size={20} />,
    "connecting-history": <LayoutGrid size={20} />,
    "crossword-decoding": <GraduationCap size={20} />,
    "historical-flow": <Milestone size={20} />,
    "lightning-fast": <Timer size={20} />,
    "picture-puzzle": <Map size={20} />,
  };

  const modes = theme4Modes.map((mode) => ({
    name: mode.name,
    path: mode.path,
    icon: iconMap[mode.id] || <ImageIcon size={20} />,
  }));

  return (
    <nav ref={navRef} className="top-nav sticky top-0 z-[100] h-20 transition-all hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full relative">
            
            <div className="flex items-center flex-1">
              <Link to="/home" className="flex items-center gap-2 group shrink-0">
                <ScrollText size={28} className="group-hover:rotate-12 transition-transform text-amber-400" />
                <span className="font-black text-lg lg:text-xl tracking-tighter uppercase" style={{ background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Danh Nhân Đất Việt</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <Link to="/timeline" className={`top-nav-link ${location.pathname.includes('/study') || location.pathname === '/timeline' ? 'is-active' : ''}`}>
                <Castle size={18} /> Học Thuật
              </Link>
              
              <div className="relative">
                <button onClick={() => {setShowModes(!showModes); setShowUserMenu(false);}} className={`top-nav-link ${showModes || location.pathname === '/modes' ? 'is-active' : ''}`}>
                  <Swords size={18} /> Thách Đấu <ChevronDown size={14} className={`transition-transform ${showModes ? 'rotate-180' : ''}`} />
                </button>
                {showModes && (
                  <div className="nav-menu-panel absolute left-1/2 -translate-x-1/2 mt-2 w-64 rounded-xl py-2 animate-fade-in overflow-hidden">
                    {modes.map((mode, idx) => (
                      <Link key={idx} to={mode.path} onClick={() => setShowModes(false)} className="nav-menu-link">
                        <span className="text-amber-500">{mode.icon}</span> {mode.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/leaderboard" className={`top-nav-link ${location.pathname === '/leaderboard' ? 'is-active' : ''}`}>
                <Trophy size={18} /> Phong Thần
              </Link>
              <Link to="/courses" className={`top-nav-link ${location.pathname === '/courses' ? 'is-active' : ''}`}>
                <GraduationCap size={18} /> Khoá Học
              </Link>
            </div>

            <div className="flex items-center justify-end flex-1 gap-4 relative">
               <div 
                 onClick={() => {
                   setShowUserMenu(!showUserMenu);
                   setShowModes(false);
                 }}
                 className="top-nav-user-trigger flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 rounded-full cursor-pointer transition border"
               >
                  <img 
                    src={getAvatarUrl(user?.avatar)} 
                    alt="Avatar"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-amber-500/50 object-cover"
                  />
                  <div className="hidden sm:flex flex-col items-start">
                     <span className="nav-user-caption text-[10px] font-bold uppercase tracking-tighter">Danh tướng</span>
                     <span className="nav-user-name font-bold leading-tight">{username || 'Ẩn danh'}</span>
                  </div>
                  <div className="nav-user-divider h-8 w-[1px] mx-1 hidden sm:block"></div>
                  <div className="flex flex-col items-center">
                     <span className="nav-user-stat-label hidden sm:block text-[10px] font-bold uppercase tracking-widest">Tích lũy</span>
                     <span className="nav-user-stat-value text-xs font-black">{user?.experience || 0} XP</span>
                  </div>
                  {activeClassroomName ? (
                    <>
                      <div className="nav-user-divider h-8 w-[1px] mx-1 hidden lg:block"></div>
                      <div className="hidden lg:flex flex-col items-start max-w-[140px]">
                        <span className="nav-user-stat-label text-[10px] font-bold uppercase tracking-widest">Lớp đang học</span>
                        <span className="nav-user-classroom-name text-xs font-black truncate max-w-[140px]">{activeClassroomName}</span>
                      </div>
                    </>
                  ) : null}
               </div>

               {showUserMenu && (
                 <div className="nav-menu-panel absolute right-0 top-14 w-56 rounded-xl py-2 z-50 animate-fade-in overflow-hidden text-sm">
                    <button 
                      onClick={() => { setShowProfile(true); setShowUserMenu(false); }}
                      className="nav-menu-link w-full text-left border-b border-white/10 transition"
                    >
                      <User size={16} className="text-amber-500" /> Thông Tin Cá Nhân
                    </button>
                    <Link to="/courses" onClick={() => setShowUserMenu(false)} className="nav-menu-link border-b border-white/10 transition">
                      <GraduationCap size={16} className="text-amber-500" /> Quản Lý Khoá Học
                    </Link>
                    {isTeacher && (
                      <>
                        <Link to="/teacher/content" onClick={() => setShowUserMenu(false)} className="nav-menu-link border-b border-white/10 transition">
                          <Settings size={16} className="text-amber-500" /> Soạn Học Thuật
                        </Link>
                        <Link to="/teacher/theme4" onClick={() => setShowUserMenu(false)} className="nav-menu-link border-b border-white/10 transition">
                          <ShieldCheck size={16} className="text-amber-500" /> Soạn Chủ Đề 4
                        </Link>
                      </>
                    )}
                    <Link to="/change-password" onClick={() => setShowUserMenu(false)} className="nav-menu-link border-b border-white/10 transition">
                      <Key size={16} className="text-amber-500" /> Đổi Mật Khẩu
                    </Link>
                    <button onClick={handleLogout} className="nav-menu-link danger w-full text-left transition">
                      <LogOut size={16} /> Đăng Xuất
                    </button>
                 </div>
               )}
            </div>
          </div>
        </div>
      </nav>
  );
}
