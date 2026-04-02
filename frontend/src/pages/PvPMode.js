import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock3, Flag, Play, RefreshCw, Users } from "lucide-react";
import { teammatePackages } from "../data/theme4GameData";
import ModeGuidePanel from "../components/game/ModeGuidePanel";
import { theme4ModeGuides } from "../data/theme4ModeGuides";
import { logGameTelemetry, resetModeSessionId } from "../utils/gameHelpers";

const PREP_SECONDS = 30;
const ROUND_SECONDS = 60;
const MODE_ID = "understanding-teammates";

export default function PvPMode() {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [phase, setPhase] = useState("select");
  const [timeLeft, setTimeLeft] = useState(PREP_SECONDS);
  const [keywordIndex, setKeywordIndex] = useState(0);
  const [revealedKeywords, setRevealedKeywords] = useState(false);
  const [activeRole, setActiveRole] = useState("nguoi-goi-y");
  const startedAtRef = useRef(Date.now());

  useEffect(() => {
    if (phase !== "prep" && phase !== "play") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (phase === "prep") {
            setPhase("play");
            setRevealedKeywords(false);
            return ROUND_SECONDS;
          }
          if (selectedPackage) {
            logGameTelemetry(MODE_ID, "session_end", {
              solved: false,
              reason: "time_up",
              packageId: selectedPackage.id,
              shownKeywords: keywordIndex + (revealedKeywords ? 1 : 0),
              durationMs: Date.now() - startedAtRef.current,
            });
          }
          setPhase("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [keywordIndex, phase, revealedKeywords, selectedPackage]);

  const startPackage = (pkg) => {
    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    logGameTelemetry(MODE_ID, "session_start", { packageId: pkg.id, totalKeywords: pkg.keywords.length });
    setSelectedPackage(pkg);
    setPhase("prep");
    setTimeLeft(PREP_SECONDS);
    setKeywordIndex(0);
    setRevealedKeywords(false);
    setActiveRole("nguoi-goi-y");
  };

  const resetRound = () => {
    if (selectedPackage && phase !== "select") {
      logGameTelemetry(MODE_ID, "session_end", {
        solved: phase === "finished",
        packageId: selectedPackage.id,
        shownKeywords: keywordIndex + (revealedKeywords ? 1 : 0),
        durationMs: Date.now() - startedAtRef.current,
      });
    }
    setSelectedPackage(null);
    setPhase("select");
    setTimeLeft(PREP_SECONDS);
    setKeywordIndex(0);
    setRevealedKeywords(false);
    setActiveRole("nguoi-goi-y");
  };

  const nextKeyword = () => {
    if (!selectedPackage) return;
    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct: true,
      questionType: "keyword_cycle",
      keywordIndex,
      packageId: selectedPackage.id,
    });
    if (keywordIndex + 1 >= selectedPackage.keywords.length) {
      logGameTelemetry(MODE_ID, "session_end", {
        solved: true,
        packageId: selectedPackage.id,
        shownKeywords: selectedPackage.keywords.length,
        durationMs: Date.now() - startedAtRef.current,
      });
      setPhase("finished");
      return;
    }
    setKeywordIndex((prev) => prev + 1);
    setRevealedKeywords(false);
  };

  if (phase === "select") {
    return (
      <div className="min-h-screen p-4 sm:p-8" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => navigate("/modes")}
              className="text-sm font-semibold flex items-center gap-2 transition-colors"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <ArrowLeft size={18} /> Quay lại
            </button>
            <div className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em]" style={{ color: "#f0d48a", background: "rgba(212,160,83,0.12)", border: "1px solid rgba(212,160,83,0.2)" }}>
              Vòng chơi đồng đội Chủ đề 4
            </div>
          </div>

          <div className="text-center mb-10">
            <h1
              className="text-3xl sm:text-4xl font-black uppercase mb-3"
              style={{ background: "linear-gradient(135deg, #f0d48a, #d4a053)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Hiểu Ý Đồng Đội
            </h1>
            <p className="max-w-3xl mx-auto text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.55)" }}>
              Cấu trúc cố định: 30 giây chuẩn bị, 60 giây thực hiện, 5 gói chơi và 10 từ khóa mỗi gói.
            </p>
          </div>

          <div className="mb-8">
            <ModeGuidePanel
              objective={theme4ModeGuides.teammate.objective}
              rules={theme4ModeGuides.teammate.rules}
              scoring={theme4ModeGuides.teammate.scoring}
              sample={theme4ModeGuides.teammate.sample}
              statusText="Sẵn sàng chọn gói"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {teammatePackages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => startPackage(pkg)}
                className="text-left p-6 rounded-3xl transition-all hover:-translate-y-1 active:scale-[0.99]"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 12px 30px rgba(0,0,0,0.2)" }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.9), rgba(168,85,247,0.9))" }}>
                  <Users size={24} className="text-white" />
                </div>
                <h2 className="text-xl font-black text-white mb-2">{pkg.title}</h2>
                <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  10 từ khóa gắn với Chủ đề 4, Bài 7 và Bài 8.
                </p>
                <div className="flex flex-wrap gap-2">
                  {pkg.keywords.slice(0, 4).map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: "rgba(255,255,255,0.06)", color: "#f0d48a", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentKeyword = selectedPackage?.keywords[keywordIndex];
  const keywordProgress = selectedPackage ? ((keywordIndex + 1) / selectedPackage.keywords.length) * 100 : 0;

  return (
    <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
      <div className="max-w-4xl w-full rounded-3xl p-6 sm:p-10" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(212,160,83,0.8)" }}>
              {selectedPackage?.title}
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{phase === "prep" ? "Chuẩn Bị" : phase === "play" ? "Thực Hiện" : "Hoàn Thành Gói Chơi"}</h1>
          </div>
          <div className="px-5 py-3 rounded-2xl flex items-center gap-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Clock3 size={20} className="text-amber-400" />
            <span className="text-3xl font-black text-white tabular-nums">{timeLeft}s</span>
          </div>
        </div>

        <div className="mb-6">
          <ModeGuidePanel
            objective={theme4ModeGuides.teammate.objective}
            rules={theme4ModeGuides.teammate.rules}
            scoring={theme4ModeGuides.teammate.scoring}
            sample={theme4ModeGuides.teammate.sample}
            statusText={phase === "prep" ? "Đang chuẩn bị" : phase === "play" ? "Đang thực hiện" : "Đã kết thúc gói"}
          />
        </div>

        <div className="mb-6 h-3 w-full rounded-full bg-slate-900/80 border border-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-violet-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${phase === "finished" ? 100 : keywordProgress}%` }}
          />
        </div>

        {phase === "prep" && (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(212,160,83,0.12)", border: "2px solid rgba(212,160,83,0.25)" }}>
              <Flag size={40} className="text-amber-400" />
            </div>
            <p className="text-lg text-white font-bold mb-3">Chuẩn bị cho đồng đội và thống nhất cách diễn đạt từ khóa.</p>
            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
              Giai đoạn thực hiện sẽ tự động bắt đầu sau 30 giây.
            </p>
            <div className="mb-6 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300 mb-3">Vai trò lượt này</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setActiveRole("nguoi-goi-y")}
                  className={`rounded-xl px-4 py-3 text-sm font-black uppercase tracking-[0.15em] ${
                    activeRole === "nguoi-goi-y" ? "bg-pink-600 text-white" : "bg-white/5 text-slate-300"
                  }`}
                >
                  Người Gợi Ý
                </button>
                <button
                  onClick={() => setActiveRole("nguoi-doan")}
                  className={`rounded-xl px-4 py-3 text-sm font-black uppercase tracking-[0.15em] ${
                    activeRole === "nguoi-doan" ? "bg-emerald-600 text-white" : "bg-white/5 text-slate-300"
                  }`}
                >
                  Người Đoán
                </button>
              </div>
              <p className="mt-3 text-sm text-slate-300">
                {activeRole === "nguoi-goi-y"
                  ? "Người gợi ý tập trung diễn đạt ngắn, tránh lộ trực tiếp từ khóa."
                  : "Người đoán ưu tiên chốt đáp án theo mốc thời gian và nhân vật chính."}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {selectedPackage?.keywords.map((keyword) => (
                <div key={keyword} className="p-3 rounded-xl text-center text-sm font-bold" style={{ background: "rgba(255,255,255,0.05)", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {keyword}
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === "play" && (
          <div className="text-center">
            <div className="text-xs font-black uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(212,160,83,0.8)" }}>
              Từ khóa {keywordIndex + 1} / {selectedPackage?.keywords.length}
            </div>
            <div className="min-h-[220px] rounded-3xl flex items-center justify-center mb-6 p-6" style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.18), rgba(99,102,241,0.18))", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="text-4xl sm:text-6xl font-black text-white tracking-wide">
                {revealedKeywords ? currentKeyword : "?"}
              </span>
            </div>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
              Dùng các nút điều khiển để hiện từ khóa, chuyển sang từ tiếp theo hoặc chơi lại gói hiện tại.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setRevealedKeywords(true);
                  logGameTelemetry(MODE_ID, "hint_used", {
                    packageId: selectedPackage?.id,
                    keywordIndex,
                    action: "reveal_keyword",
                  });
                }}
                className="px-6 py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #db2777, #a855f7)" }}
              >
                <Play size={18} /> Hiện Từ Khóa
              </button>
              <button onClick={nextKeyword} className="px-6 py-4 rounded-2xl font-black text-white" style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}>
                Từ Kế Tiếp
              </button>
              <button onClick={resetRound} className="px-6 py-4 rounded-2xl font-black" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                Chơi Lại Gói
              </button>
            </div>
          </div>
        )}

        {phase === "finished" && (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(34,197,94,0.12)", border: "2px solid rgba(34,197,94,0.25)" }}>
              <RefreshCw size={40} className="text-green-400" />
            </div>
            <h2 className="text-3xl font-black text-green-400 mb-3">Đã Hết Thời Gian</h2>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
              Bạn đã hoàn thành trọn 60 giây thực hiện của gói 10 từ khóa này.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
              {selectedPackage?.keywords.map((keyword) => (
                <div key={keyword} className="p-3 rounded-xl text-center text-sm font-bold" style={{ background: "rgba(255,255,255,0.05)", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {keyword}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => startPackage(selectedPackage)} className="px-6 py-4 rounded-2xl font-black text-white" style={{ background: "linear-gradient(135deg, #db2777, #a855f7)" }}>
                Chơi Lại Gói Này
              </button>
              <button onClick={resetRound} className="px-6 py-4 rounded-2xl font-black text-white" style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}>
                Chọn Gói Khác
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
