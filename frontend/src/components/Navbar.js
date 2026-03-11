import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModes, setShowModes] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost:5000/api/leaderboard`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const found = data.find(u => u._id === userId);
            if (found) setUser(found);
          }
        })
        .catch(err => console.error("Error fetching user data:", err));
    }
  }, [location]);

  if (location.pathname === '/') return null;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const modes = [

    { name: "Sinh Tồn (Endless)", path: "/survival", icon: "🔥" },
    { name: "Thử Thách Thời Gian", path: "/time-attack", icon: "⏳" },
    { name: "Nối Dữ Kiện", path: "/matching", icon: "🧩" },
    { name: "Võ Đài PvP", path: "/pvp", icon: "⚔️" },
  ];

  return (
    <nav className="bg-amber-900 text-amber-50 shadow-2xl border-b-4 border-amber-700 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center gap-8">
            <Link to="/modes" className="flex items-center gap-2 group">
              <span className="text-3xl group-hover:rotate-12 transition-transform">📜</span>
              <span className="font-black text-xl tracking-tighter uppercase hidden md:block">Sử Việt Hùng Ca</span>
            </Link>

            <div className="hidden md:flex items-baseline space-x-4">
              <Link to="/timeline" className={`px-4 py-2 rounded-md font-bold text-sm uppercase hover:bg-amber-800 transition ${location.pathname.includes('/study') || location.pathname === '/timeline' ? 'bg-amber-800 border-b-2 border-amber-400' : ''}`}>
                🏯 Học Thuật
              </Link>
              
              <div className="relative">
                <button onClick={() => setShowModes(!showModes)} className="px-4 py-2 rounded-md font-bold text-sm uppercase hover:bg-amber-800 transition flex items-center gap-1">
                  ⚔️ Thách Đấu <span className="text-[10px]">▼</span>
                </button>
                {showModes && (
                  <div className="absolute left-0 mt-2 w-64 bg-amber-50 rounded-xl shadow-2xl border-2 border-amber-900 py-2 animate-fade-in">
                    {modes.map((mode, idx) => (
                      <Link key={idx} to={mode.path} onClick={() => setShowModes(false)} className="flex items-center gap-3 px-4 py-3 text-amber-900 hover:bg-amber-200 font-bold transition">
                        <span>{mode.icon}</span> {mode.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/leaderboard" className={`px-4 py-2 rounded-md font-bold text-sm uppercase hover:bg-amber-800 transition ${location.pathname === '/leaderboard' ? 'bg-amber-800 border-b-2 border-amber-400' : ''}`}>
                🏆 Bảng Phong Thần
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
             <div 
               onClick={() => setShowUserMenu(!showUserMenu)}
               className="flex items-center gap-4 bg-amber-950 px-6 py-2 rounded-full border border-amber-700 shadow-inner cursor-pointer hover:bg-black transition"
             >
                <div className="flex flex-col items-end">
                   <span className="text-xs opacity-60 font-bold uppercase tracking-tighter hide-mobile">Danh tướng</span>
                   <span className="font-bold text-amber-300">{username || 'Ẩn danh'}</span>
                </div>
                <div className="h-8 w-[2px] bg-amber-800"></div>
                <div className="flex items-center gap-3">
                   <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Tích lũy:</span>
                   <span className="text-sm font-black text-amber-300">{user?.experience || 0} XP</span>
                </div>
             </div>

             {showUserMenu && (
               <div className="absolute right-0 top-14 w-56 bg-white border-2 border-amber-900 rounded-lg shadow-xl py-2 z-50 animate-fade-in">
                  <button 
                    onClick={() => { setShowProfile(true); setShowUserMenu(false); }}
                    className="w-full text-left px-4 py-2 text-amber-900 font-bold hover:bg-amber-50 border-b"
                  >
                    👤 Thông Tin Cá Nhân
                  </button>
                  {role === 'admin' && (
                    <Link to="/admin" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-amber-900 font-bold hover:bg-amber-50 border-b">⚙️ Bảng Điều Khiển</Link>
                  )}
                  <Link to="/change-password" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-amber-900 font-bold hover:bg-amber-50 border-b">🔑 Đổi Mật Khẩu</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-700 font-bold hover:bg-red-50">🚪 Đăng Xuất</button>
               </div>
             )}
          </div>

        </div>
      </div>

      {/* PROFILE MODAL */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[200] p-4">
            <div className="historical-card w-full max-w-md bg-white relative animate-bounce-in">
                <button 
                    onClick={() => setShowProfile(false)}
                    className="absolute top-4 right-4 text-2xl font-black text-amber-900 hover:text-red-700"
                >
                    ✕
                </button>
                
                <div className="text-center mb-8 border-b-2 border-amber-100 pb-4">
                    <div className="text-6xl mb-4">🎖️</div>
                    <h2 className="text-3xl font-black text-amber-900 uppercase">Hồ Sơ Danh Tướng</h2>
                    <p className="text-amber-700 italic font-bold">@{username}</p>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col">
                        <span className="text-xs uppercase text-gray-400 font-black tracking-widest mb-1">Họ và Tên</span>
                        <span className="text-xl font-bold text-gray-800">{user?.fullName || 'Chưa cập nhật'}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <div className="flex flex-col flex-1">
                            <span className="text-xs uppercase text-gray-400 font-black tracking-widest mb-1">Ngày sinh</span>
                            <span className="text-lg font-bold text-gray-800">
                                {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                            </span>
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-xs uppercase text-gray-400 font-black tracking-widest mb-1">Vai trò</span>
                            <span className={`text-lg font-black uppercase ${role === 'admin' ? 'text-red-600' : 'text-blue-600'}`}>
                                {role === 'admin' ? 'Quản trị viên' : 'Người chơi'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-xs uppercase text-gray-400 font-black tracking-widest mb-1">Trường học</span>
                        <span className="text-xl font-bold text-gray-800 italic">{user?.school || 'Chưa cập nhật'}</span>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 mt-4">
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-bold text-amber-800 uppercase tracking-widest mb-2">Tổng điểm tích lũy</span>
                            <span className="text-4xl font-black text-amber-900">{user?.experience || 0} XP</span>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => setShowProfile(false)}
                    className="btn-historical w-full mt-8 py-4 bg-amber-900 text-white"
                >
                    Đóng hồ sơ
                </button>
            </div>
        </div>
      )}
    </nav>
  );
}
