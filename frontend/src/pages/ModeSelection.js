import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flag, Flame, Hourglass, Puzzle, Swords, History, 
  Library, UserSearch, Image as ImageIcon,
  ArrowRight, Trophy, BookOpen, ChevronRight
} from 'lucide-react';

export default function ModeSelection() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(null);

  const competitionModes = [
    { 
      id: 'territory', name: "Mở Mang Bờ Cõi", 
      desc: "Chinh phục bản đồ Việt Nam qua các trận đánh lịch sử.", 
      longDesc: "Hành trình mở rộng bờ cõi từ thời sơ khai đến hiện đại. Mỗi vùng đất chiếm lĩnh được sẽ là một cột mốc vàng son của dân tộc.",
      path: "/territory-map", 
      gradient: "linear-gradient(135deg, rgba(234, 88, 12, 0.9), rgba(249, 115, 22, 0.9)), url('/assets/images/mode_territory_1774157937222.png')",
      icon: <Flag size={28} />, emoji: "🗺️",
      stats: "63 Tỉnh Thành"
    },
    { 
      id: 'challenge', name: "Chinh Phục Thử Thách", 
      desc: "Vượt qua 10 câu hỏi hiểm hóc (Chính xác 100%).", 
      longDesc: "Thử thách khắc nghiệt nhất cho các nhà sử học. Chỉ một sai lầm nhỏ cũng khiến bạn phải bắt đầu lại từ con số không.",
      path: "/survival", 
      gradient: "linear-gradient(135deg, rgba(220, 38, 38, 0.9), rgba(239, 68, 68, 0.9)), url('/assets/images/mode_survival_1774157952937.png')",
      icon: <Flame size={28} />, emoji: "🔥",
      stats: "10/10 Correct"
    },
    { 
      id: 'timeAttack', name: "Thử Thách Thời Gian", 
      desc: "Cuộc đua với nén nhang. Trả lời nhanh để tích điểm!", 
      longDesc: "Thời gian không chờ đợi một ai. Hãy trả lời thật nhanh trước khi nén nhang tàn lụi.",
      path: "/time-attack", 
      gradient: "linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(59, 130, 246, 0.9)), url('/assets/images/mode_time_attack_1774157968685.png')",
      icon: <Hourglass size={28} />, emoji: "⏳",
      stats: "60 Giây"
    },
    { 
      id: 'matching', name: "Nối Dữ Kiện", 
      desc: "Kết nối các sự kiện và nhân vật đúng trình tự.", 
      longDesc: "Hãy kết nối các nhân vật, sự kiện và triều đại lại với nhau để tạo nên một bức tranh toàn cảnh.",
      path: "/matching", 
      gradient: "linear-gradient(135deg, rgba(22, 163, 74, 0.9), rgba(34, 197, 94, 0.9)), url('/assets/images/mode_matching_1774157982717.png')",
      icon: <Puzzle size={28} />, emoji: "🧩",
      stats: "Logic & Trí Nhớ"
    },
    { 
      id: 'pvp', name: "Võ Đài PvP", 
      desc: "Thách đấu kiến thức với người chơi khác.", 
      longDesc: "Đấu trường rực lửa nơi các danh tướng so tài cao thấp. Gửi lời thách đấu để khẳng định ai am tường sử Việt nhất.",
      path: "/pvp", 
      gradient: "linear-gradient(135deg, rgba(219, 39, 119, 0.9), rgba(236, 72, 153, 0.9)), url('/assets/images/mode_pvp_1774157998174.png')",
      icon: <Swords size={28} />, emoji: "⚔️",
      stats: "1v1 Trực tiếp"
    },
    { 
      id: 'chronological', name: "Dòng Chảy Lịch Sử", 
      desc: "Sắp xếp các sự kiện theo đúng dòng thời gian.", 
      longDesc: "Thử thách tư duy logic bằng cách sắp xếp các cột mốc, cuộc khởi nghĩa và triều đại một cách chính xác nhất.",
      path: "/chronological", 
      gradient: "linear-gradient(135deg, rgba(124, 58, 237, 0.9), rgba(139, 92, 246, 0.9)), url('/assets/images/mode_chronological_1774158020912.png')",
      icon: <History size={28} />, emoji: "📜",
      stats: "Sắp xếp 5 sự kiện"
    },
    { 
      id: 'millionaire', name: "Khoa Cử Đình Nguyên", 
      desc: "Vượt qua 15 câu hỏi để đoạt ngôi Trạng Nguyên.", 
      longDesc: "Kỳ thi cao nhất của các sĩ tử thời xưa. Trải qua 15 câu hỏi hóc búa với 2 quyền trợ giúp.",
      path: "/millionaire", 
      gradient: "linear-gradient(135deg, rgba(202, 138, 4, 0.9), rgba(234, 179, 8, 0.9)), url('/assets/images/mode_millionaire_1774158037315.png')",
      icon: <Library size={28} />, emoji: "🎓",
      stats: "15 Câu - 2 Trợ giúp"
    },
    { 
      id: 'guessCharacter', name: "Danh Nhân Ẩn Tích", 
      desc: "Lật mở manh mối để đoán tên anh hùng dân tộc.", 
      longDesc: "Hãy sử dụng tư duy nhạy bén, lật mở từng dữ kiện từ khó đến dễ để tìm ra tên vị anh hùng.",
      path: "/guess-character", 
      gradient: "linear-gradient(135deg, rgba(13, 148, 136, 0.9), rgba(20, 184, 166, 0.9)), url('/assets/images/mode_guess_character_1774158052018.png')",
      icon: <UserSearch size={28} />, emoji: "🕵️",
      stats: "5 Dữ kiện gợi ý"
    },
    { 
      id: 'revealPicture', name: "Lật Mở Tranh Cổ", 
      desc: "Trả lời câu hỏi để giải mã bức tranh lịch sử.", 
      longDesc: "Bức tranh lịch sử bị che khuất bởi 9 ô vuông bí ẩn. Trả lời đúng để lật mở từng mảnh ghép.",
      path: "/reveal-picture", 
      gradient: "linear-gradient(135deg, rgba(79, 70, 229, 0.9), rgba(99, 102, 241, 0.9)), url('/assets/images/mode_reveal_picture_1774158071856.png')",
      icon: <ImageIcon size={28} />, emoji: "🖼️",
      stats: "Lưới ảnh 3x3"
    }
  ];

  // Mode Detail Overlay
  if (selectedMode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <div className="max-w-2xl w-full rounded-3xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 16px 48px rgba(0,0,0,0.3)' }}>
          {/* Header banner */}
          <div 
            className="relative h-48 sm:h-56 flex items-center justify-center overflow-hidden" 
            style={{ 
              backgroundImage: selectedMode.gradient,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundBlendMode: 'overlay'
            }}
          >
            <div className="absolute inset-0 opacity-10 bg-black"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#16213e] to-transparent"></div>
            <div className="relative z-10 text-center px-6 flex flex-col items-center">
              <div className="mb-4 text-white drop-shadow-md *:w-14 *:h-14">{selectedMode.icon}</div>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">{selectedMode.name}</h1>
            </div>
          </div>
          
          {/* Body */}
          <div className="p-6 sm:p-10">
            <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
              "{selectedMode.longDesc}"
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="block text-[10px] uppercase font-bold mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Mục tiêu</span>
                <span className="text-white font-bold">{selectedMode.stats}</span>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="block text-[10px] uppercase font-bold mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Phần thưởng</span>
                <span className="text-white font-bold">100 - 500 XP</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigate(selectedMode.path)}
                className="w-full py-4 rounded-2xl font-black text-lg uppercase text-white transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ 
                  background: selectedMode.gradient.split(', url')[0], // Use just the gradient part for button
                  backgroundSize: 'cover',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)' 
                }}
              >
                XUẤT QUÂN <ChevronRight size={20} />
              </button>
              <button 
                onClick={() => setSelectedMode(null)}
                className="w-full py-3 rounded-2xl font-semibold uppercase text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                ← Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="responsive-container py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 text-center mt-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(212,160,83,0.8)' }}>⚔️ Đấu Trường</p>
          <h1 className="historical-title mb-2 text-white" style={{ background: 'linear-gradient(135deg, #f0d48a, #d4a053)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chọn Chế Độ Chơi</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Chọn một chế độ để bắt đầu hành trình</p>
        </header>
        
        {/* Mode Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-12 stagger-children">
          {competitionModes.map((mode, idx) => (
            <div 
              key={mode.id} 
              onClick={() => setSelectedMode(mode)}
              className="relative rounded-3xl overflow-hidden cursor-pointer group animate-fade-in-up opacity-0 flex flex-col"
              style={{ 
                animationDelay: `${idx * 0.05}s`, 
                animationFillMode: 'forwards',
                minHeight: '230px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}
            >
              {/* Full Background Image */}
              <div 
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" 
                style={{ 
                  backgroundImage: mode.gradient.replace('linear-gradient(135deg, ', '').replace(/rgba\([^)]+\), rgba\([^)]+\)\), /, ''), // Extract just the url() part by removing the gradient
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              ></div>
              
              {/* Dark Gradient Overlay for Readability */}
              <div 
                className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-80"
                style={{ 
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.6) 40%, rgba(15, 23, 42, 0.2) 100%)' 
                }}
              ></div>
              
              {/* Content Container */}
              <div className="relative z-10 flex-1 flex flex-col justify-end p-5">
                {/* Top Badge */}
                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center text-white backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  {mode.icon}
                </div>
                
                {/* Title & Desc */}
                <h2 className="text-xl font-black text-white mb-1 group-hover:text-amber-400 transition-colors tracking-wide drop-shadow-md">
                  {mode.name}
                </h2>
                <p className="text-xs mb-3 leading-relaxed line-clamp-2 drop-shadow-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {mode.desc}
                </p>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(212,160,83,0.9)' }}>{mode.stats}</span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white transition-all group-hover:translate-x-1" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pb-4">
          <button onClick={() => navigate('/leaderboard')} className="btn-primary px-8 py-3.5 flex items-center justify-center gap-2 text-sm">
            <Trophy size={18} /> Bảng Phong Thần
          </button>
          <button onClick={() => navigate('/timeline')} className="btn-gold px-8 py-3.5 flex items-center justify-center gap-2 text-sm">
            <BookOpen size={18} /> Vào Thư Viện
          </button>
        </div>
      </div>
    </div>
  );
}