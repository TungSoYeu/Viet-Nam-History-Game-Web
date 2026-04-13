import { ChevronLeft, ChevronRight, Crown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const portraitFrameStyle = {
  background:
    'radial-gradient(circle at top, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 42%, rgba(10,10,10,0.72) 100%)',
};

const portraitImageStyle = {
  objectFit: 'contain',
  objectPosition: 'center center',
  filter: 'brightness(1.12) saturate(1.08) contrast(1.03)',
};

export default function HeroCarousel({
  items = [],
  currentIndex = 0,
  currentItem = null,
  onPrev,
  onNext,
  onOpen,
  onSelect,
  paused = false,
  onHoverChange,
  autoplayMs = 5000,
}) {
  if (!currentItem || items.length === 0) return null;

  const previewIndexes = Array.from({ length: Math.min(items.length, 5) }, (_, offset) => {
    const start = Math.max(0, Math.min(items.length - Math.min(items.length, 5), currentIndex - 2));
    return start + offset;
  });

  return (
    <div
      className="relative overflow-hidden rounded-2xl xl:rounded-3xl border border-white/10 bg-white/5 p-3 xl:p-5 shadow-2xl backdrop-blur-xl"
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at top right, rgba(212,160,83,0.16), transparent 42%), linear-gradient(135deg, rgba(10,14,25,0.42), rgba(20,24,36,0.72))',
        }}
      />

      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/15 bg-amber-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.24em] text-amber-200">
          <Sparkles size={14} />
          Sân khấu danh nhân
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-sm font-black text-white">
          <span className="text-amber-300">{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className="text-white/30">/</span>
          <span className="text-white/60">{String(items.length).padStart(2, '0')}</span>
        </div>
      </div>

      <div className="relative z-10 mt-3 xl:mt-4 grid gap-3 xl:gap-4 xl:grid-cols-[minmax(0,1fr)_210px] xl:items-end">
        <div className="relative">
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-white transition hover:border-amber-300/40 hover:text-amber-200 xl:flex"
            aria-label="Danh nhân trước"
          >
            <ChevronLeft size={20} />
          </button>

          <motion.button
            key={currentItem.id}
            type="button"
            onClick={onOpen}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="group relative w-full overflow-hidden rounded-[28px] border border-amber-300/20 p-4 text-left transition hover:border-amber-300/40 hover:shadow-[0_0_48px_rgba(212,160,83,0.18)]"
            style={{
              background:
                'linear-gradient(135deg, rgba(212,160,83,0.12) 0%, rgba(12,16,28,0.92) 38%, rgba(20,24,36,0.98) 100%)',
            }}
          >
            <div className="absolute inset-3 rounded-[20px] border border-white/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%)] opacity-80" />
            <div className="relative flex flex-col gap-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.24em] text-amber-300/80">
                    {currentItem.dynasty}
                  </div>
                  <h2 className="mt-1 xl:mt-2 text-2xl font-black text-white xl:text-[2.5rem] xl:leading-tight">
                    {currentItem.name}
                  </h2>
                  <p className="mt-1 xl:mt-2 max-w-2xl text-xs xl:text-sm leading-relaxed text-white/80 max-h-[56px] overflow-y-auto custom-scrollbar xl:max-h-[72px]">
                    {currentItem.description}
                  </p>
                </div>
                <div className="hidden shrink-0 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-right xl:block">
                  <div className="text-[9px] font-black uppercase tracking-[0.24em] text-white/50">
                    Kỷ nguyên
                  </div>
                  <div className="mt-1 text-base font-black text-amber-200">{currentItem.era}</div>
                </div>
              </div>

              <div className="flex justify-center w-full mt-1 xl:mt-3">
                <div className="relative flex items-end justify-center w-full max-w-[220px] xl:max-w-[260px]">
                  <div className="absolute inset-0 rounded-[28px] bg-gradient-to-t from-black/35 to-transparent" />
                  <div className="relative w-full rounded-[24px] p-2" style={portraitFrameStyle}>
                    <img
                      src={currentItem.image}
                      alt={currentItem.name}
                      className="h-[200px] xl:h-[280px] 2xl:h-[320px] w-full object-cover rounded-[20px] transition duration-500 group-hover:scale-[1.02]"
                      style={{
                        ...portraitImageStyle,
                        boxShadow: '0 28px 72px rgba(0,0,0,0.55)',
                      }}
                    />
                  </div>
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1 xl:gap-1.5 rounded-full bg-black/45 px-2 py-1 xl:px-2.5 xl:py-1.5 text-[9px] xl:text-[10px] font-black uppercase tracking-[0.22em] text-amber-200 backdrop-blur-md">
                    <Crown size={12} className="xl:w-3.5 xl:h-3.5" />
                    {currentItem.title}
                  </div>
                </div>
              </div>
            </div>
          </motion.button>

          <button
            type="button"
            onClick={onNext}
            className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-white transition hover:border-amber-300/40 hover:text-amber-200 xl:flex"
            aria-label="Danh nhân kế tiếp"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid gap-2">
          {previewIndexes.map((mappedIndex) => {
            const hero = items[mappedIndex];
            const active = mappedIndex === currentIndex;
            return (
              <button
                key={hero.id}
                type="button"
                onClick={() => onSelect?.(mappedIndex)}
                className={`rounded-xl border px-3 py-2 xl:px-3 xl:py-2.5 text-left transition ${
                  active
                    ? 'border-amber-400 bg-[rgba(212,160,83,0.15)] shadow-[0_0_24px_rgba(212,160,83,0.14)]'
                    : 'border-[var(--page-card-border)] bg-[var(--page-card-soft)] hover:border-amber-400/50 hover:bg-[var(--nav-hover)]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[9px] xl:text-[10px] font-black uppercase tracking-[0.24em]" style={{ color: 'var(--text-muted)' }}>
                      Danh nhân
                    </div>
                    <div className="mt-0.5 xl:mt-1 text-xs xl:text-sm font-black" style={{ color: 'var(--text-primary)' }}>{hero.name}</div>
                    <div className="mt-0 text-[10px] xl:text-xs" style={{ color: 'var(--text-secondary)' }}>{hero.era}</div>
                  </div>
                  <div className="text-xs font-black" style={{ color: 'var(--viet-gold)' }}>{String(mappedIndex + 1).padStart(2, '0')}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 mt-3">
        <div className="h-1 overflow-hidden rounded-full bg-white/8">
          <div
            key={`${currentItem.id}-${paused ? 'paused' : 'running'}`}
            className="hero-carousel-progress h-full rounded-full bg-gradient-to-r from-amber-300 via-amber-500 to-rose-500"
            style={{
              animationDuration: `${autoplayMs}ms`,
              animationPlayState: paused ? 'paused' : 'running',
            }}
          />
        </div>
      </div>
    </div>
  );
}
