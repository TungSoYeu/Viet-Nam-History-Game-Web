import React from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ theme = 'dark', setTheme }) {
  return (
    <div className="theme-toggle" role="group" aria-label="Chuyển giao diện sáng tối">
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`theme-toggle-button${theme === 'light' ? ' active' : ''}`}
        aria-pressed={theme === 'light'}
      >
        <Sun size={16} />
        <span>Sáng</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`theme-toggle-button${theme === 'dark' ? ' active' : ''}`}
        aria-pressed={theme === 'dark'}
      >
        <Moon size={16} />
        <span>Tối</span>
      </button>
    </div>
  );
}
