import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Shield, Crown, User, Clock, Trophy, Star, History, Sword } from 'lucide-react';
import API_BASE_URL from '../config/api';
import { useApiData } from '../hooks/useApiData';
import TodayInHistory from '../components/TodayInHistory';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import HeroCarousel from '../components/HeroCarousel';
import ParchmentModal from '../components/ParchmentModal';

const heroes = [
  {
    id: 1,
    name: 'Hai Bà Trưng',
    era: '40 - 43 SCN',
    title: 'Anh thư dân tộc',
    dynasty: 'Triều Trưng',
    image: '/assets/images/hai_ba_trung.png',
    description: 'Hai Bà Trưng Trắc và Trưng Nhị là những người phụ nữ đầu tiên trong lịch sử Việt Nam lãnh đạo cuộc khởi nghĩa chống ách đô hộ nhà Đông Hán.',
    achievements: ['Khởi nghĩa năm 40 SCN', 'Giành độc lập 3 năm', 'Tự xưng vương'],
    stats: { wins: 3, time: 180, level: 1 }
  },
  {
    id: 2,
    name: 'Bà Triệu',
    era: '225 - 248',
    title: 'Nữ tướng kháng Ngô',
    dynasty: 'Thời Bắc thuộc',
    image: '/assets/images/ba_trieu.png',
    description: 'Bà Triệu (Triệu Thị Trinh) là nữ tướng lừng danh với câu nói "Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông".',
    achievements: ['Khởi nghĩa chống Đông Ngô năm 248', 'Lãnh đạo nghĩa quân ở núi Nưa', 'Biểu tượng nữ anh hùng'],
    stats: { wins: 4, time: 200, level: 2 }
  },
  {
    id: 3,
    name: 'Lý Bí',
    era: '503 - 548',
    title: 'Hoàng đế nước Vạn Xuân',
    dynasty: 'Nhà Tiền Lý',
    image: '/assets/images/ly_bi.png',
    description: 'Lý Bí (Lý Nam Đế) là người lãnh đạo cuộc khởi nghĩa chống nhà Lương, lập nước Vạn Xuân năm 544.',
    achievements: ['Lập nước Vạn Xuân 544', 'Đánh tan quân Lương', 'Xưng Lý Nam Đế'],
    stats: { wins: 6, time: 280, level: 3 }
  },
  {
    id: 4,
    name: 'Ngô Quyền',
    era: '898 - 944',
    title: 'Vua đánh tan quân Nam Hán',
    dynasty: 'Nhà Ngô',
    image: '/assets/images/ngo_quyen.png',
    description: 'Ngô Quyền là vị vua đã đánh bại quân Nam Hán trong trận Bạch Đằng năm 938, chấm dứt hơn 1000 năm Bắc thuộc.',
    achievements: ['Chiến thắng Bạch Đằng 938', 'Chấm dứt 1000 năm Bắc thuộc', 'Lập nhà Ngô'],
    stats: { wins: 8, time: 340, level: 4 }
  },
  {
    id: 5,
    name: 'Lê Hoàn',
    era: '941 - 1005',
    title: 'Hoàng đế triều Tiền Lê',
    dynasty: 'Nhà Tiền Lê',
    image: '/assets/images/le_hoan.png',
    description: 'Lê Hoàn (Lê Đại Hành) là vị vua sáng lập nhà Tiền Lê, người đã đánh bại quân Tống năm 981 tại Chi Lăng và sông Bạch Đằng.',
    achievements: ['Sáng lập nhà Tiền Lê', 'Chiến thắng quân Tống 981', 'Xưng hoàng đế'],
    stats: { wins: 15, time: 520, level: 6 }
  },
  {
    id: 6,
    name: 'Lý Thường Kiệt',
    era: '1019 - 1105',
    title: 'Danh tướng & Nhà chính trị',
    dynasty: 'Nhà Lý',
    image: '/assets/images/ly_thuong_kiet.png',
    description: 'Lý Thường Kiệt là danh tướng thời Lý, người đã lãnh đạo quân dân Đại Việt chiến thắng quân Tống năm 1077 và viết nên bài thơ Nam Quốc Sơn Hà - bản tuyên ngôn độc lập đầu tiên.',
    achievements: ['Chiến thắng quân Tống 1077', 'Viết Nam Quốc Sơn Hà', 'Phò tá 3 đời vua Lý'],
    stats: { wins: 12, time: 480, level: 5 }
  },
  {
    id: 7,
    name: 'Trần Hưng Đạo',
    era: '1228 - 1300',
    title: 'Quốc công Tiết chế',
    dynasty: 'Nhà Trần',
    image: '/assets/images/tran_hung_dao.png',
    description: 'Trần Hưng Đạo (Trần Quốc Tuấn) là Quốc công Tiết chế nhà Trần, chỉ huy tối cao quân đội, lãnh đạo chiến thắng quân Mông - Nguyên lần thứ hai (1285) và lần thứ ba (1287-1288).',
    achievements: ['Ba lần đánh bại quân Mông - Nguyên', 'Soạn Hịch tướng sĩ', 'Chiến thắng Bạch Đằng 1288'],
    stats: { wins: 6, time: 260, level: 4 }
  },
  {
    id: 8,
    name: 'Lê Lợi',
    era: '1385 - 1433',
    title: 'Vua khởi nghĩa Lam Sơn',
    dynasty: 'Nhà Hậu Lê',
    image: '/assets/images/le_loi.png',
    description: 'Lê Lợi là vị vua sáng lập nhà Hậu Lê, thủ lĩnh cuộc khởi nghĩa Lam Sơn chống ách thống trị của nhà Minh.',
    achievements: ['Khởi nghĩa Lam Sơn', 'Lập nhà Hậu Lê', 'Chiến thắng quân Minh'],
    stats: { wins: 9, time: 380, level: 5 }
  },
  {
    id: 9,
    name: 'Nguyễn Trãi',
    era: '1380 - 1442',
    title: 'Danh nhân văn hóa & Quân sư',
    dynasty: 'Nhà Hậu Lê',
    image: '/assets/images/nguyen_trai.png',
    description: 'Nguyễn Trãi là mưu sĩ kiệt xuất thời Lê sơ, Danh nhân văn hóa thế giới (UNESCO), tác giả Bình Ngô đại cáo.',
    achievements: ['Soạn Bình Ngô đại cáo', 'Phò tá Lê Lợi', 'Danh nhân văn hóa UNESCO'],
    stats: { wins: 4, time: 200, level: 3 }
  },
  {
    id: 10,
    name: 'Trương Định',
    era: '1820 - 1864',
    title: 'Bình Tây Đại Nguyên Soái',
    dynasty: 'Nhà Nguyễn',
    image: '/assets/images/truong_dinh.png',
    description: 'Trương Định là võ quan người Quảng Ngãi, được nhân dân Nam Kỳ suy tôn làm "Bình Tây Đại Nguyên Soái", kháng lệnh triều đình ở lại chống Pháp tại Gò Công.',
    achievements: ['Bình Tây Đại Nguyên Soái', 'Kháng lệnh triều đình chống Pháp', 'Khởi nghĩa Gò Công'],
    stats: { wins: 5, time: 210, level: 3 }
  },
  {
    id: 11,
    name: 'Nguyễn Trung Trực',
    era: '1838 - 1868',
    title: 'Anh hùng kháng Pháp',
    dynasty: 'Nhà Nguyễn',
    image: '/assets/images/nguyen_trung_truc.png',
    description: 'Nguyễn Trung Trực là anh hùng kháng chiến chống thực dân Pháp, nổi tiếng với câu nói "Bao giờ người Tây nhổ hết cỏ nước Nam thì mới hết người Nam đánh Tây".',
    achievements: ['Đốt tàu Hy Vọng trên sông Nhật Tảo', 'Đánh chiếm đồn Kiên Giang', 'Hy sinh anh dũng tại Rạch Giá'],
    stats: { wins: 3, time: 150, level: 2 }
  },
  {
    id: 12,
    name: 'Phan Đình Phùng',
    era: '1847 - 1895',
    title: 'Thủ lĩnh kháng chiến',
    dynasty: 'Nhà Nguyễn',
    image: '/assets/images/phan_dinh_phung.png',
    description: 'Phan Đình Phùng là thủ lĩnh khởi nghĩa Hương Khê — đỉnh cao phong trào Cần Vương, nổi tiếng với chiến thuật du kích tại vùng núi Hà Tĩnh.',
    achievements: ['Lãnh đạo khởi nghĩa Hương Khê', 'Đỉnh cao phong trào Cần Vương', 'Chế tạo súng trường kiểu Pháp'],
    stats: { wins: 8, time: 320, level: 4 }
  },
  {
    id: 13,
    name: 'Hoàng Hoa Thám',
    era: '1858 - 1913',
    title: 'Hùm thiêng Yên Thế',
    dynasty: 'Nhà Nguyễn',
    image: '/assets/images/hoang_hoa_tham.png',
    description: 'Hoàng Hoa Thám (Đề Thám) là thủ lĩnh phong trào nông dân Yên Thế (Bắc Giang), lãnh đạo cuộc khởi nghĩa chống Pháp kéo dài gần 30 năm.',
    achievements: ['Khởi nghĩa Yên Thế gần 30 năm', 'Hai lần buộc Pháp giảng hòa', 'Hùm thiêng Yên Thế'],
    stats: { wins: 7, time: 290, level: 4 }
  }
];

