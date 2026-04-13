import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFullscreen } from '../hooks/useFullscreen';

export default function FullscreenGameWrapper({ children, onExit }) {
  const { isFullscreen, toggleFullscreen, exitFullscreen } = useFullscreen();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const [controlsHeight, setControlsHeight] = useState(64);

  useEffect(() => {
    return () => {
      exitFullscreen();
    };
  }, [exitFullscreen]);

  useEffect(() => {
    const node = controlsRef.current;
    if (!node) return undefined;

    const syncHeight = () => {
      const nextHeight = Math.ceil(node.getBoundingClientRect().height);
      if (nextHeight > 0) {
        setControlsHeight(nextHeight);
      }
    };

    syncHeight();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', syncHeight);
      return () => window.removeEventListener('resize', syncHeight);
    }

    const resizeObserver = new ResizeObserver(syncHeight);
    resizeObserver.observe(node);
    window.addEventListener('resize', syncHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', syncHeight);
    };
  }, []);

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
      className="fullscreen-game-container fullscreen-active theme-page game-screen"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--page-bg-gradient)',
        overflow: 'hidden',
      }}
    >
      <div
        ref={controlsRef}
        className="fullscreen-game-controls"
        style={{
          zIndex: 10000,
        }}
      >
        <button
          onClick={() => toggleFullscreen(containerRef.current)}
          className="fullscreen-game-control-btn fullscreen-toggle-btn"
          style={{
            padding: '10px 16px',
            borderRadius: 9999,
            background: 'var(--game-surface-strong)',
            color: 'var(--game-text)',
            border: '1px solid var(--game-border)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 14,
            backdropFilter: 'blur(10px)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
        </button>
        <button
          onClick={handleExit}
          className="fullscreen-game-control-btn fullscreen-exit-btn"
          style={{
            padding: '10px 16px',
            borderRadius: 9999,
            background: 'rgba(185, 28, 28, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.16)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 14,
            backdropFilter: 'blur(10px)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Rời trò chơi
        </button>
      </div>
      <div
        className="fullscreen-game-stage"
        style={{ '--fullscreen-controls-height': `${controlsHeight}px` }}
      >
        {children}
      </div>
    </div>
  );
}
