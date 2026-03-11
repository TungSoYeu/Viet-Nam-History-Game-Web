import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [activeTab, setActiveTab] = useState('question');
  const [loading, setLoading] = useState(false);
  
  // Question Form State
  const [qContent, setQContent] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState('');
  const [qLesson, setQLesson] = useState('');
  const [qExplanation, setQExplanation] = useState('');
  const [qDifficulty, setQDifficulty] = useState(1);
  const [qLocation, setQLocation] = useState('');

  // Lesson Form State
  const [lTitle, setLTitle] = useState('');
  const [lDescription, setLDescription] = useState('');
  const [lOrder, setLOrder] = useState(1);
  const [lWikiContent, setLWikiContent] = useState('');

  // Matching Form State
  const [mTitle, setMTitle] = useState('');
  const [mType, setMType] = useState('Character-Dynasty');
  const [mPairs, setMPairs] = useState([{ left: '', right: '' }]);

  useEffect(() => {
    if (localStorage.getItem('role') !== 'admin') {
      navigate('/modes');
      return;
    }
    fetchLessons();
  }, [navigate]);

  const fetchLessons = () => {
    fetch('http://localhost:5000/api/lessons')
      .then(res => res.json())
      .then(data => setLessons(data));
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    setLoading(true);
    const userId = localStorage.getItem('userId');
    
    fetch('http://localhost:5000/api/admin/questions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'user-id': userId
      },
      body: JSON.stringify({
        content: qContent,
        options: qOptions,
        correctAnswer: qCorrect,
        lessonId: qLesson,
        explanation: qExplanation,
        difficulty: qDifficulty,
        location: qLocation
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Thêm câu hỏi thành công!");
        setQContent('');
        setQOptions(['', '', '', '']);
        setQCorrect('');
        setQExplanation('');
      } else {
        alert("Lỗi: " + data.message);
      }
    })
    .finally(() => setLoading(false));
  };

  const handleAddLesson = (e) => {
    e.preventDefault();
    setLoading(true);
    const userId = localStorage.getItem('userId');

    fetch('http://localhost:5000/api/admin/lessons', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': userId
        },
        body: JSON.stringify({
          title: lTitle,
          description: lDescription,
          order: lOrder,
          wiki: { content: lWikiContent }
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Thêm triều đại thành công!");
            setLTitle('');
            setLDescription('');
            setLOrder(lOrder + 1);
            setLWikiContent('');
            fetchLessons();
        }
    })
    .finally(() => setLoading(false));
  };

  const handleAddMatching = (e) => {
    e.preventDefault();
    setLoading(true);
    const userId = localStorage.getItem('userId');

    fetch('http://localhost:5000/api/admin/matching', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': userId
        },
        body: JSON.stringify({
          title: mTitle,
          type: mType,
          pairs: mPairs
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Thêm dữ liệu nối thành công!");
            setMTitle('');
            setMPairs([{ left: '', right: '' }]);
        }
    })
    .finally(() => setLoading(false));
  };

  const addPair = () => setMPairs([...mPairs, { left: '', right: '' }]);

  return (
    <div className="p-4 md:p-8 min-h-screen bg-amber-50">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-4 border-amber-900 pb-4">
            <h1 className="text-3xl md:text-4xl font-black text-amber-900 uppercase">
                Điều Hành Sử Quán (Admin)
            </h1>
            <button onClick={() => navigate('/modes')} className="mt-4 md:mt-0 px-6 py-2 font-bold bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                Quay lại Game
            </button>
        </header>

        <div className="flex flex-wrap gap-2 mb-8">
           <button onClick={() => setActiveTab('question')} className={`px-4 py-2 font-bold rounded-lg transition ${activeTab === 'question' ? 'bg-amber-800 text-white shadow-lg' : 'bg-white text-amber-800 border-2 border-amber-800'}`}>
              ⚔️ Câu Hỏi (Campaign/Survival)
           </button>
           <button onClick={() => setActiveTab('matching')} className={`px-4 py-2 font-bold rounded-lg transition ${activeTab === 'matching' ? 'bg-amber-800 text-white shadow-lg' : 'bg-white text-amber-800 border-2 border-amber-800'}`}>
              🧩 Nối Dữ Kiện (Matching)
           </button>
           <button onClick={() => setActiveTab('lesson')} className={`px-4 py-2 font-bold rounded-lg transition ${activeTab === 'lesson' ? 'bg-amber-800 text-white shadow-lg' : 'bg-white text-amber-800 border-2 border-amber-800'}`}>
              🏯 Triều Đại (Lessons)
           </button>
        </div>

        {/* TAB: THÊM CÂU HỎI */}
        {activeTab === 'question' && (
          <div className="historical-card bg-white p-6 rounded-xl shadow-md border-2 border-amber-200">
            <h2 className="text-2xl font-bold mb-6 text-amber-900 border-l-4 border-amber-700 pl-3">Nạp Câu Hỏi Trắc Nghiệm</h2>
            <form onSubmit={handleAddQuestion} className="flex flex-col gap-5">
               <div>
                  <label className="block font-bold mb-1 text-amber-800">Nội dung câu hỏi:</label>
                  <textarea 
                    className="w-full p-3 border-2 border-amber-100 rounded-lg focus:border-amber-500 outline-none"
                    value={qContent}
                    onChange={(e) => setQContent(e.target.value)}
                    placeholder="Ví dụ: Ai là người dời đô về Thăng Long?"
                    required
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {qOptions.map((opt, idx) => (
                    <div key={idx}>
                       <label className="block font-bold mb-1 text-sm text-amber-700">Đáp án {idx + 1}:</label>
                       <input 
                         type="text"
                         className="w-full p-2 border-2 border-amber-100 rounded-lg focus:border-amber-500 outline-none"
                         value={opt}
                         onChange={(e) => {
                           const newOpts = [...qOptions];
                           newOpts[idx] = e.target.value;
                           setQOptions(newOpts);
                         }}
                         placeholder={`Lựa chọn ${idx + 1}`}
                         required
                       />
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold mb-1 text-amber-800">Đáp án đúng:</label>
                    <input 
                      type="text"
                      className="w-full p-2 border-2 border-green-200 rounded-lg focus:border-green-500 outline-none"
                      value={qCorrect}
                      onChange={(e) => setQCorrect(e.target.value)}
                      placeholder="Nhập lại chính xác 1 đáp án"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-amber-800">Thuộc triều đại:</label>
                    <select 
                      className="w-full p-2 border-2 border-amber-100 rounded-lg focus:border-amber-500 outline-none"
                      value={qLesson}
                      onChange={(e) => setQLesson(e.target.value)}
                      required
                    >
                       <option value="">-- Chọn triều đại --</option>
                       {lessons.map(l => (
                         <option key={l._id} value={l._id}>{l.title}</option>
                       ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-amber-800">Độ khó (1-5):</label>
                    <input 
                        type="number" min="1" max="5"
                        className="w-full p-2 border-2 border-amber-100 rounded-lg"
                        value={qDifficulty}
                        onChange={(e) => setQDifficulty(parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-amber-800">Vùng miền (Lãnh thổ):</label>
                    <select 
                      className="w-full p-2 border-2 border-amber-100 rounded-lg focus:border-amber-500 outline-none"
                      value={qLocation}
                      onChange={(e) => setQLocation(e.target.value)}
                    >
                       <option value="">-- Không có (Mặc định) --</option>
                       <option value="lang-son">Lạng Sơn (Chi Lăng)</option>
                       <option value="quang-ninh">Quảng Ninh (Bạch Đằng)</option>
                       <option value="da-nang">Đà Nẵng (Sơn Trà)</option>
                       <option value="dien-bien">Điện Biên (Mường Thanh)</option>
                    </select>
                  </div>
               </div>

               <div>
                  <label className="block font-bold mb-1 text-amber-800">Giải thích lịch sử (Hiện sau khi trả lời):</label>
                  <textarea 
                    className="w-full p-3 border-2 border-amber-100 rounded-lg italic"
                    value={qExplanation}
                    onChange={(e) => setQExplanation(e.target.value)}
                    placeholder="Lý do/Nguồn gốc của đáp án này..."
                    required
                  />
               </div>

               <button type="submit" disabled={loading} className="btn-historical mt-4 py-3 text-xl">
                  {loading ? "Đang lưu..." : "Lưu vào Sử Sách"}
               </button>
            </form>
          </div>
        )}

        {/* TAB: MATCHING */}
        {activeTab === 'matching' && (
          <div className="historical-card bg-white p-6 rounded-xl shadow-md border-2 border-blue-200">
            <h2 className="text-2xl font-bold mb-6 text-blue-900 border-l-4 border-blue-700 pl-3">Thiết kế Màn Nối Chữ</h2>
            <form onSubmit={handleAddMatching} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-bold mb-1">Tiêu đề màn chơi:</label>
                        <input 
                            className="w-full p-2 border-2 border-blue-100 rounded-lg"
                            value={mTitle}
                            onChange={(e) => setMTitle(e.target.value)}
                            placeholder="Ví dụ: Nối Anh Hùng với Chiến Công"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">Loại nội dung:</label>
                        <select 
                            className="w-full p-2 border-2 border-blue-100 rounded-lg"
                            value={mType}
                            onChange={(e) => setMType(e.target.value)}
                        >
                            <option value="Character-Dynasty">Nhân vật - Triều đại</option>
                            <option value="Event-Year">Sự kiện - Năm tháng</option>
                            <option value="Custom">Tùy chỉnh khác</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block font-bold">Các cặp tương ứng:</label>
                    {mPairs.map((pair, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input 
                                className="flex-1 p-2 border border-gray-300 rounded"
                                placeholder="Vế trái (Vd: Lê Lợi)"
                                value={pair.left}
                                onChange={(e) => {
                                    const newPairs = [...mPairs];
                                    newPairs[idx].left = e.target.value;
                                    setMPairs(newPairs);
                                }}
                                required
                            />
                            <span className="flex items-center">↔</span>
                            <input 
                                className="flex-1 p-2 border border-gray-300 rounded"
                                placeholder="Vế phải (Vd: Lam Sơn)"
                                value={pair.right}
                                onChange={(e) => {
                                    const newPairs = [...mPairs];
                                    newPairs[idx].right = e.target.value;
                                    setMPairs(newPairs);
                                }}
                                required
                            />
                        </div>
                    ))}
                    <button type="button" onClick={addPair} className="text-sm font-bold text-blue-600 hover:underline">+ Thêm cặp mới</button>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition">
                   {loading ? "Đang xử lý..." : "Tạo Màn Nối Chữ"}
                </button>
            </form>
          </div>
        )}

        {/* TAB: LESSON */}
        {activeTab === 'lesson' && (
          <div className="historical-card bg-white p-6 rounded-xl shadow-md border-2 border-green-200">
            <h2 className="text-2xl font-bold mb-6 text-green-900 border-l-4 border-green-700 pl-3">Quản Lý Triều Đại</h2>
            <form onSubmit={handleAddLesson} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-bold mb-1">Tên Triều Đại/Thời Kỳ:</label>
                        <input 
                            className="w-full p-2 border-2 border-green-100 rounded-lg"
                            value={lTitle}
                            onChange={(e) => setLTitle(e.target.value)}
                            placeholder="Ví dụ: Nhà Hậu Lê"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">Thứ tự hiển thị:</label>
                        <input 
                            type="number"
                            className="w-full p-2 border-2 border-green-100 rounded-lg"
                            value={lOrder}
                            onChange={(e) => setLOrder(parseInt(e.target.value))}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-bold mb-1">Mô tả ngắn:</label>
                    <input 
                        className="w-full p-2 border-2 border-green-100 rounded-lg"
                        value={lDescription}
                        onChange={(e) => setLDescription(e.target.value)}
                        placeholder="Tóm tắt ngắn gọn về thời kỳ này"
                    />
                </div>

                <div>
                    <label className="block font-bold mb-1">Nội dung thư viện (Wiki - Markdown):</label>
                    <textarea 
                        className="w-full p-3 border-2 border-green-100 rounded-lg h-32"
                        value={lWikiContent}
                        onChange={(e) => setLWikiContent(e.target.value)}
                        placeholder="Thông tin chi tiết để người chơi học tập..."
                    />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-800 transition">
                   {loading ? "Đang lưu..." : "Thêm Triều Đại Mới"}
                </button>
            </form>

            <div className="mt-10">
                <h3 className="font-bold text-lg mb-4 text-green-800">Danh sách triều đại hiện có:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {lessons.map(l => (
                        <div key={l._id} className="p-2 bg-green-50 border border-green-200 rounded text-center text-sm font-bold">
                            {l.title}
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
