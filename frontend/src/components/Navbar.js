import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { authFetch } from '../utils/authFetch';
import { useToast } from './Toast';
import { getActiveClassroomName } from '../utils/classroomContext';
import { getRoleLabel, isTeacherRole, normalizeRole } from '../utils/roleUtils';
import TopNavbar from './nav/TopNavbar';
import BottomNav from './nav/BottomNav';
import ProfileModal from './nav/ProfileModal';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const navRef = useRef(null);

  const [showModes, setShowModes] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const username = localStorage.getItem('username');
  const role = normalizeRole(localStorage.getItem('role'));
  const activeClassroomName = getActiveClassroomName();
  const isTeacher = isTeacherRole(role);
  
  const [user, setUser] = useState(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // --- STATE CHO ĐỊA CHỈ TRONG PROFILE ---
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [schoolName, setSchoolName] = useState('');

  const [editData, setEditData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: ''
  });

  const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjNlbSIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPlU8L3RleHQ+PC9zdmc+";

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return DEFAULT_AVATAR;
    if (avatarPath.startsWith('/uploads')) return `${API_BASE_URL}${avatarPath}`;
    if (avatarPath.startsWith('http')) return avatarPath;
    return DEFAULT_AVATAR;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfile) return;
      if (navRef.current && !navRef.current.contains(event.target)) {
        setShowModes(false);
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfile]);

  useEffect(() => {
    setShowModes(false);
    setShowUserMenu(false);

    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`${API_BASE_URL}/api/user/${userId}`)
        .then(res => res.json())
        .then(data => {
            setUser(data);
            setEditData({
              fullName: data.fullName || '',
              email: data.email || '',
              dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : ''
            });
            setSelectedProvince(data.province || null);
            setSelectedDistrict(data.city || null);
            setSchoolName(data.school ? data.school.split(',')[0].trim() : '');
        })
        .catch(err => console.error("Error fetching user data:", err));
    }
  }, [location]);

  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/landing') return null;

  const handleGoogleSuccess = (credentialResponse) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.warning("Bạn cần đăng nhập trước khi thực hiện liên kết!");
      return;
    }

    fetch(`${API_BASE_URL}/api/user/link-google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, tokenId: credentialResponse.credential })
    })
    .then(res => {
      if (!res.ok) return res.json().then(err => { throw new Error(err.message) });
      return res.json();
    })
    .then(data => {
      if (data.success) {
        setUser(data.user);
        toast.success("Liên kết tài khoản Google thành công!");
      }
    })
    .catch(err => toast.error("Lỗi liên kết Google: " + err.message));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const userId = localStorage.getItem('userId');
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('avatar', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: token ? `Bearer ${token}` : '' };
      const res = await fetch(`${API_BASE_URL}/api/user/update-avatar`, { method: 'PATCH', body: formData, headers });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server returned ${res.status}: ${errorText.substring(0, 100)}`);
      }
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setSelectedFile(null);
        setPreviewUrl(null);
        toast.success("Cập nhật ảnh đại diện thành công!");
      } else {
        toast.error(data.message || "Lỗi khi tải ảnh lên");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Lỗi tải ảnh: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateInfo = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !user) {
        toast.error("Không tìm thấy mã người dùng. Hãy đăng nhập lại!");
        return;
    }
    
    let fullSchoolInfo = user.school || ''; 
    if (schoolName && selectedProvince) {
        fullSchoolInfo = `${schoolName.trim()}, ${selectedDistrict ? selectedDistrict + ', ' : ''}${selectedProvince}`;
    }

    const payload = {
      userId,
      fullName: editData.fullName,
      email: editData.email,
      dateOfBirth: editData.dateOfBirth || null,
      school: fullSchoolInfo,
      province: selectedProvince || user.province,
      city: selectedDistrict || user.city
    };

    try {
      const res = await authFetch(`${API_BASE_URL}/api/user/update-info`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
        toast.success("Cập nhật thông tin thành công!");
      } else {
        toast.error(data.message || "Lỗi khi cập nhật thông tin");
      }
    } catch (err) {
      console.error("Update info error:", err);
      toast.error("Lỗi kết nối máy chủ");
    }
  };

  return (
    <>
      <TopNavbar 
        navRef={navRef}
        user={user}
        username={username}
        roleLabel={getRoleLabel(role)}
        activeClassroomName={activeClassroomName}
        isTeacher={isTeacher}
        showModes={showModes}
        setShowModes={setShowModes}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        setShowProfile={setShowProfile}
        handleLogout={handleLogout}
        getAvatarUrl={getAvatarUrl}
      />

      <BottomNav 
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        user={user}
        getAvatarUrl={getAvatarUrl}
      />

      {showProfile && (
        <ProfileModal 
          user={user}
          username={username}
          role={role}
          isTeacher={isTeacher}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editData={editData}
          setEditData={setEditData}
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          schoolName={schoolName}
          setSchoolName={setSchoolName}
          handleUpdateInfo={handleUpdateInfo}
          previewUrl={previewUrl}
          handleFileChange={handleFileChange}
          selectedFile={selectedFile}
          uploading={uploading}
          handleUploadAvatar={handleUploadAvatar}
          setShowProfile={setShowProfile}
          getAvatarUrl={getAvatarUrl}
          handleGoogleSuccess={handleGoogleSuccess}
          getRoleLabel={getRoleLabel}
          toast={toast}
        />
      )}
    </>
  );
}
