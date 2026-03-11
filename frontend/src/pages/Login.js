// frontend/src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [school, setSchool] = useState('');
  const [adminCode, setAdminCode] = useState(''); // State mới cho Mã Admin
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setLoading(true);
    const endpoint = isRegister ? '/api/register' : '/api/login';
    
    // Gửi payload kèm theo các trường mới
    const payload = isRegister 
        ? { username, password, adminCode: adminCode.trim(), fullName, dateOfBirth, school } 
        : { username, password };

    fetch(`http://localhost:5000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message) });
        }
        return res.json();
    })
    .then(data => {
      if (isRegister) {
        const roleMsg = data.role === 'admin' ? 'QUẢN TRỊ VIÊN' : 'Người chơi';
        alert(`Đăng ký thành công tài khoản ${roleMsg}! Hãy đăng nhập.`);
        setIsRegister(false);
        setAdminCode(''); // Reset form
      } else {
        // Lưu thông tin vào localStorage sau khi đăng nhập thành công
        localStorage.setItem('userId', data._id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        
        // Chuyển hướng theo role
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/modes');
        }
      }
    })
    .catch(err => {
      console.error("Lỗi:", err);
      alert(err.message || "Có lỗi xảy ra, vui lòng thử lại!");
    })
    .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 history-bg">
      <div className="historical-card w-full max-w-md text-center shadow-2xl">
        <h1 className="historical-title text-4xl mb-8">
            {isRegister ? "Ghi Danh Sử Sách" : "Hành Trình Lịch Sử"}
        </h1>
        <p className="mb-6 text-gray-700 font-bold italic">
            {isRegister ? "Tạo tài khoản mới để bắt đầu" : "Bảo vệ bờ cõi - Ghi danh sử sách"}
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="text-left">
             <label className="block text-sm font-bold text-amber-900 mb-1">Tên đăng nhập:</label>
             <input 
               type="text" 
               placeholder="Nhập tên của bạn" 
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               className="p-3 border-2 border-amber-200 rounded-lg w-full bg-yellow-50 focus:border-amber-500 outline-none transition" 
               required
             />
          </div>
          
          <div className="text-left">
             <label className="block text-sm font-bold text-amber-900 mb-1">Mật mã:</label>
             <input 
               type="password" 
               placeholder="Nhập mật mã" 
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="p-3 border-2 border-amber-200 rounded-lg w-full bg-yellow-50 focus:border-amber-500 outline-none transition" 
               required
             />
          </div>

          {isRegister && (
            <>
              <div className="text-left">
                <label className="block text-sm font-bold text-amber-900 mb-1">Họ và tên:</label>
                <input 
                  type="text" 
                  placeholder="Nhập đầy đủ họ tên" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="p-3 border-2 border-amber-200 rounded-lg w-full bg-yellow-50 focus:border-amber-500 outline-none transition" 
                />
              </div>
              <div className="text-left">
                <label className="block text-sm font-bold text-amber-900 mb-1">Ngày sinh:</label>
                <input 
                  type="date" 
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="p-3 border-2 border-amber-200 rounded-lg w-full bg-yellow-50 focus:border-amber-500 outline-none transition" 
                />
              </div>
              <div className="text-left">
                <label className="block text-sm font-bold text-amber-900 mb-1">Trường học:</label>
                <input 
                  type="text" 
                  placeholder="Nhập tên trường của bạn" 
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="p-3 border-2 border-amber-200 rounded-lg w-full bg-yellow-50 focus:border-amber-500 outline-none transition" 
                />
              </div>
            </>
          )}

          {/* Ô nhập mã Admin (Chỉ hiển thị khi đang ở form Đăng Ký) */}
          {isRegister && (
             <div className="text-left mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <label className="block text-xs font-bold text-red-800 mb-1">
                   Mã Quản Trị Viên (Để trống nếu bạn là người chơi):
                </label>
                <input 
                  type="password" 
                  placeholder="Nhập mã Admin nếu có" 
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="p-2 border border-red-300 rounded w-full bg-white focus:border-red-500 outline-none text-sm transition" 
                />
             </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="btn-historical w-full text-xl py-4 flex items-center justify-center mt-4"
          >
            {loading ? "Đang xử lý..." : (isRegister ? "Đăng Ký Tài Khoản" : "Vào Thành")}
          </button>
        </form>

        <div className="mt-6">
            <button 
                onClick={() => setIsRegister(!isRegister)}
                className="text-amber-800 font-bold hover:underline"
            >
                {isRegister ? "Đã có tài khoản? Đăng nhập ngay" : "Chưa có tài khoản? Ghi danh ngay"}
            </button>
        </div>
      </div>
    </div>
  );
}