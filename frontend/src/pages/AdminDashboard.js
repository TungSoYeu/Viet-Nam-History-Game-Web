import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [activeTab, setActiveTab] = useState('question');
  
  // Question Form
  const [qContent, setQContent] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState('');
  const [qLesson, setQLesson] = useState('');
  const [qExplanation, setQExplanation] = useState('');

  useEffect(() => {
    if (localStorage.getItem('role') !== 'admin') {
      navigate('/modes');
      return;
    }

    fetch('http://localhost:5000/api/lessons')
      .then(res => res.json())
      .then(data => setLessons(data));
  }, [navigate]);

  const handleAddQuestion = (e) => {
    e.preventDefault();
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
        explanation: qExplanation
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
    });
  };

  return (
    <div className="p-8 min-h-screen bg-amber-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-amber-900 mb-8 border-b-4 border-amber-900 pb-4 uppercase">
           Điều Hành Sử Quán (Admin)
        </h1>

        <div className="flex gap-4 mb-8">
           <button onClick={() => setActiveTab('question')} className={`px-6 py-2 font-bold rounded-lg ${activeTab === 'question' ? 'bg-amber-800 text-white' : 'bg-white text-amber-800 border-2 border-amber-800'}`}>
              Thêm Câu Hỏi
           </button>
           <button onClick={() => navigate('/modes')} className="px-6 py-2 font-bold bg-gray-600 text-white rounded-lg">
              Quay lại Game
           </button>
        </div>

        {activeTab === 'question' && (
          <div className="historical-card bg-white">
            <h2 className="text-2xl font-bold mb-6">Nạp Câu Hỏi Mới</h2>
            <form onSubmit={handleAddQuestion} className="flex flex-col gap-4">
               <div>
                  <label className="block font-bold mb-1">Nội dung câu hỏi:</label>
                  <textarea 
                    className="w-full p-3 border-2 border-amber-200 rounded-lg"
                    value={qContent}
                    onChange={(e) => setQContent(e.target.value)}
                    required
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  {qOptions.map((opt, idx) => (
                    <div key={idx}>
                       <label className="block font-bold mb-1">Đáp án {idx + 1}:</label>
                       <input 
                         type="text"
                         className="w-full p-2 border-2 border-amber-200 rounded-lg"
                         value={opt}
                         onChange={(e) => {
                           const newOpts = [...qOptions];
                           newOpts[idx] = e.target.value;
                           setQOptions(newOpts);
                         }}
                         required
                       />
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">Đáp án đúng (phải khớp 1 trong 4):</label>
                    <input 
                      type="text"
                      className="w-full p-2 border-2 border-green-200 rounded-lg"
                      value={qCorrect}
                      onChange={(e) => setQCorrect(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Thuộc triều đại:</label>
                    <select 
                      className="w-full p-2 border-2 border-amber-200 rounded-lg"
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
               </div>

               <div>
                  <label className="block font-bold mb-1">Giải thích lịch sử:</label>
                  <textarea 
                    className="w-full p-3 border-2 border-amber-200 rounded-lg italic"
                    value={qExplanation}
                    onChange={(e) => setQExplanation(e.target.value)}
                    required
                  />
               </div>

               <button type="submit" className="btn-historical mt-4">
                  Lưu vào Sử Sách
               </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
