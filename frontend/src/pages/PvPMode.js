import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock3, Flag, Play, RefreshCw, Users } from "lucide-react";
import { teammatePackages } from "../data/theme4GameData";
import useTheme4ModeData from "../hooks/useTheme4ModeData";
import { logGameTelemetry, resetModeSessionId } from "../utils/gameHelpers";

const PREP_SECONDS = 30;
const ROUND_SECONDS = 60;
const MODE_ID = "understanding-teammates";

export default function PvPMode() {
  const navigate = useNavigate();
  const { data: remoteTeammatePackages, loading } = useTheme4ModeData(
    MODE_ID,
    teammatePackages
  );
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [phase, setPhase] = useState("select");
  const [timeLeft, setTimeLeft] = useState(PREP_SECONDS);
  const [keywordIndex, setKeywordIndex] = useState(0);
  const [revealedKeywords, setRevealedKeywords] = useState(false);
  const [activeRole, setActiveRole] = useState("nguoi-goi-y");
  const [finishReason, setFinishReason] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const startedAtRef = useRef(Date.now());
  const sessionActiveRef = useRef(false);
  const activePackages = Array.isArray(remoteTeammatePackages)
    ? remoteTeammatePackages
    : teammatePackages;

  const endSession = (payload) => {
    if (!sessionActiveRef.current) return;
    logGameTelemetry(MODE_ID, "session_end", payload);
    sessionActiveRef.current = false;
  };

  useEffect(() => {
    if ((phase !== "prep" && phase !== "play") || !timerRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (phase === "prep") {
            setPhase("play");
            setActiveRole("nguoi-doan");
            setRevealedKeywords(false);
            setTimerRunning(true);
            return ROUND_SECONDS;
          }
          if (selectedPackage) {
            endSession({
              solved: false,
              reason: "time_up",
              packageId: selectedPackage.id,
              shownKeywords: keywordIndex + (revealedKeywords ? 1 : 0),
              durationMs: Date.now() - startedAtRef.current,
            });
          }
          setFinishReason("time_up");
          setTimerRunning(false);
          setPhase("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [keywordIndex, phase, revealedKeywords, selectedPackage, timerRunning]);

  const startPackage = (pkg) => {
    sessionActiveRef.current = false;
    setSelectedPackage(pkg);
    setPhase("prep-ready");
    setTimeLeft(PREP_SECONDS);
    setKeywordIndex(0);
    setRevealedKeywords(false);
    setActiveRole("nguoi-goi-y");
    setFinishReason(null);
    setTimerRunning(false);
  };

  const startPrepPhase = () => {
    if (!selectedPackage) return;
    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    sessionActiveRef.current = true;
    logGameTelemetry(MODE_ID, "session_start", {
      packageId: selectedPackage.id,
      totalKeywords: selectedPackage.keywords.length,
    });
    setPhase("prep");
    setTimeLeft(PREP_SECONDS);
    setTimerRunning(true);
  };

  const resetRound = () => {
    if (selectedPackage && phase !== "select") {
      endSession({
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
    setFinishReason(null);
    setTimerRunning(false);
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
      endSession({
        solved: true,
        packageId: selectedPackage.id,
        shownKeywords: selectedPackage.keywords.length,
        durationMs: Date.now() - startedAtRef.current,
      });
      setFinishReason("completed");
      setTimerRunning(false);
      setPhase("finished");
      return;
    }
    setKeywordIndex((prev) => prev + 1);
    setRevealedKeywords(false);
  };

  const toggleTimerRunning = () => {
    setTimerRunning((prev) => !prev);
  };

  if (phase === "select") {
    if (loading && !remoteTeammatePackages) {
      return (
        <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-amber-400" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
          Đang tải gói từ khóa đồng đội...
        </div>
      );
    }

    if (!activePackages.length) {
      return (
        <div className="min-h-screen flex items-center justify-center text-center px-6 text-2xl font-bold text-amber-400" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
        Chưa có gói câu hỏi cho chế độ chơi này.
        </div>
      );
    }

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
              className="vn-safe-heading text-3xl sm:text-4xl font-black mb-3"
              style={{ background: "linear-gradient(135deg, #f0d48a, #d4a053)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Hiểu ý đồng đội
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {activePackages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => startPackage(pkg)}
                className="text-left p-6 rounded-3xl transition-all hover:-translate-y-1 active:scale-[0.99]"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 12px 30px rgba(0,0,0,0.2)" }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.9), rgba(168,85,247,0.9))" }}>
                  <Users size={24} className="text-white" />
                </div>
                <h2 className="vn-safe-heading text-xl font-black text-white mb-2">{pkg.title}</h2>
                <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  10 từ khóa tổng hợp được trộn nhiều mảng nội dung để một bạn gợi ý, một bạn đoán thật nhanh và chính xác.
                </p>
                <div className="flex flex-wrap gap-2">
                  {pkg.keywords.slice(0, 4).map((keyword) => (
                    <span
                      key={keyword}
                      className="vn-safe-chip px-3 py-1 rounded-full text-xs font-bold"
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
  const revealedHistory = selectedPackage
    ? selectedPackage.keywords.slice(0, revealedKeywords ? keywordIndex + 1 : keywordIndex)
    : [];
  const phaseTitle =
    phase === "prep" || phase === "prep-ready"
      ? "Ghi Nhớ Từ Khóa"
      : phase === "play"
        ? "Người Đoán Thực Hiện"
        : "Hoàn Thành Gói Chơi";

  return (
    <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
      <div className="max-w-4xl w-full rounded-3xl p-6 sm:p-10" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(212,160,83,0.8)" }}>
              {selectedPackage?.title}
            </p>
            <h1 className="vn-safe-heading text-2xl sm:text-3xl font-black text-white">{phaseTitle}</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto">
            <div className="px-5 py-3 rounded-2xl flex items-center gap-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Clock3 size={20} className="text-pink-300" />
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-pink-200/80">Người gợi ý</div>
                <div className="text-2xl font-black text-white tabular-nums">
                  {phase === "prep" || phase === "prep-ready" ? `${timeLeft}s / ${PREP_SECONDS}s` : `${PREP_SECONDS}s`}
                </div>
              </div>
            </div>
            <div className="px-5 py-3 rounded-2xl flex items-center gap-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Clock3 size={20} className="text-emerald-300" />
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200/80">Người đoán</div>
                <div className="text-2xl font-black text-white tabular-nums">
                  {phase === "play" ? `${timeLeft}s / ${ROUND_SECONDS}s` : `${ROUND_SECONDS}s`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 h-3 w-full rounded-full bg-slate-900/80 border border-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-violet-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${phase === "finished" ? 100 : keywordProgress}%` }}
          />
        </div>

        {(phase === "prep" || phase === "prep-ready") && (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(212,160,83,0.12)", border: "2px solid rgba(212,160,83,0.25)" }}>
              <Flag size={40} className="text-amber-400" />
            </div>
            <p className="text-lg text-white font-bold mb-3">Người gợi ý có 30 giây để nhớ trọn gói từ khóa trước khi người đoán bắt đầu.</p>
            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
              {phase === "prep"
                ? "Đồng hồ đang chạy cho người gợi ý. Hết thời gian sẽ tự chuyển sang lượt người đoán."
                : "Nhấn bắt đầu khi cả nhóm đã sẵn sàng vào giai đoạn ghi nhớ."}
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
                <div key={keyword} className="vn-safe-chip p-3 rounded-xl text-center text-sm font-bold" style={{ background: "rgba(255,255,255,0.05)", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {keyword}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={phase === "prep-ready" ? startPrepPhase : undefined}
                disabled={phase === "prep"}
                className="px-6 py-4 rounded-2xl font-black text-white inline-flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #db2777, #a855f7)" }}
              >
                <Play size={18} /> BẮT ĐẦU
              </button>
              <button
                onClick={phase === "prep" ? toggleTimerRunning : undefined}
                disabled={phase !== "prep"}
                className="px-6 py-4 rounded-2xl font-black border border-white/10 bg-white/5 text-white disabled:opacity-50"
              >
                {phase === "prep" && !timerRunning ? "TIẾP TỤC" : "DỪNG"}
              </button>
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
                {revealedKeywords ? currentKeyword : "Sẵn sàng mở từ khóa tiếp theo"}
              </span>
            </div>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
              Hiện từ khóa hiện tại, để người đoán trả lời rồi chuyển sang từ tiếp theo.
            </p>
            <div className="mb-6 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300 mb-3">Các từ đã đi qua</p>
              <div className="flex flex-wrap justify-center gap-2">
                {revealedHistory.length > 0 ? (
                  revealedHistory.map((keyword) => (
                    <span
                      key={keyword}
                      className="vn-safe-chip px-3 py-2 rounded-full text-xs font-bold"
                      style={{ background: "rgba(255,255,255,0.06)", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      {keyword}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">Chưa mở từ khóa nào.</span>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                disabled
                className="px-6 py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}
              >
                <Play size={18} /> BẮT ĐẦU
              </button>
              <button
                onClick={toggleTimerRunning}
                className="px-6 py-4 rounded-2xl font-black border border-white/10 bg-white/5 text-white disabled:opacity-50"
              >
                {timerRunning ? "DỪNG" : "TIẾP TỤC"}
              </button>
              <button
                onClick={() => {
                  setRevealedKeywords(true);
                  logGameTelemetry(MODE_ID, "hint_used", {
                    packageId: selectedPackage?.id,
                    keywordIndex,
                    action: "reveal_keyword",
                  });
                }}
                disabled={revealedKeywords || !timerRunning}
                className="px-6 py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #db2777, #a855f7)" }}
              >
                <Play size={18} /> Hiện Từ Khóa
              </button>
              <button
                onClick={nextKeyword}
                disabled={!revealedKeywords || !timerRunning}
                className="px-6 py-4 rounded-2xl font-black text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}
              >
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
            <h2 className="vn-safe-heading text-3xl font-black text-green-400 mb-3">
              {finishReason === "completed" ? "Đã Hoàn Thành Trọn Gói" : "Đã Hết Thời Gian"}
            </h2>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
              {finishReason === "completed"
                ? "Toàn bộ từ khóa trong gói đã được đi qua liên tiếp."
                : "Gói chơi này đã khép lại khi đồng hồ người đoán về 0."}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
              {selectedPackage?.keywords.map((keyword) => (
                <div key={keyword} className="vn-safe-chip p-3 rounded-xl text-center text-sm font-bold" style={{ background: "rgba(255,255,255,0.05)", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.08)" }}>
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
