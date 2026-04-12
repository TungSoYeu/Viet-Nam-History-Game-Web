import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Crown, ScrollText, X } from 'lucide-react';

export default function ParchmentModal({
  open = false,
  hero = null,
  index = 0,
  total = 0,
  onPrev,
  onNext,
  onClose,
}) {
  if (!hero) return null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 lg:p-8"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
            className="parchment-unroll relative z-10 w-full max-w-6xl overflow-hidden rounded-[36px] border border-[#d8b36a]/35 shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
            style={{
              background:
                'linear-gradient(180deg, rgba(248,233,198,0.96) 0%, rgba(228,204,160,0.95) 100%)',
              color: '#2f2417',
            }}
          >
            <div className="absolute inset-x-0 top-0 h-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),transparent)] opacity-40" />

            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-[#8b6c3f]/20 bg-[#3c2f1d]/10 text-[#3c2f1d] transition hover:bg-[#3c2f1d]/15"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>

            <div className="grid min-h-[640px] lg:grid-cols-[220px_minmax(0,1fr)]">
              <aside className="hidden border-r border-[#8b6c3f]/15 bg-[linear-gradient(180deg,rgba(92,64,28,0.08),rgba(92,64,28,0.02))] px-6 py-8 lg:block">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#5c401c]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#704f20]">
                  <ScrollText size={14} />
                  Niên biểu
                </div>

                <div className="mt-8 space-y-6">
                  <div className="relative pl-5">
                    <div className="absolute left-0 top-1 h-full w-px bg-[#8b6c3f]/25" />
                    <div className="absolute left-[-5px] top-1 h-3 w-3 rounded-full bg-[#b67b2d]" />
                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#86612e]">
                      Thời đại
                    </div>
                    <div className="mt-2 text-sm font-bold">{hero.era}</div>
                  </div>

                  <div className="relative pl-5">
                    <div className="absolute left-0 top-1 h-full w-px bg-[#8b6c3f]/25" />
                    <div className="absolute left-[-5px] top-1 h-3 w-3 rounded-full bg-[#b67b2d]" />
                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#86612e]">
                      Vương triều
                    </div>
                    <div className="mt-2 text-sm font-bold">{hero.dynasty}</div>
                  </div>

                  {hero.achievements.map((achievement, achievementIndex) => (
                    <div key={achievement} className="relative pl-5">
                      <div className="absolute left-0 top-1 h-full w-px bg-[#8b6c3f]/18" />
                      <div className="absolute left-[-4px] top-1 h-2.5 w-2.5 rounded-full bg-[#d4a053]" />
                      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#86612e]">
                        Mốc {achievementIndex + 1}
                      </div>
                      <div className="mt-2 text-sm leading-6 text-[#3f2f1d]">{achievement}</div>
                    </div>
                  ))}
                </div>
              </aside>

              <div className="relative p-6 sm:p-8 lg:p-10">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#704f20]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#704f20]">
                      <Crown size={14} />
                      Chân dung nhân vật
                    </div>

                    <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-black uppercase tracking-[0.24em] text-[#86612e]">
                          Danh nhân {index + 1}/{total}
                        </div>
                        <h2 className="mt-3 font-black leading-none text-[#24180b] text-4xl sm:text-5xl">
                          {hero.name}
                        </h2>
                        <div className="mt-3 text-lg font-semibold text-[#5a4121]">{hero.title}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={onPrev}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#8b6c3f]/20 bg-[#3c2f1d]/5 text-[#3c2f1d] transition hover:bg-[#3c2f1d]/10"
                          aria-label="Danh nhân trước"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={onNext}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#8b6c3f]/20 bg-[#3c2f1d]/5 text-[#3c2f1d] transition hover:bg-[#3c2f1d]/10"
                          aria-label="Danh nhân kế tiếp"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-3xl border border-[#8b6c3f]/12 bg-white/40 px-4 py-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#86612e]">Chiến công</div>
                        <div className="mt-2 text-3xl font-black text-[#24180b]">{hero.stats?.wins || 0}</div>
                      </div>
                      <div className="rounded-3xl border border-[#8b6c3f]/12 bg-white/40 px-4 py-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#86612e]">Dấu mốc</div>
                        <div className="mt-2 text-3xl font-black text-[#24180b]">{hero.stats?.time || 0}</div>
                      </div>
                      <div className="rounded-3xl border border-[#8b6c3f]/12 bg-white/40 px-4 py-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#86612e]">Danh nhân</div>
                        <div className="mt-2 text-3xl font-black text-[#24180b]">{hero.stats?.level || 0}</div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-[28px] border border-[#8b6c3f]/12 bg-white/35 p-5">
                      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#86612e]">Sử truyện</div>
                      <p className="mt-4 text-base leading-8 text-[#3f2f1d]">{hero.description}</p>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {hero.achievements.map((achievement) => (
                        <div
                          key={achievement}
                          className="rounded-2xl border border-[#8b6c3f]/12 bg-[#704f20]/5 px-4 py-4 text-sm font-semibold leading-6 text-[#3f2f1d]"
                        >
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="w-full rounded-[32px] border border-[#8b6c3f]/18 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.82),rgba(236,215,173,0.92))] p-4 shadow-[0_30px_50px_rgba(107,76,32,0.12)]">
                      <img
                        src={hero.image}
                        alt={hero.name}
                        className="h-[420px] w-full rounded-[28px] object-contain"
                        style={{ filter: 'drop-shadow(0 24px 44px rgba(42,25,4,0.18))' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
