import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    setLoading(true);
    const userId = localStorage.getItem('userId');

    fetch('http://localhost:5000/api/user/change-password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, oldPassword, newPassword })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Đổi mật khẩu thành công!");
        navigate('/modes');
      } else {
        alert(data.message || "Có lỗi xảy ra");
      }
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  };

  return (
    <div className="p-8 min-h-screen flex items-center justify-center">
      <div className="historical-card w-full max-w-md">
        <h2 className="text-3xl font-black text-amber-900 mb-6 uppercase text-center">Đổi Mật Khẩu</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-bold mb-1">Mật khẩu cũ:</label>
            <input 
              type="password" 
              className="w-full p-3 border-2 border-amber-200 rounded-lg" 
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Mật khẩu mới:</label>
            <input 
              type="password" 
              className="w-full p-3 border-2 border-amber-200 rounded-lg" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Xác nhận mật khẩu mới:</label>
            <input 
              type="password" 
              className="w-full p-3 border-2 border-amber-200 rounded-lg" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-historical mt-4">
            {loading ? "Đang xử lý..." : "Cập nhật Mật mã"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="text-gray-500 font-bold">Quay lại</button>
        </form>
      </div>
    </div>
  );
}
