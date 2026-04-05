// frontend/src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, User, Lock, Mail, BookOpen, MapPin, Landmark } from 'lucide-react';
import API_BASE_URL from '../config/api';
import { useToast } from '../components/Toast';
import { normalizeRole } from '../utils/roleUtils';

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [registerStep, setRegisterStep] = useState(1); // Multi-step: 1 or 2
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [teacherCode, setTeacherCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formShake, setFormShake] = useState(false);

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
    const province = provinces.find((p) => String(p.code) === provCode);
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
    const dist = districts.find((d) => String(d.code) === distCode);
    setSelectedDistrict(dist);
  };

  const showError = (msg) => {
    setFormError(msg);
    setFormShake(true);
    setTimeout(() => setFormShake(false), 500);
    setTimeout(() => setFormError(''), 4000);
  };

  const handleNextStep = () => {
    if (!username.trim() || !password.trim()) {
      showError("Vui lòng điền tên đăng nhập và mật mã!");
      return;
    }
    if (password.trim().length < 3) {
      showError("Mật mã phải có ít nhất 3 ký tự!");
      return;
    }
    setFormError('');
    setRegisterStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showError("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (isRegister && registerStep === 1) {
      handleNextStep();
      return;
    }

    if (isRegister && selectedRole === 'teacher' && !teacherCode.trim()) {
      showError("Vui lòng nhập mã giáo viên để đăng ký tài khoản giáo viên!");
      return;
    }

    setLoading(true);
    setFormError('');
    const endpoint = isRegister ? '/api/register' : '/api/login';
    
    let fullSchoolInfo = '';
    if (isRegister && schoolName && selectedProvince) {
        fullSchoolInfo = `${schoolName.trim()}, ${selectedDistrict ? selectedDistrict.name + ', ' : ''}${selectedProvince.name}`;
    }

    const payload = isRegister 
        ? { username, email, password, role: selectedRole, teacherCode: teacherCode.trim(), fullName, dateOfBirth, school: fullSchoolInfo, province: selectedProvince?.name || '', city: selectedDistrict?.name || '' } 
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
        toast.success("Đăng ký thành công! Hãy đăng nhập.");
        setIsRegister(false);
        setRegisterStep(1);
      } else {
        const normalizedRole = normalizeRole(data.role);
        localStorage.setItem('userId', data._id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', normalizedRole);
        if (data.token) localStorage.setItem('token', data.token);
        toast.success("Đăng nhập thành công!");
        navigate(normalizedRole === 'teacher' ? '/courses' : '/home');
      }
    })
    .catch(err => {
      toast.error(err.message || "Đã xảy ra lỗi!");
      showError(err.message || "Đã xảy ra lỗi!");
    })
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
      const normalizedRole = normalizeRole(data.role);
      localStorage.setItem('userId', data._id);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', normalizedRole);
      if (data.token) localStorage.setItem('token', data.token);
      toast.success("Đăng nhập Google thành công!");
      navigate(normalizedRole === 'teacher' ? '/courses' : '/home');
    })
    .catch(err => toast.error("Lỗi đăng nhập Google: " + err.message))
    .finally(() => setLoading(false));
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1.5px solid rgba(255,255,255,0.1)',
    color: 'white',
  };

  const inputFocusStyle = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:border-amber-500/50";

  const switchToRegister = () => {
    setIsRegister(!isRegister);
    setRegisterStep(1);
    setFormError('');
    setSelectedRole('student');
    setTeacherCode('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative" style={{ background: 'transparent' }}>
      {/* Decorative orbs */}
      <div className="absolute top-[-20%] right-[-15%] w-[50vw] h-[50vw] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, rgba(212,160,83,0.4) 0%, transparent 70%)' }}></div>
      <div className="absolute bottom-[-20%] left-[-15%] w-[50vw] h-[50vw] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, rgba(185,28,28,0.4) 0%, transparent 70%)' }}></div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className={`rounded-3xl p-6 sm:p-8 transition-all shadow-2xl relative overflow-hidden ${formShake ? 'animate-shake' : ''}`} style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(212,160,83,0.3)', backdropFilter: 'blur(24px)' }}>
          {/* Subtle inner glow */}
          <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,83,0.6), transparent)' }}></div>
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 shadow-[0_0_20px_rgba(212,160,83,0.3)] mx-auto" style={{ background: 'linear-gradient(135deg, rgba(212,160,83,0.15), rgba(185,28,28,0.1))', border: '1px solid rgba(212,160,83,0.4)', textShadow: 'none' }}>
            <Landmark size={32} style={{ color: '#d4a053' }} />
          </div>
          <h1 className="text-2xl sm:text-[28px] font-black mt-2 leading-tight drop-shadow-md" style={{ fontFamily: "'Playfair Display', serif", background: 'linear-gradient(135deg, #fceabb, #f8b500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 2px 10px rgba(212,160,83,0.2)' }}>
            {isRegister ? "Ghi Danh Sử Sách" : "Danh Nhân Đất Việt"}
          </h1>
          <p className="text-[14px] mt-2 font-medium tracking-wide" style={{ color: '#cbd5e1' }}>
            {isRegister 
              ? (registerStep === 1 ? "Bước 1/2 — Tài khoản" : "Bước 2/2 — Thông tin cá nhân")
              : "Đăng nhập để tiếp tục"
            }
          </p>
          {/* Multi-step progress */}
          {isRegister && (
            <div className="flex items-center gap-2 justify-center mt-3">
              <div className="h-1 w-12 rounded-full transition-all duration-300" style={{ background: 'var(--viet-gold)' }} />
              <div className="h-1 w-12 rounded-full transition-all duration-300" style={{ background: registerStep >= 2 ? 'var(--viet-gold)' : 'rgba(255,255,255,0.1)' }} />
            </div>
          )}
        </div>

        {/* Form Card */}
        <div>
          
          {/* Inline error */}
          {formError && (
            <div className="animate-slide-down mb-4 p-3 rounded-xl text-sm font-semibold text-center" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* ===== LOGIN & REGISTER STEP 1 ===== */}
            {(!isRegister || registerStep === 1) && (
              <>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: 'rgba(212,160,83,0.8)' }}>
                    <User size={13} /> Tên đăng nhập
                  </label>
                  <input 
                    type="text" placeholder="Nhập tên" value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    className={inputFocusStyle} style={inputStyle} 
                    required aria-label="Tên đăng nhập"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: 'rgba(212,160,83,0.8)' }}>
                    <Lock size={13} /> Mật mã
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Mật mã" value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      className={`${inputFocusStyle} pr-12`} style={inputStyle} 
                      required aria-label="Mật mã"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors hover:bg-white/10"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                      aria-label={showPassword ? "Ẩn mật mã" : "Hiện mật mã"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {isRegister && (
                  <>
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: 'rgba(212,160,83,0.8)' }}>
                        <Mail size={13} /> Email (không bắt buộc)
                      </label>
                      <input 
                        type="email" placeholder="Địa chỉ Email" value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        className={inputFocusStyle} style={inputStyle}
                        aria-label="Email"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: 'rgba(212,160,83,0.8)' }}>
                        <User size={13} /> Vai trò tài khoản
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'teacher', title: 'Giáo viên', desc: 'Cần mã giáo viên để đăng ký' },
                          { id: 'student', title: 'Học sinh', desc: 'Tham gia lớp, chơi và học' },
                        ].map((option) => {
                          const active = selectedRole === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => {
                                setSelectedRole(option.id);
                                if (option.id !== 'teacher') {
                                  setTeacherCode('');
                                }
                              }}
                              className="rounded-2xl p-4 text-left transition"
                              style={{
                                background: active ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.05)',
                                border: active ? '1.5px solid rgba(245,158,11,0.45)' : '1.5px solid rgba(255,255,255,0.08)',
                              }}
                            >
                              <div className="text-sm font-black text-white">{option.title}</div>
                              <div className="mt-1 text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>{option.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ===== REGISTER STEP 2 ===== */}
            {isRegister && registerStep === 2 && (
              <>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: 'rgba(212,160,83,0.8)' }}>
                    <User size={13} /> Họ và tên
                  </label>
                  <input 
                    type="text" placeholder="Họ và tên" value={fullName} 
                    onChange={e => setFullName(e.target.value)} 
                    className={inputFocusStyle} style={inputStyle} required
                    aria-label="Họ và tên"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: 'rgba(212,160,83,0.8)' }}>
                    <BookOpen size={13} /> Ngày sinh
                  </label>
                  <input 
                    type="date" value={dateOfBirth} 
                    onChange={e => setDateOfBirth(e.target.value)} 
                    className={inputFocusStyle} style={{ ...inputStyle, colorScheme: 'dark' }} required
                    aria-label="Ngày sinh"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: 'rgba(212,160,83,0.8)' }}>
                    <MapPin size={13} /> Trường học
                  </label>
                  <select 
                    onChange={handleProvinceChange} required 
                    className={inputFocusStyle} style={inputStyle}
                    aria-label="Tỉnh/Thành phố"
                  >
                    <option value="" style={{ color: 'black' }}>-- Tỉnh/Thành phố --</option>
                    {provinces.map(p => <option key={p.code} value={p.code} style={{ color: 'black' }}>{p.name}</option>)}
                  </select>
                  <select 
                    onChange={handleDistrictChange} disabled={!selectedProvince} required 
                    className={`${inputFocusStyle} ${!selectedProvince ? 'opacity-50 cursor-not-allowed' : ''}`} style={inputStyle}
                    aria-label="Quận/Huyện"
                  >
                    <option value="" style={{ color: 'black' }}>-- Quận/Huyện --</option>
                    {districts.map(d => <option key={d.code} value={d.code} style={{ color: 'black' }}>{d.name}</option>)}
                  </select>
                  <input 
                    type="text" placeholder="Tên trường học" value={schoolName} 
                    onChange={e => setSchoolName(e.target.value)} 
                    disabled={!selectedDistrict} required 
                    className={`${inputFocusStyle} ${!selectedDistrict ? 'opacity-50 cursor-not-allowed' : ''}`} style={inputStyle}
                    aria-label="Tên trường học"
                  />
                </div>
                {selectedRole === 'teacher' && (
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: 'rgba(212,160,83,0.8)' }}>
                      <Lock size={13} /> Mã giáo viên
                    </label>
                    <input
                      type="password"
                      placeholder="Nhập mã giáo viên"
                      value={teacherCode}
                      onChange={e => setTeacherCode(e.target.value)}
                      className={inputFocusStyle}
                      style={{ background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.15)', color: 'white' }}
                      required
                      aria-label="Mã giáo viên"
                    />
                  </div>
                )}
              </>
            )}

            {/* Submit / Next button */}
            <div className="flex gap-3 mt-2">
              {isRegister && registerStep === 2 && (
                <button 
                  type="button" onClick={() => setRegisterStep(1)}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-full font-bold text-sm transition-all hover:bg-white/10"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
                  aria-label="Quay lại bước 1"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <button 
                type="submit" disabled={loading} 
                className="btn-primary flex-1 text-base py-3.5 font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spinner" />
                    <span>Đang xử lý...</span>
                  </>
                ) : isRegister ? (
                  registerStep === 1 ? (
                    <>
                      <span>Tiếp tục</span>
                      <ArrowRight size={18} />
                    </>
                  ) : "Ghi Danh"
                ) : "⚔️ Vào Thành"}
              </button>
            </div>
          </form>

          {!isRegister && (
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="flex items-center w-full gap-3">
                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                <span className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>HOẶC</span>
                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
              </div>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Đăng nhập Google thất bại!')}
                useOneTap
                shape="pill"
                theme="filled_black"
              />
            </div>
          )}
        </div>

        {/* Switch auth mode */}
        <div className="mt-8 text-center border-t border-white/5 pt-5 relative z-10 w-full">
          <button onClick={switchToRegister} className="text-[13px] font-bold transition-all hover:text-white" style={{ color: 'rgba(212,160,83,0.85)', letterSpacing: '0.02em' }}>
            {isRegister ? "Đã có tài khoản? ← Đăng nhập" : "Chưa có tài khoản? Ghi danh →"}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
