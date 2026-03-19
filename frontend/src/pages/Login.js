// frontend/src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

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

    fetch(`http://localhost:5000${endpoint}`, {
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
        navigate(data.role === 'admin' ? '/admin' : '/modes');
      }
    })
    .catch(err => alert("Lỗi: " + err.message))
    .finally(() => setLoading(false));
  };

  const handleGoogleSuccess = (credentialResponse) => {
    setLoading(true);
    fetch('http://localhost:5000/api/google-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenId: credentialResponse.credential })
    })
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('userId', data._id);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);
      navigate(data.role === 'admin' ? '/admin' : '/modes');
    })
    .catch(err => alert("Lỗi đăng nhập Google: " + err.message))
    .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 history-bg">
      <div className="historical-card w-full max-w-md text-center shadow-2xl">
        <h1 className="historical-title text-4xl mb-8">
            {isRegister ? "Ghi Danh Sử Sách" : "Hành Trình Lịch Sử"}
        </h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="text-left">
             <label className="block text-sm font-bold text-amber-900 mb-1">Tên đăng nhập:</label>
             <input type="text" placeholder="Nhập tên" value={username} onChange={e => setUsername(e.target.value)} className="p-3 border-2 border-amber-200 rounded-lg w-full bg-yellow-50 outline-none" required />
          </div>
          <div className="text-left">
             <label className="block text-sm font-bold text-amber-900 mb-1">Mật mã:</label>
             <input type="password" placeholder="Mật mã" value={password} onChange={e => setPassword(e.target.value)} className="p-3 border-2 border-amber-200 rounded-lg w-full bg-yellow-50 outline-none" required />
          </div>

          {isRegister && (
            <>
              <input type="email" placeholder="Địa chỉ Email (Để liên kết Google)" value={email} onChange={e => setEmail(e.target.value)} className="p-3 border-2 border-amber-200 rounded-lg w-full bg-yellow-50 outline-none" required />
              <input type="text" placeholder="Họ và tên" value={fullName} onChange={e => setFullName(e.target.value)} className="p-3 border-2 border-amber-200 rounded-lg w-full bg-yellow-50" />
              <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className="p-3 border-2 border-amber-200 rounded-lg w-full bg-yellow-50" />
              <div className="text-left space-y-2">
                 <select onChange={handleProvinceChange} className="p-2 border-2 border-amber-200 rounded-lg w-full text-sm">
                     <option value="">-- Tỉnh/Thành phố --</option>
                     {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                 </select>
                 <select onChange={handleDistrictChange} disabled={!selectedProvince} className="p-2 border-2 border-amber-200 rounded-lg w-full text-sm">
                     <option value="">-- Quận/Huyện --</option>
                     {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                 </select>
                 <input type="text" placeholder="Tên trường học" value={schoolName} onChange={e => setSchoolName(e.target.value)} disabled={!selectedDistrict} className="p-2 border-2 border-amber-200 rounded-lg w-full text-sm" />
              </div>
              <input type="password" placeholder="Mã Admin (nếu có)" value={adminCode} onChange={e => setAdminCode(e.target.value)} className="p-2 border border-red-300 rounded w-full text-sm" />
            </>
          )}

          <button type="submit" disabled={loading} className="btn-historical w-full text-xl py-4 mt-4">
            {loading ? "Đang xử lý..." : (isRegister ? "Đăng Ký" : "Vào Thành")}
          </button>
        </form>

        {!isRegister && (
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="flex items-center w-full gap-2 opacity-50">
              <div className="h-[1px] bg-gray-400 flex-1"></div>
              <span className="text-xs font-bold">HOẶC</span>
              <div className="h-[1px] bg-gray-400 flex-1"></div>
            </div>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert('Đăng nhập Google thất bại!')}
              useOneTap
              shape="pill"
            />
          </div>
        )}

        <div className="mt-6">
            <button onClick={() => setIsRegister(!isRegister)} className="text-amber-800 font-bold hover:underline">
                {isRegister ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Ghi danh"}
            </button>
        </div>
      </div>
    </div>
  );
}
