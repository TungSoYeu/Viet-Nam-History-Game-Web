import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFullscreen } from '../hooks/useFullscreen';

export default function FullscreenGameWrapper({ children, onExit }) {
  const { isFullscreen, toggleFullscreen, exitFullscreen } = useFullscreen();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    return () => {
      exitFullscreen();
    };
  }, [exitFullscreen]);

  const handleExit = async () => {
    await exitFullscreen();
    if (onExit) {
      onExit();
    } else {
      navigate('/modes');
    }
  };

  return (
    <div
      ref={containerRef}
      className="fullscreen-game-container"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#0a0a0f',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 10000,
          display: 'flex',
          gap: 12,
        }}
      >
        <button
          onClick={() => toggleFullscreen(containerRef.current)}
          className="fullscreen-toggle-btn"
          style={{
            padding: '8px 16px',
            borderRadius: 9999,
            background: 'rgba(15, 23, 42, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.18)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 14,
            backdropFilter: 'blur(10px)',
          }}
        >
          {isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
        </button>
        <button
          onClick={handleExit}
          className="fullscreen-exit-btn"
          style={{
            padding: '8px 16px',
            borderRadius: 9999,
            background: 'rgba(185, 28, 28, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 14,
            backdropFilter: 'blur(10px)',
          }}
        >
          Rời trò chơi
        </button>
      </div>
      {children}
    </div>
  );
}
