import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flag, 
  Flame, 
  Hourglass, 
  Puzzle, 
  Swords, 
  History, 
  Library, 
  UserSearch, 
  Image as ImageIcon,
  ArrowRight,
  Trophy,
  BookOpen
} from 'lucide-react';

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
            textColor: "text-orange-600",
            icon: <Flag size={48} />,
            stats: "63 Tỉnh Thành"
        },
        { 
            id: 'challenge', 
            name: "Chinh Phục Thử Thách", 
            desc: "Vượt qua 10 câu hỏi hiểm hóc (Yêu cầu chính xác 100%).", 
            longDesc: "Thử thách khắc nghiệt nhất cho các nhà sử học. Chỉ một sai lầm nhỏ cũng khiến bạn phải bắt đầu lại từ con số không. Sự chính xác tuyệt đối là chìa khóa để ghi danh bảng vàng.",
            path: "/survival", 
            color: "bg-red-600",
            textColor: "text-red-600",
            icon: <Flame size={48} />,
            stats: "10/10 Correct"
        },
        { 
            id: 'timeAttack', 
            name: "Thử Thách Thời Gian", 
            desc: "Cuộc đua với nén nhang. Trả lời nhanh để tích điểm!", 
            longDesc: "Thời gian không chờ đợi một ai. Hãy trả lời thật nhanh trước khi nén nhang tàn lụi. Mỗi giây phút trôi qua là một cơ hội để chứng minh sự nhạy bén và kiến thức uyên thâm.",
            path: "/time-attack", 
            color: "bg-blue-600",
            textColor: "text-blue-600",
            icon: <Hourglass size={48} />,
            stats: "60 Giây"
        },
        { 
            id: 'matching', 
            name: "Nối Dữ Kiện", 
            desc: "Sắp xếp các sự kiện và nhân vật đúng trình tự.", 
            longDesc: "Lịch sử là một chuỗi các mắt xích logic. Hãy kết nối các nhân vật, sự kiện và triều đại lại với nhau để tạo nên một bức tranh toàn cảnh về quá khứ hào hùng của dân tộc.",
            path: "/matching", 
            color: "bg-green-600",
            textColor: "text-green-600",
            icon: <Puzzle size={48} />,
            stats: "Logic & Trí Nhớ"
        },
        { 
            id: 'pvp', 
            name: "Võ Đài PvP", 
            desc: "Thách đấu kiến thức lịch sử với người chơi khác.", 
            longDesc: "Đấu trường rực lửa nơi các danh tướng so tài cao thấp. Gửi lời thách đấu, đọ sức về cả tốc độ lẫn sự chính xác để khẳng định ai mới là người am tường sử Việt nhất.",
            path: "/pvp", 
            color: "bg-pink-600",
            textColor: "text-pink-600",
            icon: <Swords size={48} />,
            stats: "1v1 Trực tiếp"
        },
        { 
            id: 'chronological', 
            name: "Dòng Chảy Lịch Sử", 
            desc: "Sắp xếp các sự kiện theo đúng dòng thời gian.", 
            longDesc: "Lịch sử là một dòng chảy không ngừng nghỉ. Thử thách tư duy logic của bạn bằng cách sắp xếp các cột mốc, cuộc khởi nghĩa và triều đại từ quá khứ đến hiện tại một cách chính xác nhất.",
            path: "/chronological", 
            color: "bg-purple-600",
            textColor: "text-purple-600",
            icon: <History size={48} />,
            stats: "Sắp xếp 5 sự kiện"
        },
        { 
            id: 'millionaire', 
            name: "Khoa Cử Đình Nguyên", 
            desc: "Vượt qua 15 câu hỏi để đoạt ngôi Trạng Nguyên.", 
            longDesc: "Kỳ thi cao nhất của các sĩ tử thời xưa. Trải qua 15 câu hỏi trắc nghiệm hóc búa từ thi Hương, thi Hội đến thi Đình. Bạn có 2 quyền trợ giúp để ghi danh lên bảng vàng Trạng Nguyên.",
            path: "/millionaire", 
            color: "bg-yellow-600",
            textColor: "text-yellow-600",
            icon: <Library size={48} />,
            stats: "15 Câu - 2 Trợ giúp"
        },
        { 
            id: 'guessCharacter', 
            name: "Danh Nhân Ẩn Tích", 
            desc: "Lật mở manh mối để đoán tên anh hùng dân tộc.", 
            longDesc: "Mỗi danh nhân đều để lại những dấu ấn đậm nét. Hãy sử dụng tư duy nhạy bén, lật mở từng dữ kiện từ khó đến dễ để tìm ra tên của vị anh hùng vĩ đại đang được ẩn giấu.",
            path: "/guess-character", 
            color: "bg-teal-600",
            textColor: "text-teal-600",
            icon: <UserSearch size={48} />,
            stats: "5 Dữ kiện gợi ý"
        },
        { 
            id: 'revealPicture', 
            name: "Lật Mở Tranh Cổ", 
            desc: "Trả lời câu hỏi để giải mã bức tranh lịch sử.", 
            longDesc: "Một bức tranh lịch sử hùng tráng bị che khuất bởi 9 ô vuông bí ẩn. Bằng kiến thức của mình, hãy trả lời đúng các câu hỏi để lật mở từng mảnh ghép và đoán xem đó là sự kiện gì.",
            path: "/reveal-picture", 
            color: "bg-indigo-600",
            textColor: "text-indigo-600",
            icon: <ImageIcon size={48} />,
            stats: "Lưới ảnh 3x3"
        }
    ];

  // If a mode is selected, show its "Homepage"
  if (selectedMode) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in">
        <div className="max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700 bg-slate-800">
            <div className={`h-32 sm:h-48 ${selectedMode.color} flex items-center justify-center relative overflow-hidden`}>
                <div className="text-white opacity-20 absolute -right-4 -bottom-4 scale-[2.5]">
                    {selectedMode.icon}
                </div>
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
    <div className="min-h-screen history-bg flex flex-col items-center">
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
                className="group relative flex flex-col p-6 sm:p-8 rounded-3xl border-2 border-amber-900 bg-[#fffdf5] cursor-pointer transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transform hover:-translate-y-2 overflow-hidden min-h-[280px]"
            >
                {/* Background Accent - Animated Historical Patterns */}
                <div className={`absolute top-0 right-0 w-36 h-36 -mr-6 -mt-6 rounded-full bg-amber-100/30 opacity-20 transition-all group-hover:scale-110 group-hover:opacity-30 flex items-center justify-center p-4 ${mode.color.replace('bg-', 'text-')}`}>
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                        {mode.id === 'territory' && (
                            <g className="animate-pulse">
                                <path d="M45 10 Q 50 5, 55 10 L 60 25 Q 65 40, 55 55 T 50 85 L 45 95" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
                                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                                <path d="M50 20 L 52 48 L 80 50 L 52 52 L 50 80 L 48 52 L 20 50 L 48 48 Z" fill="currentColor" opacity="0.4" />
                            </g>
                        )}
                        {mode.id === 'challenge' && (
                            <g>
                                <path d="M50 10 L 85 25 V 50 Q 85 85, 50 95 Q 15 85, 15 50 V 25 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                                <path d="M50 25 L 75 35 V 50 Q 75 75, 50 85 Q 25 75, 25 50 V 35 Z" fill="currentColor" opacity="0.2" />
                                <path d="M45 40 Q 50 30, 55 40 T 50 60 T 45 40" fill="currentColor" className="animate-bounce" />
                            </g>
                        )}
                        {mode.id === 'timeAttack' && (
                            <g className="animate-spin-slow">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
                                <path d="M50 50 L 50 20 M50 50 L 75 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                {[...Array(12)].map((_, i) => (
                                    <circle key={i} cx={50 + 35 * Math.cos(i * Math.PI/6)} cy={50 + 35 * Math.sin(i * Math.PI/6)} r="1.5" fill="currentColor" />
                                ))}
                            </g>
                        )}
                        {mode.id === 'matching' && (
                            <g>
                                <rect x="20" y="20" width="25" height="25" rx="4" fill="none" stroke="currentColor" strokeWidth="1" />
                                <rect x="55" y="55" width="25" height="25" rx="4" fill="none" stroke="currentColor" strokeWidth="1" />
                                <path d="M45 32.5 H 55 V 55" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                                <circle cx="45" cy="32.5" r="3" fill="currentColor" />
                                <circle cx="55" cy="55" r="3" fill="currentColor" />
                            </g>
                        )}
                        {mode.id === 'pvp' && (
                            <g className="animate-pulse">
                                <path d="M20 80 L 80 20 M25 85 L 85 25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                <path d="M20 20 L 80 80 M25 15 L 85 75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
                                <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
                            </g>
                        )}
                        {mode.id === 'chronological' && (
                            <g>
                                <path d="M10 20 H 90 M10 40 H 90 M10 60 H 90 M10 80 H 90" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                                <path d="M30 15 V 85 M50 15 V 85 M70 15 V 85" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.2" />
                                <path d="M20 30 Q 50 10, 80 30 T 20 70 T 80 90" fill="none" stroke="currentColor" strokeWidth="1" className="animate-pulse" />
                            </g>
                        )}
                        {mode.id === 'millionaire' && (
                            <g>
                                <path d="M20 70 Q 50 50, 80 70 L 85 65 Q 95 65, 95 75 L 80 75 V 85 Q 50 100, 20 85 V 75 L 5 75 Q 5 65, 15 65 Z" fill="currentColor" opacity="0.4" />
                                <path d="M30 40 L 50 20 L 70 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.2" />
                            </g>
                        )}
                        {mode.id === 'guessCharacter' && (
                            <g className="animate-pulse">
                                <circle cx="50" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
                                <path d="M30 80 Q 50 60, 70 80" fill="none" stroke="currentColor" strokeWidth="2" />
                                <rect x="20" y="20" width="60" height="60" rx="30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                            </g>
                        )}
                        {mode.id === 'revealPicture' && (
                            <g>
                                <rect x="15" y="15" width="70" height="70" fill="none" stroke="currentColor" strokeWidth="1" />
                                <line x1="15" y1="38.3" x2="85" y2="38.3" stroke="currentColor" strokeWidth="0.5" />
                                <line x1="15" y1="61.6" x2="85" y2="61.6" stroke="currentColor" strokeWidth="0.5" />
                                <line x1="38.3" y1="15" x2="38.3" y2="85" stroke="currentColor" strokeWidth="0.5" />
                                <line x1="61.6" y1="15" x2="61.6" y2="85" stroke="currentColor" strokeWidth="0.5" />
                                <circle cx="50" cy="50" r="5" fill="currentColor" className="animate-ping" />
                            </g>
                        )}
                    </svg>
                </div>
                
                <div className="flex items-start justify-between mb-6">
                    <div className={`${mode.textColor} group-hover:opacity-80 transition-opacity`}>
                        {mode.icon}
                    </div>
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
                        <ArrowRight size={20} />
                    </div>
                </div>
            </div>
            ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 border-t-2 border-amber-200 pt-12">
            <button onClick={() => navigate('/leaderboard')} className="btn-historical bg-amber-800 text-white px-8 py-4 shadow-xl w-full sm:w-auto flex items-center justify-center gap-2">
                <Trophy size={20} /> Bảng Phong Thần
            </button>
            <button onClick={() => navigate('/timeline')} className="btn-historical bg-slate-700 text-white px-8 py-4 shadow-xl w-full sm:w-auto flex items-center justify-center gap-2">
                <BookOpen size={20} /> Vào Thư Viện
            </button>
        </div>
      </div>
    </div>
  );
}