import React from 'react';
import { Camera, X, ShieldCheck } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import Button from '../Button';
import { useProvinces } from '../../hooks/useProvinces';
import { GOOGLE_CLIENT_ID } from '../../config/env';

export default function ProfileModal({ 
  user, username, role, isTeacher, isEditing, setIsEditing,
  editData, setEditData,
  selectedProvince, setSelectedProvince,
  selectedDistrict, setSelectedDistrict,
  schoolName, setSchoolName,
  handleUpdateInfo,
  previewUrl, handleFileChange, selectedFile, uploading, handleUploadAvatar,
  setShowProfile, getAvatarUrl, handleGoogleSuccess, toast, getRoleLabel 
}) {
  const { provinces } = useProvinces();
  const hasGoogleLogin = Boolean(GOOGLE_CLIENT_ID);
  
  // Lấy danh sách districts dựa trên selectedProvince đã chọn
  const districts = React.useMemo(() => {
    if (!selectedProvince) return [];
    const getSortName = (name) => name.replace(/^(Thành phố|Tỉnh|Quận|Huyện|Thị xã|Thị trấn)\s+/i, '').trim();
    const prov = provinces.find(p => String(p.code) === String(selectedProvince));
    if (!prov?.districts) return [];
    return [...prov.districts].sort((a, b) => {
        const nameA = getSortName(a.name);
        const nameB = getSortName(b.name);
        return nameA.localeCompare(nameB, 'vi', { sensitivity: 'base' });
    });
  }, [provinces, selectedProvince]);

  const handleProvinceChange = (e) => {
    const provCode = e.target.value;
    setSelectedProvince(provCode);
    setSelectedDistrict("");
    setSchoolName('');
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const fieldStyle = {
    background: 'var(--profile-subtle-surface)',
    border: '1px solid var(--page-card-border)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="page-modal-backdrop fixed inset-0 flex items-center justify-center z-[200] p-4">
            <div className="profile-modal-card w-full max-w-md rounded-3xl relative animate-bounce-in max-h-[90vh] flex flex-col">
                <button 
                    onClick={() => setShowProfile(false)}
                    className="absolute top-4 right-4 p-2 rounded-full transition-all z-[210]"
                    style={{ color: 'var(--text-muted)', background: 'var(--profile-subtle-surface)' }}
                    aria-label="Close"
                >
                    <X size={24} />
                </button>
                
                <div className="text-center mb-6 pt-8 pb-4 shrink-0 border-b border-white/10">
                    <div className="relative inline-block group mb-4">
                        <img 
                            src={previewUrl || getAvatarUrl(user?.avatar)} 
                            alt="Avatar"
                            className="w-32 h-32 rounded-full border-4 border-amber-900 object-cover shadow-xl"
                        />
                        <label className="absolute bottom-0 right-0 bg-amber-900 text-white p-2 rounded-full cursor-pointer hover:bg-black transition shadow-lg flex items-center justify-center">
                            <Camera size={20} />
                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                    </div>
                    {selectedFile && (
                        <button 
                            onClick={handleUploadAvatar}
                            disabled={uploading}
                            className={`block mx-auto mb-4 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${uploading ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-500'} text-white transition`}
                        >
                            {uploading ? 'Đang tải...' : 'Xác nhận tải lên'}
                        </button>
                    )}
                    <h2 className="text-2xl font-black uppercase mt-4" style={{ color: 'var(--text-primary)' }}>Hồ Sơ Danh Tướng</h2>
                    <p className="text-amber-500 italic font-bold tracking-wider">@{username}</p>
                </div>

                <div className="space-y-6 max-h-[60vh] overflow-y-auto px-8 custom-scrollbar flex-1 pb-4">
                    {isEditing ? (
                      <div className="flex flex-col">
                        <span className="text-xs uppercase font-black tracking-widest mb-1 text-amber-500/80">Địa chỉ Email</span>
                        <input 
                          type="email"
                          className="text-base font-bold rounded-xl p-3 outline-none transition-all"
                          style={fieldStyle}
                          value={editData.email}
                          onChange={(e) => setEditData({...editData, email: e.target.value})}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-xs uppercase font-black tracking-widest mb-1 text-amber-500/80">Tài khoản & Liên kết</span>
                        <div className="flex flex-col gap-2">
                          <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{user?.email || 'Chưa cập nhật'}</span>
                          
                          {user?.googleId ? (
                            <div className="profile-status-success flex items-center gap-2 text-green-500 px-3 py-2 rounded-lg border border-green-500/30 w-fit">
                              <ShieldCheck size={18} className="fill-green-900" />
                              <span className="text-xs font-black uppercase tracking-wider">Đã liên kết Google</span>
                            </div>
                          ) : hasGoogleLogin ? (
                            <div className="profile-status-info p-4 rounded-xl border border-blue-500/30 flex items-center justify-between mt-2">
                              <div className="flex-1">
                                <p className="text-sm font-bold text-blue-300">Chưa liên kết Google</p>
                                <p className="text-[10px] text-blue-400/80 italic">Đăng nhập nhanh & bảo mật hơn</p>
                              </div>
                              <div className="scale-75 origin-right">
                                <GoogleLogin
                                  onSuccess={handleGoogleSuccess}
                                  onError={() => toast.error('Liên kết thất bại')}
                                  text="continue_with"
                                  shape="pill"
                                />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col">
                        <span className="text-xs uppercase font-black tracking-widest mb-1 text-amber-500/80">Họ và Tên</span>
                        {isEditing ? (
                          <input 
                            className="text-base font-bold rounded-xl p-3 outline-none transition-all"
                            style={fieldStyle}
                            value={editData.fullName}
                            onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                          />
                        ) : (
                          <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{user?.fullName || 'Chưa cập nhật'}</span>
                        )}
                    </div>

                    <div className="flex justify-between gap-4">
                        <div className="flex flex-col flex-1">
                            <span className="text-xs uppercase font-black tracking-widest mb-1 text-amber-500/80">Ngày sinh</span>
                            {isEditing ? (
                              <input 
                                type="date"
                                className="text-base font-bold rounded-xl p-3 outline-none transition-all"
                                style={fieldStyle}
                                value={editData.dateOfBirth}
                                onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                              />
                            ) : (
                              <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                                  {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                              </span>
                            )}
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-xs uppercase font-black tracking-widest mb-1 text-amber-500/80">Vai trò</span>
                            <span className={`text-base font-black uppercase ${isTeacher ? 'text-red-400' : 'text-blue-400'}`}>
                                {getRoleLabel(role)}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-xs uppercase font-black tracking-widest mb-1 text-amber-500/80">Thông tin trường học</span>
                        {isEditing ? (
                          <div className="space-y-3 p-3 rounded-lg border border-white/10" style={{ background: 'var(--profile-subtle-surface)' }}>
                             <select 
                                 className="p-2 border border-white/10 rounded-lg w-full focus:border-amber-500 outline-none transition text-sm"
                                 style={fieldStyle}
                                 onChange={handleProvinceChange}
                                 value={selectedProvince || ""}
                             >
                                 <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                 {provinces.map(prov => (
                                     <option key={prov.code} value={prov.code}>{prov.name}</option>
                                 ))}
                             </select>

                             <select 
                                 className="p-2 border border-white/10 rounded-lg w-full focus:border-amber-500 outline-none transition text-sm disabled:opacity-50"
                                 style={fieldStyle}
                                 disabled={!selectedProvince}
                                 onChange={handleDistrictChange}
                                 value={selectedDistrict || ""}
                             >
                                 <option value="">-- Chọn Quận/Huyện --</option>
                                 {districts.map(dist => (
                                     <option key={dist.code} value={dist.code}>{dist.name}</option>
                                 ))}
                             </select>

                             <input 
                                 type="text"
                                 placeholder="Nhập tên trường học..."
                                 className="p-2 border border-white/10 rounded-lg w-full focus:border-amber-500 outline-none transition text-sm disabled:opacity-50"
                                 style={fieldStyle}
                                 disabled={!selectedDistrict}
                                 value={schoolName}
                                 onChange={(e) => setSchoolName(e.target.value)}
                             />
                          </div>
                        ) : (
                          <span className="text-lg font-bold italic" style={{ color: 'var(--text-primary)' }}>{user?.school || 'Chưa cập nhật'}</span>
                        )}
                    </div>

                    {!isEditing && (
                      <div className="p-6 rounded-2xl border mt-4 text-center" style={{ background: 'var(--page-chip-bg)', borderColor: 'var(--page-chip-border)' }}>
                          <span className="text-xs font-bold uppercase tracking-widest mb-2 block text-amber-300">Tổng điểm tích lũy</span>
                          <span className="text-4xl font-black text-amber-500 drop-shadow-md">{user?.experience || 0} XP</span>
                      </div>
                    )}
                </div>

                <div className="flex gap-3 p-6 border-t" style={{ borderColor: 'var(--page-card-border)' }}>
                  {isEditing ? (
                    <>
                      <Button 
                          onClick={handleUpdateInfo}
                          variant="success"
                          fullWidth
                      >
                          Lưu thông tin
                      </Button>
                      <Button 
                          onClick={() => setIsEditing(false)}
                          variant="ghost"
                          fullWidth
                      >
                          Hủy
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                          onClick={() => setIsEditing(true)}
                          variant="primary"
                          fullWidth
                      >
                          Chỉnh sửa
                      </Button>
                      <Button 
                          onClick={() => setShowProfile(false)}
                          variant="ghost"
                          fullWidth
                      >
                          Đóng
                      </Button>
                    </>
                  )}
                </div>
            </div>
        </div>
  );
}
