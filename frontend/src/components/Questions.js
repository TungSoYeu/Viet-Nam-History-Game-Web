import React from 'react';
export default function Questions() {
  const answers = ["A. Ngô Quyền", "B. Đinh Bộ Lĩnh", "C. Lê Hoàn", "D. Lý Thái Tổ"];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {answers.map((ans, index) => (
         <button 
           key={index} 
           className="lesson-card !m-0 !py-4 !text-lg !font-medium hover:!bg-amber-100 transition duration-200"
         >
           {ans}
         </button>
       ))}
    </div>
  );
}