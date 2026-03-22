import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import API_BASE_URL from '../config/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [activeTab, setActiveTab] = useState('question');
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null); // ID của item đang sửa (null = thêm mới)
  
  // List states
  const [listData, setListData] = useState([]);

  // Question Form State
  const [qContent, setQContent] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState('');
  const [qLesson, setQLesson] = useState('');
  const [qExplanation, setQExplanation] = useState('');
  const [qDifficulty, setQDifficulty] = useState('easy');
  const [qType, setQType] = useState('general');
  const [qLocation, setQLocation] = useState('');

  // Lesson Form State
  const [lTitle, setLTitle] = useState('');
  const [lDescription, setLDescription] = useState('');
  const [lOrder, setLOrder] = useState(1);
  const [lWikiContent, setLWikiContent] = useState('');
  const [lFlashcards, setLFlashcards] = useState([]); // Array of {front, back}

  // Matching Form State
  const [mTitle, setMTitle] = useState('');
  const [mType, setMType] = useState('Character-Dynasty');
  const [mPairs, setMPairs] = useState([{ left: '', right: '' }]);

  // Chronological State
  const [chronoTitle, setChronoTitle] = useState('');
  const [chronoEvents, setChronoEvents] = useState([
    { text: '', order: 1 }, { text: '', order: 2 }, { text: '', order: 3 }, { text: '', order: 4 }, { text: '', order: 5 }
  ]);

  // Guess Character State
  const [charName, setCharName] = useState('');
  const [charAliases, setCharAliases] = useState('');
  const [charClues, setCharClues] = useState(['', '', '', '', '']);

  // Reveal Picture State
  const [revImageUrl, setRevImageUrl] = useState('');
  const [revAnswer, setRevAnswer] = useState('');
  const [revQuestions, setRevQuestions] = useState(Array(9).fill({ q: '', a: '' }));

  useEffect(() => {
    if (localStorage.getItem('role') !== 'admin') {
      navigate('/modes');
      return;
    }
    fetchLessons();
    fetchListData();
  }, [navigate, activeTab]);

  const fetchLessons = () => {
    fetch(`${API_BASE_URL}/api/lessons`)
      .then(res => res.json())
      .then(data => setLessons(data));
  };

  const fetchListData = () => {
    let url = '';
    switch(activeTab) {
        case 'question': url = `${API_BASE_URL}/api/questions/all`; break;
        case 'matching': url = `${API_BASE_URL}/api/matching/all`; break;
        case 'chrono': url = `${API_BASE_URL}/api/chronological/all`; break; // Giả định có route này
        case 'character': url = `${API_BASE_URL}/api/guess-character/all`; break;
        case 'reveal': url = `${API_BASE_URL}/api/reveal-picture/all`; break;
        case 'lesson': url = `${API_BASE_URL}/api/lessons`; break;
        default: return;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => setListData(Array.isArray(data) ? data : []))
      .catch(err => console.error("Fetch error:", err));
  };

  const resetForms = () => {
    setEditId(null);
    setQContent(''); setQOptions(['', '', '', '']); setQCorrect(''); setQExplanation('');
    setLTitle(''); setLDescription(''); setLWikiContent(''); setLFlashcards([]);
    setMTitle(''); setMPairs([{ left: '', right: '' }]);
    setChronoTitle(''); setChronoEvents([{ text: '', order: 1 }, { text: '', order: 2 }, { text: '', order: 3 }, { text: '', order: 4 }, { text: '', order: 5 }]);
    setCharName(''); setCharAliases(''); setCharClues(['', '', '', '', '']);
    setRevImageUrl(''); setRevAnswer(''); setRevQuestions(Array(9).fill({ q: '', a: '' }));
  };

  const handleSubmit = (e, type) => {
    e.preventDefault();
    setLoading(true);
    const userId = localStorage.getItem('userId');
    
    let url = `${API_BASE_URL}/api/admin/${type}`;
    if (editId) url += `/${editId}`;

    let body = {};
    if (type === 'questions') body = { content: qContent, options: qOptions, correctAnswer: qCorrect, lessonId: qLesson || null, explanation: qExplanation, difficulty: qDifficulty, type: qType, location: qLocation || null };
    if (type === 'lessons') body = { title: lTitle, description: lDescription, order: lOrder, wiki: { content: lWikiContent }, flashcards: lFlashcards };
    if (type === 'matching') body = { title: mTitle, type: mType, pairs: mPairs };
    if (type === 'chronological') body = { title: chronoTitle, events: chronoEvents };
    if (type === 'guess-character') body = { name: charName, aliases: charAliases.split(',').map(s => s.trim()), clues: charClues };
    if (type === 'reveal-picture') body = { imageUrl: revImageUrl, answer: revAnswer, questions: revQuestions };

    fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'user-id': userId },
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(editId ? "Cập nhật thành công!" : "Thêm thành công!");
            resetForms();
            fetchListData();
        } else {
            alert("Lỗi: " + (data.message || data.error));
        }
    })
    .finally(() => setLoading(false));
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    if (activeTab === 'question') {
        setQContent(item.content); setQOptions(item.options); setQCorrect(item.correctAnswer);
        setQLesson(item.lessonId || ''); setQExplanation(item.explanation);
        setQDifficulty(item.difficulty); setQType(item.type); setQLocation(item.location || '');
    } else if (activeTab === 'lesson') {
        setLTitle(item.title); setLDescription(item.description); setLOrder(item.order); 
        setLWikiContent(item.wiki?.content || '');
        setLFlashcards(item.flashcards || []);
    } else if (activeTab === 'matching') {
        setMTitle(item.title); setMType(item.type); setMPairs(item.pairs);
    } else if (activeTab === 'chrono') {
        setChronoTitle(item.title); setChronoEvents(item.events);
    } else if (activeTab === 'character') {
        setCharName(item.name); setCharAliases(item.aliases?.join(', ') || ''); setCharClues(item.clues);
    } else if (activeTab === 'reveal') {
        setRevImageUrl(item.imageUrl); setRevAnswer(item.answer); setRevQuestions(item.questions);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bản ghi này?")) return;
    const userId = localStorage.getItem('userId');
    const modelMap = { question: 'questions', lesson: 'lessons', matching: 'matching', chrono: 'chronological', character: 'guess-character', reveal: 'reveal-picture' };
    
    fetch(`${API_BASE_URL}/api/admin/${modelMap[activeTab]}/${id}`, {
        method: 'DELETE',
        headers: { 'user-id': userId }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Đã xóa thành công!");
            fetchListData();
        }
    });
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-amber-50">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b-4 border-amber-900 pb-4">
            <h1 className="text-3xl font-black text-amber-900 uppercase">Hệ Thống Quản Trị</h1>
            <button onClick={() => navigate('/modes')} className="btn-historical">Rời Sử Quán</button>
        </header>

        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-inner border border-amber-200">
           {['question', 'matching', 'chrono', 'character', 'reveal', 'lesson'].map(tab => (
             <button key={tab} onClick={() => { setActiveTab(tab); resetForms(); }} 
               className={`px-4 py-2 font-bold rounded-lg transition capitalize ${activeTab === tab ? 'bg-amber-800 text-white shadow-md' : 'text-amber-800 hover:bg-amber-100'}`}>
               {tab === 'reveal' ? 'Tranh Ảnh' : (tab === 'chrono' ? 'Dòng Thời Gian' : (tab === 'character' ? 'Nhân Vật' : tab))}
             </button>
           ))}
        </div>

        {/* FORM SECTION */}
        <div className="historical-card bg-white p-6 rounded-xl shadow-md border-2 border-amber-200 mb-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-amber-900 border-l-4 border-amber-700 pl-3">
                    {editId ? `Đang chỉnh sửa: ${editId}` : "Thêm Bản Ghi Mới"}
                </h2>
                {editId && <button onClick={resetForms} className="text-red-600 font-bold underline">Hủy bỏ / Thêm mới</button>}
            </div>

            {activeTab === 'question' && (
                <form onSubmit={(e) => handleSubmit(e, 'questions')} className="space-y-4">
                    <textarea className="w-full p-2 border rounded" placeholder="Nội dung câu hỏi" value={qContent} onChange={e => setQContent(e.target.value)} required />
                    <div className="grid grid-cols-2 gap-4">
                        {qOptions.map((o, i) => (
                            <input key={i} className="p-2 border rounded" placeholder={`Đáp án ${i+1}`} value={o} onChange={e => {
                                const n = [...qOptions]; n[i] = e.target.value; setQOptions(n);
                            }} required />
                        ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <input className="p-2 border border-green-400 rounded" placeholder="Đáp án đúng" value={qCorrect} onChange={e => setQCorrect(e.target.value)} required />
                        <select className="p-2 border rounded" value={qType} onChange={e => setQType(e.target.value)}>
                            <option value="general">Cơ bản</option>
                            <option value="survival">Sinh tồn</option>
                            <option value="time-attack">Tốc chiến</option>
                            <option value="territory">Bờ cõi</option>
                            <option value="millionaire">Triệu phú</option>
                        </select>
                        <select className="p-2 border rounded" value={qLocation} onChange={e => setQLocation(e.target.value)}>
                            <option value="">Vùng miền</option>
                            <option value="DienBienPhu">Điện Biên Phủ</option>
                            <option value="ChiLang">Ải Chi Lăng</option>
                            <option value="ThangLong">Thăng Long</option>
                            <option value="BachDang">Bạch Đằng</option>
                        </select>
                        <input type="number" className="p-2 border rounded" value={qDifficulty} onChange={e => setQDifficulty(e.target.value)} />
                    </div>
                    <textarea className="w-full p-2 border rounded italic" placeholder="Giải thích" value={qExplanation} onChange={e => setQExplanation(e.target.value)} />
                    <button className="w-full btn-historical py-3">{editId ? "Cập Nhật Câu Hỏi" : "Lưu Câu Hỏi"}</button>
                </form>
            )}

            {activeTab === 'chrono' && (
                <form onSubmit={(e) => handleSubmit(e, 'chronological')} className="space-y-4">
                    <input className="w-full p-2 border rounded" placeholder="Tiêu đề thử thách" value={chronoTitle} onChange={e => setChronoTitle(e.target.value)} required />
                    {chronoEvents.map((ev, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <span className="font-bold">{i+1}.</span>
                            <input className="flex-1 p-2 border rounded" placeholder="Sự kiện" value={ev.text} onChange={e => {
                                const n = [...chronoEvents]; n[i].text = e.target.value; setChronoEvents(n);
                            }} required />
                        </div>
                    ))}
                    <button className="w-full btn-historical py-3">{editId ? "Cập Nhật" : "Lưu"}</button>
                </form>
            )}

            {activeTab === 'character' && (
                <form onSubmit={(e) => handleSubmit(e, 'guess-character')} className="space-y-4">
                    <input className="w-full p-2 border rounded" placeholder="Tên nhân vật" value={charName} onChange={e => setCharName(e.target.value)} required />
                    <input className="w-full p-2 border rounded" placeholder="Biệt hiệu (cách nhau bởi dấu phẩy)" value={charAliases} onChange={e => setCharAliases(e.target.value)} />
                    {charClues.map((clue, i) => (
                        <input key={i} className="w-full p-2 border rounded" placeholder={`Manh mối ${i+1}`} value={clue} onChange={e => {
                            const n = [...charClues]; n[i] = e.target.value; setCharClues(n);
                        }} required />
                    ))}
                    <button className="w-full btn-historical py-3">{editId ? "Cập Nhật" : "Lưu"}</button>
                </form>
            )}

            {activeTab === 'reveal' && (
                <form onSubmit={(e) => handleSubmit(e, 'reveal-picture')} className="space-y-4">
                    <input className="w-full p-2 border rounded" placeholder="Link ảnh (URL)" value={revImageUrl} onChange={e => setRevImageUrl(e.target.value)} required />
                    <input className="w-full p-2 border rounded font-bold" placeholder="Đáp án bức tranh" value={revAnswer} onChange={e => setRevAnswer(e.target.value)} required />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {revQuestions.map((rq, i) => (
                            <div key={i} className="p-2 border rounded bg-gray-50">
                                <input className="w-full p-1 text-sm border mb-1" placeholder="Hỏi" value={rq.q} onChange={e => {
                                    const n = [...revQuestions]; n[i] = {...n[i], q: e.target.value}; setRevQuestions(n);
                                }} required />
                                <input className="w-full p-1 text-sm border" placeholder="Đáp" value={rq.a} onChange={e => {
                                    const n = [...revQuestions]; n[i] = {...n[i], a: e.target.value}; setRevQuestions(n);
                                }} required />
                            </div>
                        ))}
                    </div>
                    <button className="w-full btn-historical py-3">{editId ? "Cập Nhật" : "Lưu"}</button>
                </form>
            )}

            {activeTab === 'matching' && (
                <form onSubmit={(e) => handleSubmit(e, 'matching')} className="space-y-4">
                    <input className="w-full p-2 border rounded" placeholder="Tiêu đề màn chơi" value={mTitle} onChange={e => setMTitle(e.target.value)} required />
                    {mPairs.map((pair, i) => (
                        <div key={i} className="flex gap-2">
                            <input className="flex-1 p-2 border rounded" placeholder="Vế trái" value={pair.left} onChange={e => {
                                const n = [...mPairs]; n[i].left = e.target.value; setMPairs(n);
                            }} required />
                            <input className="flex-1 p-2 border rounded" placeholder="Vế phải" value={pair.right} onChange={e => {
                                const n = [...mPairs]; n[i].right = e.target.value; setMPairs(n);
                            }} required />
                        </div>
                    ))}
                    <button type="button" onClick={() => setMPairs([...mPairs, { left: '', right: '' }])} className="text-amber-700 font-bold underline">+ Thêm cặp</button>
                    <button className="w-full btn-historical py-3">{editId ? "Cập Nhật" : "Lưu"}</button>
                </form>
            )}

            {activeTab === 'lesson' && (
                <form onSubmit={(e) => handleSubmit(e, 'lessons')} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input className="p-2 border rounded" placeholder="Tên triều đại" value={lTitle} onChange={e => setLTitle(e.target.value)} required />
                        <input type="number" className="p-2 border rounded" placeholder="Thứ tự" value={lOrder} onChange={e => setLOrder(e.target.value)} required />
                    </div>
                    <textarea className="w-full h-32 p-2 border rounded" placeholder="Nội dung chi tiết (Markdown)" value={lWikiContent} onChange={e => setLWikiContent(e.target.value)} />
                    
                    <div className="border-t-2 border-amber-100 pt-4">
                        <h3 className="font-bold text-amber-900 mb-2">Quản Lý Thẻ Ghi Nhớ (Flashcards)</h3>
                        <div className="space-y-3">
                            {lFlashcards.map((fc, i) => (
                                <div key={i} className="p-3 border rounded bg-amber-50 relative group">
                                    <button 
                                        type="button" 
                                        onClick={() => setLFlashcards(lFlashcards.filter((_, idx) => idx !== i))}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    ><X size={14} /></button>
                                    <textarea 
                                        className="w-full p-1 text-sm border mb-1" 
                                        placeholder="Mặt trước (Câu đố)" 
                                        value={fc.front} 
                                        onChange={e => {
                                            const n = [...lFlashcards]; n[i].front = e.target.value; setLFlashcards(n);
                                        }}
                                    />
                                    <textarea 
                                        type="text" 
                                        placeholder="Mặt sau (Đáp án + Thông tin bổ sung...)" 
                                        className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700"                                    onChange={e => {
                                            const n = [...lFlashcards]; n[i].back = e.target.value; setLFlashcards(n);
                                        }}
                                    />
                                </div>
                            ))}
                            <button 
                                type="button" 
                                onClick={() => setLFlashcards([...lFlashcards, { front: '', back: '' }])}
                                className="text-amber-700 font-bold text-sm underline"
                            >+ Thêm thẻ mới</button>
                        </div>
                    </div>

                    <button className="w-full btn-historical py-3">{editId ? "Cập Nhật" : "Lưu"}</button>
                </form>
            )}
        </div>

        {/* LIST SECTION */}
        <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-lg overflow-x-auto">
            <h3 className="text-xl font-bold mb-4 text-amber-900">Danh Sách Hiện Có ({listData.length})</h3>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-amber-100">
                        <th className="p-2 border">ID / Tên / Nội dung</th>
                        <th className="p-2 border w-24">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {listData.map(item => (
                        <tr key={item._id} className="hover:bg-amber-50">
                            <td className="p-2 border">
                                <div className="font-bold text-amber-800">{item.title || item.name || (item.content?.substring(0, 100) + '...')}</div>
                                <div className="text-xs text-gray-500">{item._id} {item.type ? `| Loai: ${item.type}` : ''}</div>
                            </td>
                            <td className="p-2 border flex gap-2">
                                <button onClick={() => handleEdit(item)} className="text-blue-600 font-bold text-xs uppercase">Sửa</button>
                                <button onClick={() => handleDelete(item._id)} className="text-red-600 font-bold text-xs uppercase">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
