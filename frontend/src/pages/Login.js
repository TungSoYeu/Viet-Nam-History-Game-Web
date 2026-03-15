// frontend/src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [adminCode, setAdminCode] = useState(''); 
  const [loading, setLoading] = useState(false);

  // --- STATE CHO ĐỊA CHỈ TRƯỜNG ---
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [schoolName, setSchoolName] = useState('');

  // Lấy dữ liệu Tỉnh/Thành từ API khi vừa load form
  useEffect(() => {
    // Hàm loại bỏ tiền tố để sắp xếp chuẩn A-Z theo tên riêng
    const getSortName = (name) => {
      return name
        .replace(/^(Thành phố|Tỉnh|Quận|Huyện|Thị xã|Thị trấn)\s+/i, '')
        .trim();
    };

    fetch('https://provinces.open-api.vn/api/?depth=2')
      .then(res => res.json())
      .then(data => {
        // Sắp xếp Tỉnh/Thành theo bảng chữ cái tiếng Việt, bỏ qua tiền tố
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
    const province = provinces.find(p => p.code == provCode); 
    
    setSelectedProvince(province || null);
    
    // Hàm loại bỏ tiền tố để sắp xếp
    const getSortName = (name) => {
      return name
        .replace(/^(Thành phố|Tỉnh|Quận|Huyện|Thị xã|Thị trấn)\s+/i, '')
        .trim();
    };

    // Sắp xếp Quận/Huyện theo bảng chữ cái, bỏ qua tiền tố
    const sortedDistricts = province?.districts 
      ? [...province.districts].sort((a, b) => {
          const nameA = getSortName(a.name);
          const nameB = getSortName(b.name);
          return nameA.localeCompare(nameB, 'vi', { sensitivity: 'base' });
        })
      : [];
      
    setDistricts(sortedDistricts);
    setSelectedDistrict(null);
    setSchoolName('');
  };

  const handleDistrictChange = (e) => {
    const distCode = e.target.value;
    const dist = districts.find(d => d.code == distCode);
    setSelectedDistrict(dist);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setLoading(true);
    const endpoint = isRegister ? '/api/register' : '/api/login';
    
    // Ghép chuỗi tên trường đầy đủ để gửi lên server
    let fullSchoolInfo = '';
    if (isRegister) {
       if (schoolName && selectedProvince) {
            fullSchoolInfo = `${schoolName.trim()}, ${selectedDistrict ? selectedDistrict.name + ', ' : ''}${selectedProvince.name}`;
       }
    }

    const payload = isRegister 
        ? { 
            username, 
            password, 
            adminCode: adminCode.trim(), 
            fullName, 
            dateOfBirth, 
            school: fullSchoolInfo,
            province: selectedProvince?.name || '',
            city: selectedDistrict?.name || ''
          } 
        : { username, password };

    fetch(`http://localhost:5000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message) });
        }
        return res.json();
    })
    .then(data => {
      if (isRegister) {
        const roleMsg = data.role === 'admin' ? 'QUẢN TRỊ VIÊN' : 'Người chơi';
        alert(`Đăng ký thành công tài khoản ${roleMsg}! Hãy đăng nhập.`);
        setIsRegister(false);
        setAdminCode(''); 
        setSchoolName('');
        setSelectedProvince(null);
        setSelectedDistrict(null);
      } else {
        localStorage.setItem('userId', data._id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/modes');
        }
      }
    })
    .catch(err => {
      console.error("Login/Register error:", err);
      if (err.message === "Failed to fetch") {
        alert("Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại Backend (Port 5000)!");
      } else {
        alert("Lỗi: " + err.message);
      }
    })
    .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 history-bg">
      <div className="historical-card w-full max-w-md text-center shadow-2xl">
        <h1 className="historical-title text-4xl mb-8">
            {isRegister ? "Ghi Danh Sử Sách" : "Hành Trình Lịch Sử"}
        </h1>
        <p className="mb-6 text-gray-700 font-bold italic">
            {isRegister ? "Tạo tài khoản mới để bắt đầu" : "Bảo vệ bờ cõi - Ghi danh sử sách"}
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="text-left">
             <label className="block text-sm font-bold text-amber-900 mb-1">Tên đăng nhập:</label>
             <input 
               type="text" 
               placeholder="Nhập tên của bạn" 
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               className="p-3 border-2 border-amber-200 rounded-lg w-full bg-yellow-50 focus:border-amber-500 outline-none transition" 
               required
             />
          </div>
          
          <div className="text-left">
             <label className="block text-sm font-bold text-amber-900 mb-1">Mật mã:</label>
             <input 
               type="password" 
               placeholder="Nhập mật mã" 
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="p-3 border-2 border-amber-200 rounded-lg w-full bg-yellow-50 focus:border-amber-500 outline-none transition" 
               required
             />
          </div>

          {isRegister && (
            <>
              <div className="text-left">
                <label className="block text-sm font-bold text-amber-900 mb-1">Họ và tên:</label>
                <input 
                  type="text" 
                  placeholder="Nhập đầy đủ họ tên" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="p-3 border-2 border-amber-200 rounded-lg w-full bg-yellow-50 focus:border-amber-500 outline-none transition" 
                />
              </div>
              <div className="text-left">
                <label className="block text-sm font-bold text-amber-900 mb-1">Ngày sinh:</label>
                <input 
                  type="date" 
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="p-3 border-2 border-amber-200 rounded-lg w-full bg-yellow-50 focus:border-amber-500 outline-none transition" 
                />
              </div>
              
              {/* KHU VỰC CHỌN TRƯỜNG HỌC */}
              <div className="text-left bg-amber-50 p-3 rounded-lg border border-amber-200 mt-2">
                 <label className="block text-sm font-bold text-amber-900 mb-3">Thông tin trường học:</label>
                 
                 <div className="space-y-3">
                     <select 
                         className="p-3 border-2 border-amber-200 rounded-lg w-full bg-white focus:border-amber-500 outline-none transition text-sm text-gray-700"
                         onChange={handleProvinceChange}
                         value={selectedProvince ? selectedProvince.code : ""}
                     >
                         <option value="">-- Chọn Tỉnh/Thành phố --</option>
                         {provinces.map(prov => (
                             <option key={prov.code} value={prov.code}>{prov.name}</option>
                         ))}
                     </select>

                     <select 
                         className="p-3 border-2 border-amber-200 rounded-lg w-full bg-white focus:border-amber-500 outline-none transition text-sm disabled:bg-gray-200 disabled:text-gray-400 text-gray-700 cursor-pointer"
                         disabled={!selectedProvince}
                         onChange={handleDistrictChange}
                         value={selectedDistrict ? selectedDistrict.code : ""}
                     >
                         <option value="">-- Chọn Quận/Huyện --</option>
                         {districts.map(dist => (
                             <option key={dist.code} value={dist.code}>{dist.name}</option>
                         ))}
                     </select>

                     <input 
                         type="text"
                         placeholder="Nhập tên trường học của bạn..."
                         className="p-3 border-2 border-amber-200 rounded-lg w-full bg-white focus:border-amber-500 outline-none transition text-sm disabled:bg-gray-200 disabled:text-gray-400"
                         disabled={!selectedDistrict}
                         value={schoolName}
                         onChange={(e) => setSchoolName(e.target.value)}
                     />

                     {schoolName && selectedProvince && (
                         <p className="text-xs text-green-700 mt-2 italic bg-green-50 p-2 rounded border border-green-200">
                             Sẽ lưu: {schoolName}, {selectedDistrict?.name}, {selectedProvince.name}
                         </p>
                     )}
                 </div>
              </div>
            </>
          )}

          {isRegister && (
             <div className="text-left mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <label className="block text-xs font-bold text-red-800 mb-1">
                   Mã Quản Trị Viên (Để trống nếu bạn là người chơi):
                </label>
                <input 
                  type="password" 
                  placeholder="Nhập mã Admin nếu có" 
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="p-2 border border-red-300 rounded w-full bg-white focus:border-red-500 outline-none text-sm transition" 
                />
             </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="btn-historical w-full text-xl py-4 flex items-center justify-center mt-4"
          >
            {loading ? "Đang xử lý..." : (isRegister ? "Đăng Ký Tài Khoản" : "Vào Thành")}
          </button>
        </form>

        <div className="mt-6">
            <button 
                onClick={() => setIsRegister(!isRegister)}
                className="text-amber-800 font-bold hover:underline"
            >
                {isRegister ? "Đã có tài khoản? Đăng nhập ngay" : "Chưa có tài khoản? Ghi danh ngay"}
            </button>
        </div>
      </div>
    </div>
  );
}
