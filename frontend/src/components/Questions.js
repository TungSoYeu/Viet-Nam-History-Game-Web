import React, { useState, useEffect } from 'react';

export default function Questions({ question, onAnswer, feedback }) {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    // Reset selection when question changes
    setSelectedOption(null);
  }, [question]);

  if (!question) return null;

  const handleSelect = (option) => {
    if (feedback) return; // Không cho chọn lại khi đang hiển thị feedback
    setSelectedOption(option);
    onAnswer(option);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {question.options.map((ans, index) => {
         let btnClass = "lesson-card !m-0 !py-4 !text-lg !font-medium transition duration-200 ";
         
         if (feedback) {
           if (ans === question.correctAnswer) {
             btnClass += "bg-green-200 border-green-500 text-green-800 ";
           } else if (ans === selectedOption && !feedback.correct) {
             btnClass += "bg-red-200 border-red-500 text-red-800 ";
           }
         } else if (ans === selectedOption) {
           btnClass += "bg-amber-100 border-amber-400 ";
         } else {
           btnClass += "hover:!bg-amber-50 ";
         }

         return (
           <button 
             key={index} 
             onClick={() => handleSelect(ans)}
             className={btnClass}
             disabled={!!feedback}
           >
             {ans}
           </button>
         );
       })}
    </div>
  );
}