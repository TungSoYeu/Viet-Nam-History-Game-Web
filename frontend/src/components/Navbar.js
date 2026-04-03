import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { 
  Menu, 
  ScrollText, 
  Castle, 
  Swords, 
  Trophy, 
  User, 
  Settings, 
  Key, 
  LogOut, 
  Camera, 
  ChevronDown,
  X,
  Map,
  ShieldCheck,
  Timer,
  LayoutGrid,
  Milestone,
  Flag,
  Flame,
  Hourglass,
  Puzzle,
  History,
  GraduationCap,
  UserSearch,
  Image as ImageIcon,
  ScanSearch,
  Gamepad2
} from 'lucide-react';
import API_BASE_URL from '../config/api';
import { theme4Modes } from '../data/theme4Modes';
import { useToast } from './Toast';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  // Khởi tạo ref để bắt sự kiện click ra ngoài
  const navRef = useRef(null);

  const [showModes, setShowModes] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // --- STATE CHO ĐỊA CHỈ ---
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [schoolName, setSchoolName] = useState('');

  const [editData, setEditData] = useState({
    fullName: '',
    dateOfBirth: ''
  });

  const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjNlbSIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPlU8L3RleHQ+PC9zdmc+";

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return DEFAULT_AVATAR;
    if (avatarPath.startsWith('/uploads')) return `${API_BASE_URL}${avatarPath}`;
    if (avatarPath.startsWith('http')) return avatarPath;
    return DEFAULT_AVATAR;
  };

  // 1. TÍNH NĂNG CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Bỏ qua nếu đang mở Modal Profile (tránh việc click ra ngoài Modal cũng bị đóng menu sai logic)
      if (showProfile) return;

      if (navRef.current && !navRef.current.contains(event.target)) {
        setShowMobileMenu(false);
        setShowModes(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  // Lấy dữ liệu Tỉnh/Thành từ API
  useEffect(() => {
    const getSortName = (name) => {
      return name.replace(/^(Thành phố|Tỉnh|Quận|Huyện|Thị xã|Thị trấn)\s+/i, '').trim();
    };

    fetch('https://provinces.open-api.vn/api/?depth=2')
      .then(res => res.json())
      .then(data => {
        const sortedProvinces = [...data].sort((a, b) => {
          const nameA = getSortName(a.name);
          const nameB = getSortName(b.name);
          return nameA.localeCompare(nameB, 'vi', { sensitivity: 'base' });
        });
        setProvinces(sortedProvinces);
      })
      .catch(err => console.error("Lỗi lấy dữ liệu tỉnh thành:", err));
  }, []);

  useEffect(() => {
    setShowModes(false);
    setShowUserMenu(false);
    setShowMobileMenu(false);

    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`${API_BASE_URL}/api/user/${userId}`)
        .then(res => res.json())
        .then(data => {
            setUser(data);
            setEditData({
              fullName: data.fullName || '',
              email: data.email || '',
              dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : ''
            });
        })
        .catch(err => console.error("Error fetching user data:", err));
    }
  }, [location]);

  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/landing') return null;

  const handleGoogleSuccess = (credentialResponse) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.warning("Bạn cần đăng nhập trước khi thực hiện liên kết!");
      return;
    }

    fetch(`${API_BASE_URL}/api/user/link-google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId,
        tokenId: credentialResponse.credential 
      })
    })
    .then(res => {
      if (!res.ok) return res.json().then(err => { throw new Error(err.message) });
      return res.json();
    })
    .then(data => {
      if (data.success) {
        setUser(data.user);
        toast.success("Liên kết tài khoản Google thành công!");
      }
    })
    .catch(err => toast.error("Lỗi liên kết Google: " + err.message));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleProvinceChange = (e) => {
    const provCode = e.target.value;
    const province = provinces.find(p => p.code == provCode); 
    setSelectedProvince(province || null);
    
    const getSortName = (name) => {
      return name.replace(/^(Thành phố|Tỉnh|Quận|Huyện|Thị xã|Thị trấn)\s+/i, '').trim();
    };

    const sortedDistricts = province?.districts 
      ? [...province.districts].sort((a, b) => {
          const nameA = getSortName(a.name);
          const nameB = getSortName(b.name);
          return nameA.localeCompare(nameB, 'vi', { sensitivity: 'base' });
        })
      : [];
      
    setDistricts(sortedDistricts);
    setSelectedDistrict(null);
    setSchoolName('');
  };

  const handleDistrictChange = (e) => {
    const distCode = e.target.value;
    const dist = districts.find(d => d.code == distCode);
    setSelectedDistrict(dist);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const userId = localStorage.getItem('userId');
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('avatar', selectedFile);

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/update-avatar`, {
        method: 'PATCH',
        body: formData
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server returned ${res.status}: ${errorText.substring(0, 100)}`);
      }

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setSelectedFile(null);
        setPreviewUrl(null);
        toast.success("Cập nhật ảnh đại diện thành công!");
      } else {
        toast.error(data.message || "Lỗi khi tải ảnh lên");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Lỗi tải ảnh: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateInfo = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !user) {
        toast.error("Không tìm thấy mã người dùng. Hãy đăng nhập lại!");
        return;
    }
    
    let fullSchoolInfo = user.school || ''; 
    if (schoolName && selectedProvince) {
        fullSchoolInfo = `${schoolName.trim()}, ${selectedDistrict ? selectedDistrict.name + ', ' : ''}${selectedProvince.name}`;
    }

    const payload = {
      userId,
      fullName: editData.fullName,
      email: editData.email,
      dateOfBirth: editData.dateOfBirth || null,
      school: fullSchoolInfo,
      province: selectedProvince?.name || user.province,
      city: selectedDistrict?.name || user.city
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/update-info`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setSchoolName('');
        toast.success("Cập nhật thông tin thành công!");
      } else {
        toast.error(data.message || "Lỗi khi cập nhật thông tin");
      }
    } catch (err) {
      console.error("Update info error:", err);
      toast.error("Lỗi kết nối máy chủ khi lưu thông tin");
    }
  };

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
    <>
      {/* TOP NAV - Visible only on Desktop/Tablet */}
      <nav ref={navRef} className="text-amber-50 sticky top-0 z-[100] h-20 transition-all" style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full relative">
            
            {/* Left: Logo */}
            <div className="flex items-center flex-1">
              <Link to="/home" className="flex items-center gap-2 group shrink-0">
                <ScrollText size={28} className="group-hover:rotate-12 transition-transform text-amber-400" />
                <span className="font-black text-lg lg:text-xl tracking-tighter uppercase hidden md:inline" style={{ background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Danh Nhân Đất Việt</span>
              </Link>
            </div>

            {/* Center: Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <Link to="/timeline" className={`px-4 py-2 rounded-lg font-bold text-sm uppercase transition flex items-center gap-2 ${location.pathname.includes('/study') || location.pathname === '/timeline' ? 'bg-amber-500/10 text-amber-400' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                <Castle size={18} /> Học Thuật
              </Link>
              
              <div className="relative">
                <button onClick={() => {setShowModes(!showModes); setShowUserMenu(false);}} className={`px-4 py-2 rounded-lg font-bold text-sm uppercase transition flex items-center gap-2 ${showModes || location.pathname === '/modes' ? 'bg-amber-500/10 text-amber-400' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                  <Swords size={18} /> Thách Đấu <ChevronDown size={14} className={`transition-transform ${showModes ? 'rotate-180' : ''}`} />
                </button>
                {showModes && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 rounded-xl shadow-2xl py-2 animate-fade-in overflow-hidden" style={{ background: '#16213e', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {modes.map((mode, idx) => (
                      <Link key={idx} to={mode.path} onClick={() => setShowModes(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white font-bold transition">
                        <span className="text-amber-500">{mode.icon}</span> {mode.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/leaderboard" className={`px-4 py-2 rounded-lg font-bold text-sm uppercase transition flex items-center gap-2 ${location.pathname === '/leaderboard' ? 'bg-amber-500/10 text-amber-400' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                <Trophy size={18} /> Phong Thần
              </Link>
            </div>

            {/* Right: Profile/XP Section */}
            <div className="flex items-center justify-end flex-1 gap-4 relative">
               <div 
                 onClick={() => {
                   setShowUserMenu(!showUserMenu);
                   setShowModes(false);
                 }}
                 className="flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 rounded-full cursor-pointer transition border"
                 style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', hover: { background: 'rgba(255,255,255,0.1)' } }}
               >
                  <img 
                    src={getAvatarUrl(user?.avatar)} 
                    alt="Avatar"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-amber-500/50 object-cover"
                  />
                  <div className="hidden sm:flex flex-col items-start">
                     <span className="text-[10px] opacity-60 font-bold uppercase tracking-tighter">Danh tướng</span>
                     <span className="font-bold text-amber-300 leading-tight">{username || 'Ẩn danh'}</span>
                  </div>
                  <div className="h-8 w-[1px] bg-amber-800 mx-1 hidden sm:block"></div>
                  <div className="flex flex-col items-center">
                     <span className="hidden sm:block text-[10px] font-bold text-amber-400 uppercase tracking-widest">Tích lũy</span>
                     <span className="text-xs font-black text-amber-300">{user?.experience || 0} XP</span>
                  </div>
               </div>

               {showUserMenu && (
                 <div className="absolute right-0 top-14 w-56 rounded-xl shadow-2xl py-2 z-50 animate-fade-in overflow-hidden text-sm" style={{ background: '#16213e', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <button 
                      onClick={() => { setShowProfile(true); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-3 text-white font-bold hover:bg-white/10 flex items-center gap-3 border-b border-white/10 transition"
                    >
                      <User size={16} className="text-amber-500" /> Thông Tin Cá Nhân
                    </button>
                    {role === 'admin' && (
                      <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex px-4 py-3 text-white font-bold hover:bg-white/10 items-center gap-3 border-b border-white/10 transition">
                        <Settings size={16} className="text-amber-500" /> Bảng Điều Khiển
                      </Link>
                    )}
                    <Link to="/change-password" onClick={() => setShowUserMenu(false)} className="flex px-4 py-3 text-white font-bold hover:bg-white/10 items-center gap-3 border-b border-white/10 transition">
                      <Key size={16} className="text-amber-500" /> Đổi Mật Khẩu
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-400 font-bold hover:bg-red-500/10 flex items-center gap-3 transition">
                      <LogOut size={16} /> Đăng Xuất
                    </button>
                 </div>
               )}
            </div>
          </div>
        </div>
      </nav>

      {/* BOTTOM NAV - Visible on all screen sizes */}
      <nav className="bottom-nav" aria-label="Điều hướng chính">
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

      {/* Shared Modals */}
      {showProfile && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
            <div className="w-full max-w-md rounded-3xl relative animate-bounce-in max-h-[90vh] flex flex-col" style={{ background: '#16213e', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
                <button 
                    onClick={() => setShowProfile(false)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all z-[210]"
                    aria-label="Close"
                >
                    <X size={24} />
                </button>
                
                <div className="text-center mb-6 pt-8 pb-4 shrink-0 border-b border-white/10">
                    <div className="relative inline-block group mb-4">
                        <img 
                            src={previewUrl || getAvatarUrl(user?.avatar)} 
                            alt="Avatar"
                            className="w-32 h-32 rounded-full border-4 border-amber-900 object-cover shadow-xl"
                        />
                        <label className="absolute bottom-0 right-0 bg-amber-900 text-white p-2 rounded-full cursor-pointer hover:bg-black transition shadow-lg flex items-center justify-center">
                            <Camera size={20} />
                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                    </div>
                    {selectedFile && (
                        <button 
                            onClick={handleUploadAvatar}
                            disabled={uploading}
                            className={`block mx-auto mb-4 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${uploading ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-500'} text-white transition`}
                        >
                            {uploading ? 'Đang tải...' : 'Xác nhận tải lên'}
                        </button>
                    )}
                    <h2 className="text-2xl font-black text-white uppercase mt-4">Hồ Sơ Danh Tướng</h2>
                    <p className="text-amber-500 italic font-bold tracking-wider">@{username}</p>
                </div>

                <div className="space-y-6 max-h-[60vh] overflow-y-auto px-8 custom-scrollbar flex-1 pb-4">
                    {isEditing ? (
                      <div className="flex flex-col">
                        <span className="text-xs uppercase font-black tracking-widest mb-1 text-amber-500/80">Địa chỉ Email</span>
                        <input 
                          type="email"
                          className="text-base font-bold text-white rounded-xl p-3 outline-none transition-all"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                          value={editData.email}
                          onChange={(e) => setEditData({...editData, email: e.target.value})}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-xs uppercase font-black tracking-widest mb-1 text-amber-500/80">Tài khoản & Liên kết</span>
                        <div className="flex flex-col gap-2">
                          <span className="text-lg font-bold text-white">{user?.email || 'Chưa cập nhật'}</span>
                          
                          {user?.googleId ? (
                            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200 w-fit">
                              <ShieldCheck size={18} className="fill-green-100" />
                              <span className="text-xs font-black uppercase tracking-wider">Đã liên kết Google</span>
                            </div>
                          ) : (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex items-center justify-between mt-2">
                              <div className="flex-1">
                                <p className="text-sm font-bold text-blue-800">Chưa liên kết Google</p>
                                <p className="text-[10px] text-blue-600 italic">Đăng nhập nhanh & bảo mật hơn</p>
                              </div>
                              <div className="scale-75 origin-right">
                                <GoogleLogin
                                  onSuccess={handleGoogleSuccess}
                                  onError={() => toast.error('Liên kết thất bại')}
                                  text="continue_with"
                                  shape="pill"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col">
                        <span className="text-xs uppercase font-black tracking-widest mb-1 text-amber-500/80">Họ và Tên</span>
                        {isEditing ? (
                          <input 
                            className="text-base font-bold text-white rounded-xl p-3 outline-none transition-all"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                            value={editData.fullName}
                            onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                          />
                        ) : (
                          <span className="text-lg font-bold text-white">{user?.fullName || 'Chưa cập nhật'}</span>
                        )}
                    </div>

                    <div className="flex justify-between gap-4">
                        <div className="flex flex-col flex-1">
                            <span className="text-xs uppercase font-black tracking-widest mb-1 text-amber-500/80">Ngày sinh</span>
                            {isEditing ? (
                              <input 
                                type="date"
                                className="text-base font-bold text-white rounded-xl p-3 outline-none transition-all"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', colorScheme: 'dark' }}
                                value={editData.dateOfBirth}
                                onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                              />
                            ) : (
                              <span className="text-base font-bold text-white">
                                  {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                              </span>
                            )}
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-xs uppercase font-black tracking-widest mb-1 text-amber-500/80">Vai trò</span>
                            <span className={`text-base font-black uppercase ${role === 'admin' ? 'text-red-400' : 'text-blue-400'}`}>
                                {role === 'admin' ? 'Quản trị viên' : 'Người chơi'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-xs uppercase font-black tracking-widest mb-1 text-amber-500/80">Thông tin trường học</span>
                        {isEditing ? (
                          <div className="space-y-3 bg-amber-50 p-3 rounded-lg border border-amber-200">
                             <select 
                                 className="p-2 border-2 border-amber-200 rounded-lg w-full bg-white focus:border-amber-500 outline-none transition text-sm text-black"
                                 onChange={handleProvinceChange}
                                 value={selectedProvince ? selectedProvince.code : ""}
                             >
                                 <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                 {provinces.map(prov => (
                                     <option key={prov.code} value={prov.code} className="text-black">{prov.name}</option>
                                 ))}
                             </select>

                             <select 
                                 className="p-2 border-2 border-amber-200 rounded-lg w-full bg-white focus:border-amber-500 outline-none transition text-sm disabled:bg-gray-200 disabled:text-gray-400 text-black"
                                 disabled={!selectedProvince}
                                 onChange={handleDistrictChange}
                                 value={selectedDistrict ? selectedDistrict.code : ""}
                             >
                                 <option value="">-- Chọn Quận/Huyện --</option>
                                 {districts.map(dist => (
                                     <option key={dist.code} value={dist.code} className="text-black">{dist.name}</option>
                                 ))}
                             </select>

                             <input 
                                 type="text"
                                 placeholder="Nhập tên trường học..."
                                 className="p-2 border-2 border-amber-200 rounded-lg w-full bg-white focus:border-amber-500 outline-none transition text-sm disabled:bg-gray-200 text-black"
                                 disabled={!selectedDistrict}
                                 value={schoolName}
                                 onChange={(e) => setSchoolName(e.target.value)}
                             />
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-white italic">{user?.school || 'Chưa cập nhật'}</span>
                        )}
                    </div>

                    {!isEditing && (
                      <div className="p-6 rounded-2xl border mt-4 text-center" style={{ background: 'rgba(212,160,83,0.1)', borderColor: 'rgba(212,160,83,0.2)' }}>
                          <span className="text-xs font-bold uppercase tracking-widest mb-2 block text-amber-300">Tổng điểm tích lũy</span>
                          <span className="text-4xl font-black text-amber-500 drop-shadow-md">{user?.experience || 0} XP</span>
                      </div>
                    )}
                </div>

                <div className="flex gap-3 p-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  {isEditing ? (
                    <>
                      <button 
                          onClick={handleUpdateInfo}
                          className="btn-primary flex-1 py-4 text-sm font-bold bg-green-600 hover:bg-green-500 text-white rounded-xl transition"
                      >
                          Lưu thông tin
                      </button>
                      <button 
                          onClick={() => setIsEditing(false)}
                          className="btn-primary flex-1 py-4 text-sm font-bold bg-gray-600 hover:bg-gray-500 text-white rounded-xl transition"
                      >
                          Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                          onClick={() => setIsEditing(true)}
                          className="btn-primary flex-1 py-4 text-sm font-bold rounded-xl transition"
                      >
                          Chỉnh sửa
                      </button>
                      <button 
                          onClick={() => setShowProfile(false)}
                          className="btn-primary flex-1 py-4 text-sm font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl transition"
                      >
                          Đóng
                      </button>
                    </>
                  )}
                </div>
            </div>
        </div>
      )}
    </>
  );
}
