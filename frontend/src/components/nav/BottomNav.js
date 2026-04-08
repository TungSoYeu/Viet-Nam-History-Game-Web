import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Castle, Trophy, Gamepad2 } from 'lucide-react';

export default function BottomNav({ showProfile, setShowProfile, user, getAvatarUrl }) {
  const location = useLocation();

  return (
    <nav className="bottom-nav flex md:hidden" aria-label="Điều hướng chính">
        <Link to="/home" className={`bottom-nav-item ${location.pathname === '/home' ? 'active' : ''}`} aria-label="Trang chủ">
          <div className="icon-wrapper"><Map size={22} /></div>
          <span>Trang Chủ</span>
        </Link>
        <Link to="/modes" className={`bottom-nav-item ${location.pathname === '/modes' || location.pathname.includes('/guide') ? 'active' : ''}`} aria-label="Chế độ chơi">
          <div className="icon-wrapper"><Gamepad2 size={22} /></div>
          <span>Thách Đấu</span>
        </Link>
        <Link to="/timeline" className={`bottom-nav-item ${location.pathname === '/timeline' || location.pathname.includes('/study') ? 'active' : ''}`} aria-label="Thư viện lịch sử">
          <div className="icon-wrapper"><Castle size={22} /></div>
          <span>Thư Viện</span>
        </Link>
        <Link to="/leaderboard" className={`bottom-nav-item ${location.pathname === '/leaderboard' ? 'active' : ''}`} aria-label="Bảng xếp hạng">
          <div className="icon-wrapper"><Trophy size={22} /></div>
          <span>Xếp Hạng</span>
        </Link>
        <button 
          onClick={() => setShowProfile(true)}
          className={`bottom-nav-item ${showProfile ? 'active' : ''}`}
          aria-label="Hồ sơ cá nhân"
        >
          <div className="icon-wrapper">
            <img 
              src={getAvatarUrl(user?.avatar)} 
              alt="Avatar"
              className="w-6 h-6 rounded-full border border-amber-500 object-cover"
            />
          </div>
          <span>Hồ Sơ</span>
        </button>
      </nav>
  );
}
