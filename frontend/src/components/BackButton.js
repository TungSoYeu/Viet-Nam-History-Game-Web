import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Unified back button component for consistent navigation
 * 
 * @param {string} to - path to navigate to (default: '/modes')
 * @param {string} label - button text (default: 'Quay lại')
 * @param {string} className - additional classes
 * @param {function} onClick - custom onClick handler (overrides navigation)
 */
export default function BackButton({ to = '/modes', label = 'Quay lại', className = '', onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(to);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${className}`}
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.7)',
      }}
      aria-label={label}
    >
      <ArrowLeft size={18} />
      <span>{label}</span>
    </button>
  );
}
