import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpenText,
  CircleHelp,
  Flag,
  History,
  Hourglass,
  Image as ImageIcon,
  Library,
  Medal,
  Puzzle,
  ScanSearch,
  Users,
} from "lucide-react";
import { theme4Modes } from "../data/theme4Modes";
import { getTheme4ModeGuide } from "../data/theme4ModeGuides";
import ModeGuidePanel from "../components/game/ModeGuidePanel";

const iconMap = {
  "turning-page": ImageIcon,
  "understanding-teammates": Users,
  "historical-recognition": ScanSearch,
  "connecting-history": Puzzle,
  "crossword-decoding": Library,
  "historical-flow": History,
  "lightning-fast": Hourglass,
  "picture-puzzle": Flag,
};

const checklistLabels = [
  "Đọc mục tiêu để nắm trọng tâm cần chinh phục.",
  "Xem cách tính điểm hoặc cách tổ chức hoạt động.",
  "Kiểm tra luật chơi và ví dụ mẫu trước khi bắt đầu.",
];

export default function ModeGuidePage() {
  const navigate = useNavigate();
  const { modeId } = useParams();

  const mode = theme4Modes.find((item) => item.id === modeId);
  const guide = getTheme4ModeGuide(modeId);
  const Icon = iconMap[modeId] || ImageIcon;
  const startButtonLabel =
    modeId === "historical-recognition" ? "Chọn Mode Nhỏ" : "Bắt Đầu Trò Chơi";
  const readinessText =
    modeId === "historical-recognition"
      ? "Sau bước này, bạn sẽ chọn 1 trong 2 mode nhỏ của Nhận diện lịch sử trước khi vào câu hỏi."
      : "Trang này là bước đệm trước khi vào màn chơi. Sau khi đọc xong mục tiêu, cách tính điểm, luật chơi và ví dụ mẫu, bạn có thể vào chơi ngay.";

  if (!mode || !guide) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      >
        <div
          className="max-w-xl rounded-3xl border p-8 text-center"
          style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <h1 className="text-3xl font-black text-white">Không tìm thấy hướng dẫn</h1>
          <p className="mt-3 text-sm text-slate-300">
            Chế độ chơi này chưa có cấu hình hướng dẫn để hiển thị trước khi vào chơi.
          </p>
          <button
            onClick={() => navigate("/modes")}
            className="mt-6 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-950"
          >
            Quay Lại Chọn Chế Độ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-6 text-white sm:px-6"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div
          className="overflow-hidden rounded-[32px] border shadow-2xl"
          style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="relative overflow-hidden px-5 py-6 sm:px-8 sm:py-8"
            style={{
              backgroundImage: `${mode.gradient}, url(${mode.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "overlay",
            }}
          >
            <div className="absolute inset-0 bg-slate-950/35" />
            <div className="relative z-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={() => navigate("/modes")}
                  className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-slate-900/60 px-4 py-2 text-sm font-bold text-slate-100 transition hover:bg-slate-900/80"
                >
                  <ArrowLeft size={18} />
                  Quay Lại
                </button>
                <div className="rounded-full border border-white/15 bg-slate-900/60 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                  Hướng dẫn trước khi chơi
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-slate-900/50 text-white">
                    <Icon size={30} />
                  </div>
                  <h1 className="vn-safe-heading text-3xl font-black tracking-[0.08em] sm:text-4xl">{mode.name}</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-100/90 sm:text-base">
                    {mode.longDesc}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-300">Quy mô</div>
                    <div className="mt-2 text-lg font-black text-amber-300">{mode.stats}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-300">Điểm nhấn</div>
                    <div className="mt-2 text-lg font-black text-white">{mode.rewardText || "Tùy chế độ"}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-300">Mô tả ngắn</div>
                    <div className="mt-2 text-sm font-bold leading-6 text-slate-100">{mode.desc}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-5 py-6 sm:px-8 sm:py-8 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <ModeGuidePanel
                objective={guide.objective}
                rules={guide.rules}
                scoring={guide.scoring}
                sample={guide.sample}
                statusText="Đọc hướng dẫn trước khi vào chơi"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div
                  className="rounded-3xl border p-5"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                    <BookOpenText size={14} />
                    Trước Khi Chơi
                  </div>
                  <div className="mt-4 space-y-3">
                    {checklistLabels.map((label) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm leading-6 text-slate-200"
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="rounded-3xl border p-5"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                    <CircleHelp size={14} />
                    Tóm Tắt Nhanh
                  </div>
                  <div className="mt-4 space-y-4 text-sm leading-6 text-slate-200">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                      <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                        <Medal size={13} />
                        Tính điểm
                      </div>
                      <p className="mt-2">{guide.scoring}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                      <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                        <CircleHelp size={13} />
                        Ví dụ mẫu
                      </div>
                      <p className="mt-2">{guide.sample}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div
                className="rounded-3xl border p-6"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Sẵn Sàng</div>
                <h2 className="mt-3 text-2xl font-black text-white">Bắt đầu khi đã nắm luật chơi</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {readinessText}
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={() => navigate(mode.path)}
                    className="rounded-2xl px-5 py-4 text-base font-black uppercase tracking-[0.16em] text-white"
                    style={{ background: mode.gradient }}
                  >
                    {startButtonLabel}
                  </button>
                  <button
                    onClick={() => navigate("/modes")}
                    className="rounded-2xl border border-white/10 bg-slate-900/50 px-5 py-4 text-sm font-black uppercase tracking-[0.16em] text-slate-200"
                  >
                    Chọn Chế Độ Khác
                  </button>
                </div>
              </div>

              <div
                className="rounded-3xl border p-6"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Cấu Trúc Trang</div>
                <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">Mục tiêu: người học cần chinh phục điều gì trong chế độ chơi này.</div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">Tính điểm: cách hệ thống hoặc giáo viên ghi nhận kết quả.</div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">Luật chơi: trình tự thao tác và giới hạn cần tuân thủ.</div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">Ví dụ mẫu: một tình huống minh họa để học sinh hình dung nhanh cách chơi.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