const iconPanels = [
  { icon: 'book', label: 'Sử liệu', component: BookOpen },
  { icon: 'sword', label: 'Quân sự', component: Shield },
  { icon: 'crown', label: 'Vương quyền', component: Crown },
  { icon: 'profile', label: 'Tiểu sử', component: User },
];

const portraitFrameStyle = {
  background:
    'radial-gradient(circle at top, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 42%, rgba(10,10,10,0.72) 100%)',
};

const portraitImageStyle = {
  objectFit: 'contain',
  objectPosition: 'center center',
  filter: 'brightness(1.12) saturate(1.08) contrast(1.03)',
};

export default function HomePage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [infoModal, setInfoModal] = useState(null);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [isDesktopViewport, setIsDesktopViewport] = useState(() => window.innerWidth >= 1024);
  const username = localStorage.getItem('username') || 'linh12345';
  const rawRole = localStorage.getItem('role') || 'student';
  const roleDisplay = (rawRole === 'teacher' || rawRole === 'GV') ? 'Giáo viên' : (rawRole === 'admin' ? 'Quản trị' : 'Học viên');

  const modalData = {
    sulieu: { title: "Kho Tàng Sử Liệu", icon: <BookOpen className="text-amber-400 mb-4" size={40} />, content: "Hệ thống lưu trữ hơn 1000+ tài liệu, thư tịch cổ, các câu chuyện lịch sử và hình ảnh chân thực về các thủ lĩnh hào hùng của dân tộc Việt Nam. Dữ liệu được biên soạn kỹ lưỡng dựa trên chính sử, giúp người chơi vừa giải trí vừa nắm bắt kiến thức một cách chuẩn xác nhất." },
    quansu: { title: "Nghệ Thuật Quân Sự", icon: <Sword className="text-amber-400 mb-4" size={40} />, content: "Phân tích chiến lược quân sự, các chiến dịch, và hệ thống phòng thủ qua các triều đại. Từ nghệ thuật thủy chiến đoạt mạng trên sông Bạch Đằng, phòng tuyến sông Như Nguyệt, đến chiến thuật du kích rừng rậm thời Pháp thuộc." },
    timeline: { title: "Dòng Chảy Thời Gian", icon: <History className="text-amber-400 mb-4" size={40} />, content: "Sơ đồ mốc thời gian liền mạch từ thời dựng nước Hùng Vương, các triều đại kỳ vĩ như Đinh, Lê, Lý, Trần, Hậu Lê đến thời kỳ kháng chiến chống Đế quốc, Thực dân. Người xem sẽ dễ dàng nắm bắt các diễn biến nối tiếp nhau." }
  };

  const userId = localStorage.getItem('userId');
  useApiData(userId ? `${API_BASE_URL}/api/user/${userId}` : null);

  useEffect(() => {
    const handleResize = () => setIsDesktopViewport(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!showModal && !carouselPaused) {
        setCurrentIndex((prev) => (prev + 1) % heroes.length);
        setBgIndex((prev) => (prev + 1) % heroes.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselPaused, showModal]);

  // Desktop keyboard navigation
  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + heroes.length) % heroes.length);
    setBgIndex((prev) => (prev - 1 + heroes.length) % heroes.length);
  }, []);
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroes.length);
    setBgIndex((prev) => (prev + 1) % heroes.length);
  }, []);

  useKeyboardShortcuts({
    ArrowLeft: goToPrev,
    ArrowRight: goToNext,
    Escape: () => { setShowModal(false); setInfoModal(null); },
  }, true);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const currentHero = heroes[currentIndex];

  return (
    <div
      className="homepage-shell min-h-[100dvh] lg:h-[100dvh] w-full relative overflow-x-hidden overflow-y-auto custom-scrollbar flex flex-col"
      style={{
        backgroundColor: 'var(--bg-base)',
        backgroundImage: "url('/assets/images/background_homepage.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(11,16,28,0.18) 0%, rgba(15,20,30,0.3) 100%), url('/assets/images/background_homepage.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.9,
          transform: 'scale(1.03)',
        }}
      />

      {/* Background - Blurred Gallery */}
      <div className="absolute inset-0 z-[1]">
        {heroes.map((hero, idx) => {
          const isNear = Math.abs(idx - bgIndex) <= 1 || (idx === 0 && bgIndex === heroes.length - 1) || (bgIndex === 0 && idx === heroes.length - 1);
          return (
            <div
              key={idx}
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: isNear ? `url('${hero.image}')` : 'none',
                backgroundSize: 'contain',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                opacity: idx === bgIndex ? 0.16 : 0,
                transform: idx === bgIndex ? 'scale(1.1)' : 'scale(1)',
                transition: 'opacity 1.5s ease-in-out, transform 6s linear',
                filter: 'blur(18px) brightness(0.8) saturate(1.08)'
              }}
            />
          );
        })}
      </div>

      {/* Deep Glass Overlay */}
      <div 
        className="absolute inset-0 z-[2]"
        style={{ 
          background: 'linear-gradient(135deg, rgba(var(--bg-base-rgb),0.34) 0%, rgba(var(--bg-base-rgb),0.22) 50%, rgba(var(--bg-base-rgb),0.4) 100%)',
          backdropFilter: 'blur(8px)'
        }}
      />

      {/* Floating Icon Panel - Right Side */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-2">
        {iconPanels.map((panel, idx) => (
          <motion.div
            key={panel.icon}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            className="group relative"
          >
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 cursor-pointer"
              style={{ 
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <panel.component size={16} className="text-white/80 group-hover:text-white transition-colors" />
            </div>
            <div 
              className="absolute right-full mr-3 px-3 py-1 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
              style={{ 
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {panel.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Glass Panel */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-6 pt-4 lg:pt-2 pb-28 sm:pb-32 lg:pb-20 flex flex-col flex-1 min-h-0 items-center justify-start lg:justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[24px] lg:rounded-3xl overflow-hidden flex flex-col w-full lg:max-h-full"
          style={{ 
            background: 'var(--page-card-bg)',
            border: '1px solid var(--page-card-border)',
            boxShadow: 'var(--page-card-shadow), inset 0 1px 0 rgba(255,255,255,0.08)',
            backdropFilter: 'blur(16px)'
          }}
        >
          {/* Header Section */}
          <div className="flex flex-col gap-3 px-3 py-3 border-b sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: 'var(--page-card-border)' }}>
            {/* Left section - Flex 1 to balance the right section */}
            <div className="flex-1 min-w-0">
              <h1 
                className="text-base font-black tracking-wide"
                style={{ fontFamily: "'Oswald', sans-serif", color: 'var(--page-heading)', letterSpacing: '0.05em' }}
              >
                DANH NHÂN ĐẤT VIỆT
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Danh sách anh hùng dân tộc
              </p>
            </div>
            
            {/* Center section - Exactly in the middle */}
            <div className="flex justify-center flex-shrink-0 gap-2 flex-wrap sm:flex-nowrap">
              <button 
                onClick={() => setInfoModal('sulieu')}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer" 
                style={{ background: 'var(--page-card-soft)' }}
              >
                <BookOpen size={14} style={{ color: 'var(--text-secondary)' }} />
                <span className="text-xs font-medium leading-none" style={{ color: 'var(--text-primary)' }}>Sử liệu</span>
              </button>
              <button 
                onClick={() => setInfoModal('quansu')}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer" 
                style={{ background: 'var(--page-card-soft)' }}
              >
                <Sword size={14} style={{ color: 'var(--text-secondary)' }} />
                <span className="text-xs font-medium leading-none" style={{ color: 'var(--text-primary)' }}>Quân sự</span>
              </button>
              <button 
                onClick={() => setInfoModal('timeline')}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer" 
                style={{ background: 'var(--page-card-soft)' }}
              >
                <History size={14} style={{ color: 'var(--text-secondary)' }} />
                <span className="text-xs font-medium leading-none" style={{ color: 'var(--text-primary)' }}>Timeline</span>
              </button>
            </div>

            {/* Right section - Flex 1 to balance the left section */}
            <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                style={{ 
                  background: 'linear-gradient(135deg, #d4a053, #f0d48a)',
                  color: '#1a1a1a'
                }}
              >
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-primary)' }}>
                  {username}
                </p>
                <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                  {roleDisplay}
                </p>
              </div>
            </div>
          </div>

              {/* Central Carousel Area */}
          <div className="p-2 lg:p-3 flex-1 min-h-0 overflow-hidden">
            <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-3 xl:grid-cols-[minmax(0,1.15fr)_340px] xl:gap-4 h-full items-stretch">
              <HeroCarousel
                items={heroes}
                currentIndex={currentIndex}
                currentItem={currentHero}
                onPrev={goToPrev}
                onNext={goToNext}
                onSelect={(nextIndex) => {
                  setCurrentIndex(nextIndex);
                  setBgIndex(nextIndex);
                }}
                onOpen={openModal}
                paused={showModal || carouselPaused}
                onHoverChange={setCarouselPaused}
                autoplayMs={5000}
              />

              <div className="flex flex-col gap-2 xl:gap-3 overflow-y-auto custom-scrollbar" style={{ maxHeight: '100%' }}>
                <div
                  className="rounded-2xl xl:rounded-3xl p-3 xl:p-5"
                  style={{
                    background: 'var(--page-card-soft)',
                    border: '1px solid var(--page-card-border)',
                    boxShadow: '0 18px 48px rgba(0,0,0,0.25)',
                    backdropFilter: 'blur(18px)'
                  }}
                >
                  <div className="text-[10px] xl:text-[11px] font-black uppercase tracking-[0.24em]" style={{ color: 'var(--viet-gold)' }}>
                    Hồ sơ đang chọn
                  </div>
                  <h2 className="mt-1 xl:mt-2 text-xl xl:text-[1.65rem] font-black" style={{ fontFamily: "'Oswald', sans-serif", color: 'var(--text-primary)' }}>
                    {currentHero.name}
                  </h2>
                  <div className="mt-1 inline-flex rounded-full px-2 py-0.5 xl:px-3 xl:py-1 text-[9px] xl:text-[11px] font-black uppercase tracking-[0.18em]" style={{ background: 'var(--page-chip-bg)', color: 'var(--page-chip-text)', border: '1px solid var(--page-chip-border)' }}>
                    {currentHero.title}
                  </div>
                  <p className="mt-2 xl:mt-3 text-[11px] xl:text-xs leading-relaxed max-h-[64px] overflow-y-auto custom-scrollbar" style={{ color: 'var(--text-secondary)' }}>
                    {currentHero.description}
                  </p>

                  <div className="mt-2 xl:mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-xl p-2 xl:p-3 flex flex-col justify-center items-center" style={{ background: 'var(--page-card-soft)', border: '1px solid var(--page-card-border)' }}>
                      <div className="text-[8px] xl:text-[9px] uppercase font-black tracking-[0.22em]" style={{ color: 'var(--text-muted)' }}>Chiến công</div>
                      <div className="mt-0.5 text-lg xl:text-xl font-black" style={{ color: 'var(--text-primary)' }}>{currentHero.stats.wins}</div>
                    </div>
                    <div className="rounded-xl p-2 xl:p-3 flex flex-col justify-center items-center" style={{ background: 'var(--page-card-soft)', border: '1px solid var(--page-card-border)' }}>
                      <div className="text-[8px] xl:text-[9px] uppercase font-black tracking-[0.22em]" style={{ color: 'var(--text-muted)' }}>Mốc</div>
                      <div className="mt-0.5 text-lg xl:text-xl font-black" style={{ color: 'var(--text-primary)' }}>{currentHero.stats.time}</div>
                    </div>
                    <div className="rounded-xl p-2 xl:p-3 flex flex-col justify-center items-center" style={{ background: 'var(--page-card-soft)', border: '1px solid var(--page-card-border)' }}>
                      <div className="text-[8px] xl:text-[9px] uppercase font-black tracking-[0.22em]" style={{ color: 'var(--text-muted)' }}>Cấp</div>
                      <div className="mt-0.5 text-lg xl:text-xl font-black" style={{ color: 'var(--text-primary)' }}>{currentHero.stats.level}</div>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-2xl xl:rounded-3xl p-3 xl:p-5"
                  style={{
                    background: 'var(--page-card-soft)',
                    border: '1px solid var(--page-card-border)',
                    backdropFilter: 'blur(16px)'
                  }}
                >
                  <div className="text-[10px] xl:text-[11px] font-black uppercase tracking-[0.24em]" style={{ color: 'var(--viet-gold)' }}>
                    Thành tựu nổi bật
                  </div>
                  <div className="mt-2 xl:mt-3 space-y-1.5 xl:space-y-2">
                    {currentHero.achievements.map((achievement, idx) => (
                      <div
                        key={achievement}
                        className="rounded-xl px-3 py-1.5 xl:px-3 xl:py-2"
                        style={{ background: 'var(--nav-surface)', border: '1px solid var(--page-card-border)' }}
                      >
                        <div className="text-[9px] xl:text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: 'var(--text-muted)' }}>
                          Mốc {idx + 1}
                        </div>
                        <div className="mt-1 text-xs xl:text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{achievement}</div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={openModal}
                    className="hover-glow-gold mt-3 py-2.5 w-full rounded-xl text-[11px] xl:text-xs font-black uppercase tracking-[0.18em] text-[#121826] transition"
                    style={{ background: 'linear-gradient(135deg, #d4a053, #f0d48a)' }}
                  >
                    Mở Sử Truyện
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:hidden">
            <div className="homepage-mobile-sheet flex flex-col items-center rounded-[24px] p-3 sm:p-4">
              {/* Large Central Carousel */}
              <div className="relative w-full max-w-md mb-4">
                <motion.div
                  key={currentHero.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={openModal}
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(212,160,83,0.1) 0%, rgba(0,0,0,0.5) 100%)',
                    border: '1px solid rgba(212,160,83,0.25)',
                    boxShadow: '0 0 80px rgba(212,160,83,0.2), inset 0 0 60px rgba(212,160,83,0.05)'
                  }}
                >
                  <div className="absolute inset-4 border rounded-xl" style={{ borderColor: 'rgba(212,160,83,0.3)' }} />
                  <div className="absolute inset-8 border rounded-lg opacity-50" style={{ borderColor: 'rgba(212,160,83,0.15)' }} />
                  
                  <div className="p-6 flex items-center justify-center">
                    <div className="relative w-full rounded-xl overflow-hidden" style={portraitFrameStyle}>
                      <img 
                        src={currentHero.image} 
                        alt={currentHero.name}
                        loading="eager"
                        className="w-full h-80 rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
                        style={{ 
                          ...portraitImageStyle,
                          boxShadow: '0 25px 80px rgba(0,0,0,0.6)'
                        }}
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ 
                      background: 'rgba(212,160,83,0.9)',
                      boxShadow: '0 0 20px rgba(212,160,83,0.5)'
                    }}
                  >
                    <span className="text-xs font-medium text-black">Xem chi tiết</span>
                  </div>
                </motion.div>

                {/* Numeric Pagination Indicator */}
                <div className="flex justify-center mt-6">
                  <div className="px-4 py-1.5 rounded-full backdrop-blur-sm text-xs font-bold tracking-widest text-amber-500"
                    style={{ background: 'rgba(212,160,83,0.1)', border: '1px solid rgba(212,160,83,0.2)' }}
                  >
                    {currentIndex + 1} / {heroes.length}
                  </div>
                </div>
              </div>

              {/* Compact Character List */}
              <div className="w-full mt-3">
                <p className="text-xs font-medium mb-2 uppercase tracking-wider text-center" style={{ color: 'var(--text-muted)' }}>
                  Các vị anh hùng
                </p>
                <div className="flex justify-center gap-1.5 flex-wrap">
                  {heroes.map((hero, idx) => (
                    <motion.button
                      key={hero.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + idx * 0.05 }}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setBgIndex(idx);
                      }}
                      className={`flex-shrink-0 transition-all duration-300 hover:scale-105 ${hero.id === currentHero.id ? 'ring-2 ring-offset-2 ring-offset-transparent' : 'opacity-60 hover:opacity-100'}`}
                      style={{ 
                        ringColor: hero.id === currentHero.id ? '#d4a053' : 'transparent'
                      }}
                    >
                      <div 
                        className="w-10 h-14 rounded-lg overflow-hidden"
                        style={{ 
                          ...portraitFrameStyle,
                          border: hero.id === currentHero.id ? '2px solid #d4a053' : '1px solid rgba(255,255,255,0.15)',
                          boxShadow: hero.id === currentHero.id ? '0 0 15px rgba(212,160,83,0.4)' : 'none'
                        }}
                      >
                        <img 
                          src={hero.image} 
                          alt={hero.name}
                          loading="lazy"
                          className="w-full h-full"
                          style={portraitImageStyle}
                        />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 hidden md:flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/timeline')}
          className="px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
          style={{ 
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.8)'
          }}
        >
          <Clock size={11} />
          <span className="text-xs font-medium">Dòng thời gian</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/modes')}
          className="px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
          style={{ 
            background: 'rgba(212,160,83,0.2)',
            border: '1px solid rgba(212,160,83,0.3)',
            color: '#d4a053'
          }}
        >
          <Trophy size={11} />
          <span className="text-xs font-medium">Chế độ chơi</span>
        </motion.button>
      </div>

      {/* Today In History — Desktop sidebar widget */}
      <div className="absolute top-2 right-2 z-20 hidden lg:block scale-90 origin-top-right">
        <TodayInHistory />
      </div>

      {/* Desktop keyboard hint */}
      <div className="absolute bottom-20 right-4 z-10 hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>← → chuyển danh nhân</span>
      </div>

      {/* Info Modal for the 3 Categories */}
      <AnimatePresence>
        {infoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setInfoModal(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-3xl p-8 flex flex-col items-center text-center overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, rgba(20,20,30,0.95) 0%, rgba(30,30,45,0.95) 100%)',
                border: '1px solid rgba(212,160,83,0.4)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
              }}
            >
              <button
                onClick={() => setInfoModal(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <X size={16} className="text-white" />
              </button>
              
              <div className="mb-2">
                {modalData[infoModal].icon}
              </div>
              <h2 className="text-xl font-black mb-4 uppercase tracking-wider" style={{ color: '#f0d48a' }}>
                {modalData[infoModal].title}
              </h2>
              <div className="w-12 h-1 mb-6 rounded-full" style={{ background: 'rgba(212,160,83,0.5)' }}></div>
              <p className="text-sm leading-relaxed text-gray-300">
                {modalData[infoModal].content}
              </p>
              
              <button 
                onClick={() => setInfoModal(null)}
                className="mt-8 px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#1a1a2e] transition hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #d4a053, #f0d48a)' }}
              >
                Đã hiểu
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <ParchmentModal
        open={showModal && isDesktopViewport}
        hero={currentHero}
        index={currentIndex}
        total={heroes.length}
        onPrev={goToPrev}
        onNext={goToNext}
        onClose={closeModal}
      />

      <AnimatePresence>
        {showModal && !isDesktopViewport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, rgba(20,20,30,0.98) 0%, rgba(40,40,50,0.95) 100%)',
                border: '1px solid rgba(212,160,83,0.3)',
                boxShadow: '0 0 80px rgba(212,160,83,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <X size={18} className="text-white" />
              </button>

              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-2/5 relative flex items-center justify-center p-3" style={portraitFrameStyle}>
                  <img 
                    src={currentHero.image} 
                    alt={currentHero.name}
                    className="w-full h-full"
                    style={portraitImageStyle}
                  />
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      background: 'linear-gradient(90deg, rgba(20,20,30,0.8) 0%, transparent 100%)'
                    }}
                  />
                </div>
                
                <div className="flex-1 p-5 sm:p-6">
                  <h2 className="text-2xl font-black mb-1" style={{ fontFamily: "'Oswald', sans-serif", color: '#d4a053' }}>
                    {currentHero.name}
                  </h2>
                  <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {currentHero.title}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <span 
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ background: 'rgba(212,160,83,0.2)', color: '#d4a053' }}
                    >
                      {currentHero.dynasty}
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {currentHero.era}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,189,125,0.15)' }}>
                        <Trophy size={16} style={{ color: '#00BD7D' }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Chiến thắng</p>
                        <p className="text-sm font-medium text-white">{currentHero.stats.wins}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
                        <Clock size={16} style={{ color: '#3b82f6' }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Thời gian</p>
                        <p className="text-sm font-medium text-white">{currentHero.stats.time} phút</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,160,83,0.15)' }}>
                        <Star size={16} style={{ color: '#d4a053' }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Cấp độ</p>
                        <p className="text-sm font-medium text-white">{currentHero.stats.level}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {currentHero.description}
                  </p>

                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Thành tựu</p>
                    <div className="flex flex-wrap gap-1.5">
                      {currentHero.achievements.map((achievement, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 rounded text-xs"
                          style={{ background: 'rgba(0,189,125,0.1)', color: '#00BD7D' }}
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
