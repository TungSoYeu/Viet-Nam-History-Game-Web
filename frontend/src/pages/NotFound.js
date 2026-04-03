import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinOff, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="text-center max-w-md animate-fade-in">
        <div className="mb-6">
          <MapPinOff size={80} className="text-amber-500 mx-auto opacity-60" />
        </div>
        <h1 className="text-7xl font-black mb-2" style={{ background: 'linear-gradient(135deg, #f0d48a, #d4a053)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Lạc Đường Rồi, Danh Tướng!</h2>
        <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
          "Con đường này không dẫn đến bất kỳ chiến trường nào. Hãy quay lại sảnh chính để tiếp tục hành trình."
        </p>
        <button 
          onClick={() => navigate('/modes')} 
          className="btn-primary px-8 py-4 flex items-center gap-2 mx-auto text-base"
        >
          <ArrowLeft size={20} /> Về Sảnh Chính
        </button>
      </div>
    </div>
  );
}
