// frontend/src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import API_BASE_URL from '../config/api';

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [adminCode, setAdminCode] = useState(''); 
  const [loading, setLoading] = useState(false);

  // --- STATE CHO ĐỊA CHỈ TRƯỜNG ---
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [schoolName, setSchoolName] = useState('');

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

  const handleProvinceChange = (e) => {
    const provCode = e.target.value;
    const province = provinces.find(p => p.code == provCode); 
    setSelectedProvince(province || null);
    const sortedDistricts = province?.districts 
      ? [...province.districts].sort((a, b) => {
          const getSortName = (name) => name.replace(/^(Thành phố|Tỉnh|Quận|Huyện|Thị xã|Thị trấn)\s+/i, '').trim();
          return getSortName(a.name).localeCompare(getSortName(b.name), 'vi', { sensitivity: 'base' });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setLoading(true);
    const endpoint = isRegister ? '/api/register' : '/api/login';
    
    let fullSchoolInfo = '';
    if (isRegister && schoolName && selectedProvince) {
        fullSchoolInfo = `${schoolName.trim()}, ${selectedDistrict ? selectedDistrict.name + ', ' : ''}${selectedProvince.name}`;
    }

    const payload = isRegister 
        ? { username, email, password, adminCode: adminCode.trim(), fullName, dateOfBirth, school: fullSchoolInfo, province: selectedProvince?.name || '', city: selectedDistrict?.name || '' } 
        : { username, password };

    fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) return res.json().then(err => { throw new Error(err.message) });
        return res.json();
    })
    .then(data => {
      if (isRegister) {
        alert("Đăng ký thành công! Hãy đăng nhập.");
        setIsRegister(false);
      } else {
        localStorage.setItem('userId', data._id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        if (data.token) localStorage.setItem('token', data.token);
        navigate(data.role === 'admin' ? '/admin' : '/modes');
      }
    })
    .catch(err => alert("Lỗi: " + err.message))
    .finally(() => setLoading(false));
  };

  const handleGoogleSuccess = (credentialResponse) => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenId: credentialResponse.credential })
    })
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('userId', data._id);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);
      if (data.token) localStorage.setItem('token', data.token);
      navigate(data.role === 'admin' ? '/admin' : '/modes');
    })
    .catch(err => alert("Lỗi đăng nhập Google: " + err.message))
    .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      {/* Decorative orbs */}
      <div className="absolute top-[-20%] right-[-15%] w-[50vw] h-[50vw] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, rgba(212,160,83,0.4) 0%, transparent 70%)' }}></div>
      <div className="absolute bottom-[-20%] left-[-15%] w-[50vw] h-[50vw] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, rgba(185,28,28,0.4) 0%, transparent 70%)' }}></div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-6">
          <span className="text-5xl">🏯</span>
          <h1 className="text-2xl sm:text-3xl font-black mt-3" style={{ fontFamily: "'Playfair Display', serif", background: 'linear-gradient(135deg, #f0d48a, #d4a053)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {isRegister ? "Ghi Danh Sử Sách" : "Danh Nhân Đất Việt"}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {isRegister ? "Tạo tài khoản mới" : "Đăng nhập để tiếp tục"}
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(212,160,83,0.8)' }}>Tên đăng nhập</label>
              <input type="text" placeholder="Nhập tên" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white' }} required />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(212,160,83,0.8)' }}>Mật mã</label>
              <input type="password" placeholder="Mật mã" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white' }} required />
            </div>

            {isRegister && (
              <>
                <input type="email" placeholder="Địa chỉ Email (Không bắt buộc)" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white' }} />
                <input type="text" placeholder="Họ và tên" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white' }} required />
                <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white' }} required />
                <div className="space-y-2">
                  <select onChange={handleProvinceChange} required className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white' }}>
                    <option value="" style={{ color: 'black' }}>-- Tỉnh/Thành phố --</option>
                    {provinces.map(p => <option key={p.code} value={p.code} style={{ color: 'black' }}>{p.name}</option>)}
                  </select>
                  <select onChange={handleDistrictChange} disabled={!selectedProvince} required className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white' }}>
                    <option value="" style={{ color: 'black' }}>-- Quận/Huyện --</option>
                    {districts.map(d => <option key={d.code} value={d.code} style={{ color: 'black' }}>{d.name}</option>)}
                  </select>
                  <input type="text" placeholder="Tên trường học" value={schoolName} onChange={e => setSchoolName(e.target.value)} disabled={!selectedDistrict} required className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white' }} />
                </div>
                <input type="password" placeholder="Mã Admin (nếu có)" value={adminCode} onChange={e => setAdminCode(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.15)', color: 'white' }} />
              </>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full text-base py-4 mt-2 font-bold">
              {loading ? "Đang xử lý..." : (isRegister ? "Ghi Danh" : "⚔️ Vào Thành")}
            </button>
          </form>

          {!isRegister && (
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="flex items-center w-full gap-3">
                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                <span className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>HOẶC</span>
                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
              </div>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert('Đăng nhập Google thất bại!')}
                useOneTap
                shape="pill"
                theme="filled_black"
              />
            </div>
          )}
        </div>

        {/* Switch auth mode */}
        <div className="mt-6 text-center">
          <button onClick={() => setIsRegister(!isRegister)} className="text-sm font-semibold transition-colors" style={{ color: 'rgba(212,160,83,0.7)' }}>
            {isRegister ? "Đã có tài khoản? ← Đăng nhập" : "Chưa có tài khoản? Ghi danh →"}
          </button>
        </div>
      </div>
    </div>
  );
}
