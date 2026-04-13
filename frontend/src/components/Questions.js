import React from 'react';

export default function Questions({ question, onAnswer, feedback }) {
  if (!question) return null;
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-lg sm:text-xl font-bold mb-6 text-center leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {question.content || question.question}
      </h3>
      <div className="grid gap-3">
        {(question.options || []).map((option, index) => {
          let btnClass = 'answer-btn';
          if (feedback) {
            if (option === question.correctAnswer) {
              btnClass += ' !border-green-400 !bg-green-500/20';
            } else if (option === feedback.selected && !feedback.correct) {
              btnClass += ' !border-red-400 !bg-red-500/20';
            }
          }
          return (
            <button
              key={index}
              onClick={() => !feedback && onAnswer(option)}
              disabled={!!feedback}
              className={`${btnClass} text-left font-medium transition-all disabled:cursor-default`}
            >
              <span className="text-amber-400 font-bold mr-3">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>
      {feedback && (
        <div className={`mt-4 p-4 rounded-xl text-sm ${feedback.correct ? 'bg-green-500/10 border border-green-400/30 text-green-200' : 'bg-red-500/10 border border-red-400/30 text-red-200'}`}>
          {feedback.correct ? '✓ Chính xác!' : `✗ Sai! Đáp án đúng: ${question.correctAnswer}`}
          {question.explanation && (
            <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{question.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
