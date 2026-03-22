import React, { useState, useEffect } from 'react';

export default function Questions({ question, onAnswer, feedback }) {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setSelectedOption(null);
  }, [question]);

  if (!question) return null;

  const handleSelect = (option) => {
    if (feedback) return;
    setSelectedOption(option);
    onAnswer(option);
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {question.options.map((ans, index) => {
        let bgStyle = { background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.1)' };
        let textColor = 'rgba(255,255,255,0.85)';
        let labelBg = 'rgba(255,255,255,0.08)';
        let extraClass = '';

        if (feedback) {
          const cleanAns = String(ans || "").toLowerCase().trim();
          const cleanCorrect = String(question.correctAnswer || "").toLowerCase().trim();

          if (cleanAns === cleanCorrect) {
            bgStyle = { background: 'rgba(34,197,94,0.12)', border: '1.5px solid rgba(34,197,94,0.4)' };
            textColor = '#86efac';
            labelBg = 'rgba(34,197,94,0.2)';
            extraClass = 'animate-fade-in';
          } else if (ans === selectedOption && feedback && !feedback.correct) {
            bgStyle = { background: 'rgba(239,68,68,0.12)', border: '1.5px solid rgba(239,68,68,0.4)' };
            textColor = '#fca5a5';
            labelBg = 'rgba(239,68,68,0.2)';
            extraClass = 'animate-shake';
          } else {
            bgStyle = { ...bgStyle, opacity: 0.4 };
          }
        } else if (ans === selectedOption) {
          bgStyle = { background: 'rgba(212,160,83,0.12)', border: '1.5px solid rgba(212,160,83,0.4)' };
          labelBg = 'rgba(212,160,83,0.2)';
        }

        return (
          <button 
            key={index} 
            onClick={() => handleSelect(ans)}
            disabled={!!feedback}
            className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${extraClass}`}
            style={{ ...bgStyle, color: textColor }}
          >
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: labelBg, color: textColor }}>
              {optionLabels[index]}
            </span>
            <span className="text-sm font-medium leading-snug">{ans}</span>
          </button>
        );
      })}
    </div>
  );
}