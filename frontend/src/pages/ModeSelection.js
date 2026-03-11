import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ModeSelection() {
  const navigate = useNavigate();
  const [hoveredId, setHoveredMode] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);

  const competitionModes = [
    { 
        id: 'territory', 
        name: "Mở Mang Bờ Cõi", 
        desc: "Chinh phục bản đồ Việt Nam qua các trận đánh lịch sử.", 
        longDesc: "Hành trình mở rộng bờ cõi từ thời sơ khai đến hiện đại. Mỗi vùng đất chiếm lĩnh được sẽ là một cột mốc vàng son của dân tộc. Bạn đã sẵn sàng cầm gươm đi mở cõi?",
        path: "/territory-map", 
        color: "bg-orange-500",
        icon: "🚩",
        stats: "63 Tỉnh Thành"
    },
    { 
        id: 'challenge', 
        name: "Chinh Phục Thử Thách", 
        desc: "Vượt qua 10 câu hỏi hiểm hóc (Yêu cầu chính xác 100%)", 
        longDesc: "Thử thách khắc nghiệt nhất cho các nhà sử học. Chỉ một sai lầm nhỏ cũng khiến bạn phải bắt đầu lại từ con số không. Sự chính xác tuyệt đối là chìa khóa để ghi danh bảng vàng.",
        path: "/survival", 
        color: "bg-red-600",
        icon: "⚔️",
        stats: "10/10 Correct"
    },
    { 
        id: 'timeAttack', 
        name: "Thử Thách Thời Gian", 
        desc: "Cuộc đua với nén nhang. Trả lời nhanh để tích điểm!", 
        longDesc: "Thời gian không chờ đợi một ai. Hãy trả lời thật nhanh trước khi nén nhang tàn lụi. Mỗi giây phút trôi qua là một cơ hội để chứng minh sự nhạy bén và kiến thức uyên thâm.",
        path: "/time-attack", 
        color: "bg-blue-600",
        icon: "⏳",
        stats: "60 Giây"
    },
    { 
        id: 'matching', 
        name: "Nối Dữ Kiện", 
        desc: "Sắp xếp các sự kiện và nhân vật đúng trình tự.", 
        longDesc: "Lịch sử là một chuỗi các mắt xích logic. Hãy kết nối các nhân vật, sự kiện và triều đại lại với nhau để tạo nên một bức tranh toàn cảnh về quá khứ hào hùng của dân tộc.",
        path: "/matching", 
        color: "bg-green-600",
        icon: "🧩",
        stats: "Logic & Trí Nhớ"
    },
    { 
        id: 'pvp', 
        name: "Đấu Trí (PvP)", 
        desc: "Hạ chiến thư và so tài cùng các anh hùng khác.", 
        longDesc: "Võ đài dành riêng cho các bậc anh tài. Hãy gửi lời thách đấu tới bạn bè hoặc các đối thủ ẩn danh để xem ai mới thực sự là bậc thầy sử học Việt Nam.",
        path: "/pvp", 
        color: "bg-purple-600",
        icon: "🤝",
        stats: "Xếp Hạng Rank"
    },
  ];

  // If a mode is selected, show its "Homepage"
  if (selectedMode) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in">
        <div className="max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700 bg-slate-800">
            <div className={`h-32 sm:h-48 ${selectedMode.color} flex items-center justify-center relative overflow-hidden`}>
                <span className="text-7xl sm:text-9xl opacity-20 absolute -right-4 -bottom-4">{selectedMode.icon}</span>
                <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-widest z-10 px-4 text-center">{selectedMode.name}</h1>
            </div>
            
            <div className="p-6 sm:p-12">
                <div className="flex flex-col md:flex-row gap-8 sm:gap-12">
                    <div className="flex-1">
                        <h2 className="text-amber-500 font-bold uppercase mb-4 tracking-wider text-sm sm:text-base">Tổng quan nhiệm vụ</h2>
                        <p className="text-lg sm:text-xl leading-relaxed text-slate-300 italic mb-8">
                            "{selectedMode.longDesc}"
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-700 p-4 rounded-xl border border-slate-600">
                                <span className="block text-[10px] sm:text-xs uppercase text-slate-400 font-bold mb-1">Mục tiêu</span>
                                <span className="text-base sm:text-lg font-bold">{selectedMode.stats}</span>
                            </div>
                            <div className="bg-slate-700 p-4 rounded-xl border border-slate-600">
                                <span className="block text-[10px] sm:text-xs uppercase text-slate-400 font-bold mb-1">Phần thưởng</span>
                                <span className="text-base sm:text-lg font-bold">100 - 500 XP</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="md:w-64 flex flex-col gap-4">
                        <button 
                            onClick={() => navigate(selectedMode.path)}
                            className={`w-full py-5 sm:py-6 rounded-2xl font-black text-xl sm:text-2xl uppercase shadow-lg transform transition hover:scale-105 active:scale-95 ${selectedMode.color}`}
                        >
                            XUẤT QUÂN
                        </button>
                        <button 
                            onClick={() => setSelectedMode(null)}
                            className="w-full py-3 sm:py-4 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold uppercase transition text-sm sm:text-base"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center">
      {/* Selection Area */}
      <div className="responsive-container py-8 sm:py-16">
        <header className="mb-12 text-center">
            <h1 className="historical-title mb-4">Đấu Trường Sử Việt</h1>
            <p className="text-gray-600 italic text-lg sm:text-xl">"Nơi các anh hùng tranh tài và mở mang bờ cõi"</p>
        </header>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
            {competitionModes.map(mode => (
            <div 
                key={mode.id} 
                onClick={() => setSelectedMode(mode)}
                className="group relative flex flex-col p-6 sm:p-8 rounded-3xl border-2 border-gray-800 bg-white cursor-pointer transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transform hover:-translate-y-2 overflow-hidden min-h-[280px]"
            >
                {/* Background Accent */}
                <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150 ${mode.color}`}></div>
                
                <div className="flex items-start justify-between mb-6">
                    <span className="text-4xl sm:text-5xl">{mode.icon}</span>
                    <span className="text-[10px] font-black px-3 py-1 bg-gray-100 rounded-full text-gray-500 uppercase tracking-widest">Chiến Trường</span>
                </div>
                
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 uppercase tracking-tight group-hover:text-amber-700 transition-colors">
                    {mode.name}
                </h2>
                <p className="text-gray-500 text-sm sm:text-base italic font-medium leading-relaxed mb-6 flex-1">
                    {mode.desc}
                </p>
                
                <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] sm:text-xs font-bold text-gray-400 group-hover:text-amber-600 transition-colors uppercase">Xem chi tiết nhiệm vụ</span>
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white transition-all group-hover:scale-110 ${mode.color} shadow-md`}>
                        ➔
                    </div>
                </div>
            </div>
            ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 border-t-2 border-amber-200 pt-12">
            <button onClick={() => navigate('/leaderboard')} className="btn-historical bg-amber-800 text-white px-8 py-4 shadow-xl w-full sm:w-auto">
                🏆 Bảng Phong Thần
            </button>
            <button onClick={() => navigate('/timeline')} className="btn-historical bg-slate-700 text-white px-8 py-4 shadow-xl w-full sm:w-auto">
                📚 Vào Thư Viện
            </button>
        </div>
      </div>
    </div>
  );
}