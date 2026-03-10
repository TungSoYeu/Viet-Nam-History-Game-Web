// frontend/src/pages/Login.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/timeline');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="historical-card w-full max-w-md text-center">
        <h1 className="historical-title text-4xl mb-8">Hành Trình Lịch Sử</h1>
        <p className="mb-6 text-gray-700 font-bold italic">Khám phá cội nguồn dân tộc</p>
        <div className="flex flex-col gap-6">
          <input 
            type="text" 
            placeholder="Tên danh tướng của bạn" 
            className="p-3 border-2 border-amber-200 rounded-lg w-full text-center bg-yellow-50 focus:border-amber-500 outline-none transition" 
          />
          <button onClick={handleStart} className="btn-historical w-full text-xl py-4">
            Bắt Đầu Hành Trình
          </button>
        </div>
      </div>
    </div>
  );
}