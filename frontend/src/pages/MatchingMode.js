import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function MatchingMode() {
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [leftItems, setLeftItems] = useState([]); // Những mục cần kéo
  const [rightItems, setRightItems] = useState([]); // Những ô chứa cố định
  const [results, setResults] = useState({}); // { rightId: leftItem }
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/matching/random')
      .then(res => {
        if (!res.ok) throw new Error("Chưa có dữ liệu cho chế độ này!");
        return res.json();
      })
      .then(data => {
        if (!data || !data.pairs) throw new Error("Dữ liệu không hợp lệ!");
        setGame(data);
        // Left items: Draggable
        setLeftItems(data.pairs.map((p, i) => ({ id: `left-${i}`, content: p.left, match: p.right })));
        // Right items: Droppable targets
        setRightItems(data.pairs.map((p, i) => ({ id: `right-${i}`, content: p.right })));
      })
      .catch(err => {
        console.error("Lỗi Mode 4:", err);
        setGame({ error: err.message });
      });
  }, []);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (game?.error) return;

    // Nếu thả vào một ô chứa (right-x)
    if (destination.droppableId.startsWith('right-')) {
      const rightId = destination.droppableId;
      const draggedItem = leftItems.find(item => item.id === draggableId);
      const targetBox = rightItems.find(item => item.id === rightId);

      // Kiểm tra đúng sai
      if (draggedItem.match === targetBox.content) {
        setResults(prev => ({ ...prev, [rightId]: draggedItem }));
        setLeftItems(prev => prev.filter(item => item.id !== draggableId));
        setScore(prev => prev + 10);
      } else {
        alert("Chưa chính xác! Hãy thử lại.");
      }
    }

    if (Object.keys(results).length + 1 === rightItems.length && leftItems.length === 1) {
        setIsFinished(true);
    }
  };

  if (!game) return <div className="p-8 text-center">Đang thiết lập sa bàn...</div>;

  if (game.error) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-800 mb-4 font-bold">{game.error}</p>
        <button onClick={() => navigate('/modes')} className="btn-historical">Quay lại Sa Bàn</button>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen max-w-5xl mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8">
        <button onClick={() => navigate('/modes')} className="btn-historical px-4">Thoát</button>
        <h2 className="text-3xl font-bold text-amber-900 uppercase">{game.title}</h2>
        <div className="text-xl font-bold text-amber-700">Điểm: {score}</div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex w-full gap-12 justify-between items-start">
          {/* Cột trái: Nguồn kéo */}
          <Droppable droppableId="source">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="flex-1 bg-amber-50 p-6 rounded-xl border-2 border-dashed border-amber-300 min-h-[400px]"
              >
                <h3 className="text-center font-bold mb-4 text-amber-800">DỮ KIỆN</h3>
                {leftItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-4 mb-3 bg-white border-2 border-amber-800 rounded-lg shadow-md font-bold text-center cursor-grab active:cursor-grabbing hover:bg-amber-100 transition"
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Cột phải: Các ô đích */}
          <div className="flex-1 flex flex-col gap-4">
            <h3 className="text-center font-bold mb-4 text-amber-800">ĐIỂM ĐẾN (Kéo vào đây)</h3>
            {rightItems.map((rightItem) => (
              <Droppable key={rightItem.id} droppableId={rightItem.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`p-6 rounded-xl border-2 transition flex items-center justify-center min-h-[80px] ${
                      results[rightItem.id] 
                        ? 'bg-green-100 border-green-600 border-solid' 
                        : snapshot.isDraggingOver 
                          ? 'bg-amber-200 border-amber-600 border-dashed scale-105' 
                          : 'bg-white border-gray-300 border-dashed'
                    }`}
                  >
                    {results[rightItem.id] ? (
                      <div className="text-center">
                        <span className="text-green-800 font-bold text-lg">{results[rightItem.id].content}</span>
                        <div className="text-xs text-green-600 mt-1">✓ {rightItem.content}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400 font-medium italic">{rightItem.content}</span>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>

      {isFinished && (
        <div className="mt-12 text-center animate-bounce">
          <h2 className="text-4xl font-bold text-green-600 mb-4">THÔNG SUỐT SỬ SÁCH!</h2>
          <button onClick={() => window.location.reload()} className="btn-historical text-xl px-12 py-4">
            Thách thức mới
          </button>
        </div>
      )}
    </div>
  );
}
