import React from "react";
import { BookOpenText, CircleHelp, Goal, Medal } from "lucide-react";

export default function ModeGuidePanel({
  objective,
  rules = [],
  scoring,
  sample,
  statusText,
}) {
  return (
    <div
      className="w-full rounded-2xl border p-4 md:p-5"
      style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.45)" }}>
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-amber-300">
            <Goal size={14} /> Mục tiêu
          </div>
          <p className="text-sm leading-6 text-slate-200">{objective}</p>
        </div>

        <div className="rounded-xl border p-4" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.45)" }}>
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-amber-300">
            <Medal size={14} /> Tính điểm
          </div>
          <p className="text-sm leading-6 text-slate-200">{scoring}</p>
        </div>

        <div className="rounded-xl border p-4" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.45)" }}>
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-amber-300">
            <BookOpenText size={14} /> Luật chơi
          </div>
          <ul className="space-y-1 text-sm leading-6 text-slate-200">
            {rules.map((rule) => (
              <li key={rule}>- {rule}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border p-4" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.45)" }}>
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-amber-300">
            <CircleHelp size={14} /> Ví dụ mẫu
          </div>
          <p className="text-sm leading-6 text-slate-200">{sample}</p>
          {statusText ? (
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-emerald-300">
              Trạng thái: {statusText}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

