import React from 'react';

/**
 * Reusable Skeleton Loader with multiple variants
 * 
 * @param {string} variant - 'card' | 'list' | 'hero' | 'text'
 * @param {number} count - number of skeleton items to render
 * @param {string} className - additional CSS classes
 */
export default function SkeletonLoader({ variant = 'card', count = 1, className = '' }) {
  const items = Array.from({ length: count }, (_, i) => i);

  switch (variant) {
    case 'card':
      return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
          {items.map(i => (
            <div key={i} className="skeleton skeleton-card p-5" style={{ minHeight: 200 }}>
              <div className="skeleton skeleton-text short" style={{ height: 10, marginBottom: 16 }} />
              <div className="skeleton skeleton-text long" />
              <div className="skeleton skeleton-text medium" />
              <div className="skeleton skeleton-text short" style={{ marginTop: 24 }} />
            </div>
          ))}
        </div>
      );

    case 'list':
      return (
        <div className={`flex flex-col gap-3 ${className}`}>
          {items.map(i => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="skeleton skeleton-avatar" style={{ width: 48, height: 48, flexShrink: 0 }} />
              <div className="flex-1">
                <div className="skeleton skeleton-text medium" />
                <div className="skeleton skeleton-text short" />
              </div>
              <div className="skeleton" style={{ width: 60, height: 28, borderRadius: 8 }} />
            </div>
          ))}
        </div>
      );

    case 'hero':
      return (
        <div className={`flex flex-col items-center ${className}`}>
          <div className="skeleton" style={{ width: '100%', maxWidth: 400, height: 320, borderRadius: 16, marginBottom: 24 }} />
          <div className="skeleton skeleton-text medium" style={{ width: 200, height: 20, marginBottom: 8 }} />
          <div className="skeleton skeleton-text short" style={{ width: 120, height: 14 }} />
        </div>
      );

    case 'podium':
      return (
        <div className={`flex items-end justify-center gap-4 ${className}`}>
          {[160, 200, 140].map((h, i) => (
            <div key={i} className="flex flex-col items-center" style={{ width: 120 }}>
              <div className="skeleton skeleton-avatar" style={{ width: 64, height: 64, marginBottom: 12 }} />
              <div className="skeleton skeleton-text" style={{ width: 80, marginBottom: 4 }} />
              <div className="skeleton" style={{ width: '100%', height: h, borderRadius: '16px 16px 0 0' }} />
            </div>
          ))}
        </div>
      );

    case 'timeline':
      return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto ${className}`}>
          {items.map(i => (
            <div key={i} className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="skeleton skeleton-text short" style={{ height: 10, marginBottom: 12 }} />
              <div className="skeleton skeleton-text long" style={{ height: 18 }} />
            </div>
          ))}
        </div>
      );

    case 'text':
    default:
      return (
        <div className={className}>
          {items.map(i => (
            <div key={i}>
              <div className="skeleton skeleton-text long" />
              <div className="skeleton skeleton-text medium" />
              <div className="skeleton skeleton-text short" />
            </div>
          ))}
        </div>
      );
  }
}
