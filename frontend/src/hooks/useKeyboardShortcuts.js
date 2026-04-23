import { useEffect, useCallback } from 'react';
export default function useKeyboardShortcuts(shortcuts = {}, enabled = true) {
  const handleKeyDown = useCallback(
    (e) => {
      if (!enabled) return;
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.target?.isContentEditable) return;

      const key = e.key;
      const handler = shortcuts[key];

      if (handler) {
        e.preventDefault();
        handler(e);
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    const hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasPointer || !enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}
