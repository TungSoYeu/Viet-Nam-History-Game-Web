import { useEffect, useCallback } from 'react';

/**
 * useKeyboardShortcuts — Desktop-only keyboard shortcut handler.
 * Disabled on touch-only devices.
 *
 * @param {Object} shortcuts - Map of key names to handler functions
 *   e.g. { 'Escape': () => close(), 'ArrowLeft': () => prev() }
 * @param {boolean} enabled - Whether shortcuts are active
 */
export default function useKeyboardShortcuts(shortcuts = {}, enabled = true) {
  const handleKeyDown = useCallback(
    (e) => {
      if (!enabled) return;

      // Don't intercept when user is typing in an input
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
    // Only enable on devices with a keyboard (desktop)
    const hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasPointer || !enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}
