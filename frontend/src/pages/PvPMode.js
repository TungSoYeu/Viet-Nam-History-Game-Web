import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock3, Flag, Play, RefreshCw, Users } from "lucide-react";
import { teammatePackages } from "../data/theme4GameData";
import useTheme4ModeData from "../hooks/useTheme4ModeData";
import { logGameTelemetry, resetModeSessionId } from "../utils/gameHelpers";

const PREP_SECONDS = 10;
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
  const [activeRole, setActiveRole] = useState("nguoi-goi-y");
  const [finishReason, setFinishReason] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [keywordResults, setKeywordResults] = useState([]);
  const startedAtRef = useRef(Date.now());
  const sessionActiveRef = useRef(false);
  const activePackages = Array.isArray(remoteTeammatePackages)
    ? remoteTeammatePackages
    : teammatePackages;

  const isLightMode =
    typeof document !== "undefined" &&
    document.documentElement.dataset.theme === "light";

  const pageStyles = {
    page: {
      background: "var(--page-bg-gradient)",
      color: "var(--text-primary)",
    },
    shell: {
      background: "var(--page-card-bg-strong)",
      border: "1px solid var(--page-card-border)",
      boxShadow: "var(--page-card-shadow)",
    },
    panel: {
      background: "var(--page-card-soft)",
      border: "1px solid var(--page-card-border)",
    },
    selectCard: {
      background: isLightMode
        ? "linear-gradient(135deg, rgba(255, 251, 245, 0.96), rgba(246, 236, 214, 0.84))"
        : "linear-gradient(135deg, rgba(15, 23, 42, 0.82), rgba(30, 41, 59, 0.78))",
      border: "1px solid var(--page-card-border)",
      boxShadow: isLightMode
        ? "0 18px 40px rgba(130, 107, 74, 0.18)"
        : "0 20px 44px rgba(0, 0, 0, 0.26)",
    },
    chip: {
      color: "var(--page-chip-text)",
      background: "var(--page-chip-bg)",
      border: "1px solid var(--page-chip-border)",
    },
    progressTrack: {
      background: isLightMode
        ? "rgba(148, 113, 70, 0.08)"
        : "rgba(15, 23, 42, 0.8)",
      border: "1px solid var(--page-card-border)",
    },
    keywordBoard: {
      background: isLightMode
        ? "linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(99, 102, 241, 0.1))"
        : "linear-gradient(135deg, rgba(236, 72, 153, 0.18), rgba(99, 102, 241, 0.18))",
      border: "1px solid var(--page-card-border)",
    },
    keywordChip: {
      background: isLightMode ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.05)",
      color: "var(--text-primary)",
      border: "1px solid var(--page-card-border)",
    },
    subtleButton: {
      background: "var(--page-card-soft)",
      border: "1px solid var(--page-card-border)",
      color: isLightMode ? "var(--text-primary)" : "rgba(255, 255, 255, 0.82)",
    },
    iconRing: {
      background: "var(--page-chip-bg)",
      border: "2px solid var(--page-chip-border)",
    },
    textPrimary: { color: "var(--text-primary)" },
    textSecondary: { color: "var(--text-secondary)" },
    textMuted: { color: "var(--text-muted)" },
    successText: isLightMode ? "#166534" : "#4ade80",
    successSurface: isLightMode ? "rgba(34, 197, 94, 0.14)" : "rgba(34, 197, 94, 0.2)",
    successBorder: isLightMode
      ? "1px solid rgba(34, 197, 94, 0.28)"
      : "1px solid rgba(34, 197, 94, 0.38)",
    dangerText: isLightMode ? "#b91c1c" : "#f87171",
    dangerSurface: isLightMode ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.2)",
    dangerBorder: isLightMode
      ? "1px solid rgba(239, 68, 68, 0.24)"
      : "1px solid rgba(239, 68, 68, 0.38)",
  };

  const endSession = (payload) => {
    if (!sessionActiveRef.current) return;
    logGameTelemetry(MODE_ID, "session_end", payload);
    sessionActiveRef.current = false;
  };

  const getShownKeywordsCount = () => {
    if (!selectedPackage) return 0;
    if (phase !== "play" && phase !== "finished") return 0;
    return Math.min(keywordIndex + 1, selectedPackage.keywords.length);
  };

  const getKeywordResultStyle = (result) => {
    if (!result) {
      return {
        background: "var(--page-card-soft)",
        color: "var(--text-primary)",
        border: "1px solid var(--page-card-border)",
      };
    }

    return result.isCorrect
      ? {
          background: pageStyles.successSurface,
          color: pageStyles.successText,
          border: pageStyles.successBorder,
        }
      : {
          background: pageStyles.dangerSurface,
          color: pageStyles.dangerText,
          border: pageStyles.dangerBorder,
        };
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
            setTimerRunning(true);
            return ROUND_SECONDS;
          }
          if (selectedPackage) {
            endSession({
              solved: false,
              reason: "time_up",
              packageId: selectedPackage.id,
              shownKeywords: Math.min(keywordIndex + 1, selectedPackage.keywords.length),
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
  }, [keywordIndex, phase, selectedPackage, timerRunning]);

  const startPackage = (pkg) => {
    sessionActiveRef.current = false;
    setSelectedPackage(pkg);
    setPhase("prep-ready");
    setTimeLeft(PREP_SECONDS);
    setKeywordIndex(0);
    setActiveRole("nguoi-goi-y");
    setFinishReason(null);
    setTimerRunning(false);
    setKeywordResults([]);
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
        solved: phase === "finished" && finishReason === "completed",
        packageId: selectedPackage.id,
        shownKeywords: getShownKeywordsCount(),
        durationMs: Date.now() - startedAtRef.current,
      });
    }
    setSelectedPackage(null);
    setPhase("select");
    setTimeLeft(PREP_SECONDS);
    setKeywordIndex(0);
    setActiveRole("nguoi-goi-y");
    setFinishReason(null);
    setTimerRunning(false);
    setKeywordResults([]);
  };

  const submitKeywordResult = (isCorrect) => {
    if (!selectedPackage) return;

    setKeywordResults((prev) => [
      ...prev,
      {
        keywordIndex,
        keyword: selectedPackage.keywords[keywordIndex],
        isCorrect,
      },
    ]);

    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct: isCorrect,
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
  };

  const toggleTimerRunning = () => {
    setTimerRunning((prev) => !prev);
  };

  if (phase === "select") {
    if (loading && !remoteTeammatePackages) {
      return (
        <div
          className="theme-page game-screen h-screen flex flex-col overflow-hidden items-center justify-center px-6 text-center text-2xl font-bold"
          style={{ ...pageStyles.page, color: "var(--page-heading)" }}
        >
          Đang tải gói từ khóa đồng đội...
        </div>
      );
    }

    if (!activePackages.length) {
      return (
        <div
          className="theme-page game-screen h-screen flex flex-col overflow-hidden items-center justify-center text-center px-6 text-2xl font-bold"
          style={{ ...pageStyles.page, color: "var(--page-heading)" }}
        >
          Chưa có gói câu hỏi cho chế độ chơi này.
        </div>
      );
    }

    return (
      <div
        className="theme-page game-screen h-screen flex flex-col overflow-hidden p-4 sm:p-6 lg:p-8"
        style={pageStyles.page}
      >
        <div className="max-w-[1180px] w-full mx-auto flex flex-col min-h-0 custom-scrollbar overflow-y-auto pr-1 pb-4">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <button
              onClick={() => navigate("/modes")}
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
              style={pageStyles.textSecondary}
            >
              <ArrowLeft size={18} /> Quay lại
            </button>
            <div
              className="self-start rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.2em]"
              style={pageStyles.chip}
            >
              Vòng chơi đồng đội Chủ đề 4
            </div>
          </div>

          <div className="mb-10 max-w-4xl">
            <h1
              className="vn-safe-heading text-3xl sm:text-4xl lg:text-5xl font-black"
              style={{
                background: "linear-gradient(135deg, #f0d48a, #d4a053)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Hiểu ý đồng đội
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 sm:text-base" style={pageStyles.textSecondary}>
              Chọn một gói để bắt đầu. Mỗi gói gồm 10 từ khóa, chia thành lượt ghi nhớ
              và lượt đoán, phù hợp cho hoạt động tương tác trên lớp.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {activePackages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => startPackage(pkg)}
                className="group text-left rounded-[2rem] p-7 sm:p-8 transition-all hover:-translate-y-1 active:scale-[0.99]"
                style={pageStyles.selectCard}
              >
                <div className="flex h-full items-start gap-5">
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.4rem]"
                    style={{
                      background: "linear-gradient(135deg, rgba(236,72,153,0.92), rgba(168,85,247,0.92))",
                    }}
                  >
                    <Users size={28} className="text-white" />
                  </div>
                  <div className="flex min-h-[132px] flex-1 flex-col">
                    <div
                      className="mb-4 inline-flex w-max items-center rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em]"
                      style={pageStyles.chip}
                    >
                      {pkg.keywords.length} từ khóa
                    </div>
                    <h2
                      className="vn-safe-heading text-xl sm:text-2xl font-black leading-snug"
                      style={pageStyles.textPrimary}
                    >
                      {pkg.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6" style={pageStyles.textSecondary}>
                      Bắt đầu lượt ghi nhớ 10 giây rồi chuyển sang người đoán trong 60 giây.
                    </p>
                    <div
                      className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-black uppercase tracking-[0.16em]"
                      style={{ color: "var(--page-heading)" }}
                    >
                      <Play size={14} />
                      Mở gói chơi
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentKeyword = selectedPackage?.keywords[keywordIndex];
  const totalKeywords = selectedPackage?.keywords.length || 0;
  const keywordProgress = totalKeywords > 0 ? ((keywordIndex + 1) / totalKeywords) * 100 : 0;
  const correctCount = keywordResults.filter((item) => item.isCorrect).length;
  const phaseTitle =
    phase === "prep" || phase === "prep-ready"
      ? "Ghi Nhớ Từ Khóa"
      : phase === "play"
        ? "Người Đoán Thực Hiện"
        : "Hoàn Thành Gói Chơi";

  return (
    <div
      className="theme-page game-screen h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center overflow-hidden"
      style={pageStyles.page}
    >
      <div
        className="max-w-[1120px] w-full rounded-[2rem] p-6 sm:p-8 lg:p-10 flex flex-col max-h-full custom-scrollbar overflow-y-auto"
        style={pageStyles.shell}
      >
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--page-heading)" }}
            >
              {selectedPackage?.title}
            </p>
            <h1 className="vn-safe-heading mt-2 text-2xl sm:text-3xl lg:text-4xl font-black" style={pageStyles.textPrimary}>
              {phaseTitle}
            </h1>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[420px]">
            <div className="rounded-[1.25rem] px-5 py-4 flex items-center gap-3" style={pageStyles.panel}>
              <Clock3 size={22} className="text-pink-400" />
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-pink-500/80">
                  Người gợi ý
                </div>
                <div className="text-2xl font-black tabular-nums" style={pageStyles.textPrimary}>
                  {phase === "prep" || phase === "prep-ready" ? `${timeLeft}s / ${PREP_SECONDS}s` : `${PREP_SECONDS}s`}
                </div>
              </div>
            </div>
            <div className="rounded-[1.25rem] px-5 py-4 flex items-center gap-3" style={pageStyles.panel}>
              <Clock3 size={22} className="text-emerald-500" />
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-600/80">
                  Người đoán
                </div>
                <div className="text-2xl font-black tabular-nums" style={pageStyles.textPrimary}>
                  {phase === "play" ? `${timeLeft}s / ${ROUND_SECONDS}s` : `${ROUND_SECONDS}s`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-7 h-4 w-full overflow-hidden rounded-full" style={pageStyles.progressTrack}>
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-violet-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${phase === "finished" ? 100 : keywordProgress}%` }}
          />
        </div>

        {(phase === "prep" || phase === "prep-ready") && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full" style={pageStyles.iconRing}>
              <Flag size={44} className="text-amber-500" />
            </div>
            <p className="text-lg sm:text-xl font-bold mb-3" style={pageStyles.textPrimary}>
              Người gợi ý có 10 giây để nhớ trọn gói từ khóa trước khi người đoán bắt đầu.
            </p>
            <p className="mx-auto mb-8 max-w-3xl text-sm leading-7 sm:text-base" style={pageStyles.textSecondary}>
              {phase === "prep"
                ? "Đồng hồ đang chạy cho người gợi ý. Khi hết thời gian, màn hình sẽ tự chuyển sang lượt người đoán."
                : "Nhấn bắt đầu khi cả nhóm đã sẵn sàng bước vào giai đoạn ghi nhớ."}
            </p>
            <div className="mb-8 rounded-[1.5rem] p-5 sm:p-6" style={pageStyles.panel}>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.2em]" style={{ color: "var(--page-heading)" }}>
                Vai trò lượt này
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setActiveRole("nguoi-goi-y")}
                  className={`rounded-xl px-5 py-3.5 text-sm font-black uppercase tracking-[0.15em] transition-colors ${
                    activeRole === "nguoi-goi-y" ? "bg-pink-600 text-white" : ""
                  }`}
                  style={
                    activeRole === "nguoi-goi-y"
                      ? undefined
                      : {
                          background: "var(--page-card-muted)",
                          border: "1px solid var(--page-card-border)",
                          color: "var(--text-secondary)",
                        }
                  }
                >
                  Người Gợi Ý
                </button>
                <button
                  onClick={() => setActiveRole("nguoi-doan")}
                  className={`rounded-xl px-5 py-3.5 text-sm font-black uppercase tracking-[0.15em] transition-colors ${
                    activeRole === "nguoi-doan" ? "bg-emerald-600 text-white" : ""
                  }`}
                  style={
                    activeRole === "nguoi-doan"
                      ? undefined
                      : {
                          background: "var(--page-card-muted)",
                          border: "1px solid var(--page-card-border)",
                          color: "var(--text-secondary)",
                        }
                  }
                >
                  Người Đoán
                </button>
              </div>
              <p className="mt-4 text-sm leading-7" style={pageStyles.textSecondary}>
                {activeRole === "nguoi-goi-y"
                  ? "Người gợi ý nên diễn đạt ngắn gọn, tránh đọc gần giống hoặc lộ trực tiếp từ khóa."
                  : "Người đoán ưu tiên chốt nhanh đáp án theo mốc thời gian, nhân vật và sự kiện chính."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              {selectedPackage?.keywords.map((keyword, index) => (
                <div
                  key={`${keyword}-${index}`}
                  className="vn-safe-chip min-h-[84px] rounded-[1.2rem] px-4 py-4 text-center text-sm sm:text-base font-bold flex items-center justify-center"
                  style={pageStyles.keywordChip}
                >
                  {keyword}
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                onClick={phase === "prep-ready" ? startPrepPhase : undefined}
                disabled={phase === "prep"}
                className="rounded-[1.2rem] px-6 py-4 font-black text-white inline-flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #db2777, #a855f7)" }}
              >
                <Play size={18} /> BẮT ĐẦU
              </button>
              <button
                onClick={phase === "prep" ? toggleTimerRunning : undefined}
                disabled={phase !== "prep"}
                className="rounded-[1.2rem] px-6 py-4 font-black disabled:opacity-50"
                style={pageStyles.subtleButton}
              >
                {phase === "prep" && !timerRunning ? "TIẾP TỤC" : "DỪNG"}
              </button>
            </div>
          </div>
        )}

        {phase === "play" && (
          <div className="text-center">
            <div className="mb-3 text-xs font-black uppercase tracking-[0.2em]" style={{ color: "var(--page-heading)" }}>
              Từ khóa {keywordIndex + 1} / {selectedPackage?.keywords.length}
            </div>

            <div
              className="mb-6 flex min-h-[240px] sm:min-h-[280px] items-center justify-center rounded-[1.8rem] p-6 sm:p-8"
              style={pageStyles.keywordBoard}
            >
              <span
                className="max-w-[92%] break-words text-3xl sm:text-4xl lg:text-5xl font-black leading-tight"
                style={pageStyles.textPrimary}
              >
                {currentKeyword}
              </span>
            </div>

            <p className="mx-auto mb-8 max-w-3xl text-sm leading-7 sm:text-base" style={pageStyles.textSecondary}>
              Đồng đội có nhiệm vụ đưa ra gợi ý phù hợp để người còn lại đoán chính xác từ khóa đang hiển thị.
            </p>

            <div className="mb-8 rounded-[1.5rem] p-5 sm:p-6" style={pageStyles.panel}>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: "var(--page-heading)" }}>
                  Chuỗi đáp án
                </p>
                <div className="text-sm font-bold" style={pageStyles.textSecondary}>
                  Đúng {correctCount}/{keywordResults.length}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {keywordResults.length > 0 ? (
                  keywordResults.map((res) => (
                    <span
                      key={`${res.keyword}-${res.keywordIndex}`}
                      className="vn-safe-chip rounded-full px-3 py-2 text-xs font-bold"
                      style={getKeywordResultStyle(res)}
                    >
                      {res.keyword} {res.isCorrect ? "✔" : "✘"}
                    </span>
                  ))
                ) : (
                  <span className="text-sm" style={pageStyles.textMuted}>
                    Chưa có kết quả nào.
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <button
                disabled
                className="rounded-[1.2rem] px-6 py-4 font-black text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}
              >
                <Play size={18} className="inline-block mr-2" />
                BẮT ĐẦU
              </button>
              <button
                onClick={toggleTimerRunning}
                className="rounded-[1.2rem] px-6 py-4 font-black"
                style={pageStyles.subtleButton}
              >
                {timerRunning ? "DỪNG" : "TIẾP TỤC"}
              </button>
              <button
                onClick={() => submitKeywordResult(true)}
                disabled={!timerRunning}
                className="rounded-[1.2rem] px-6 py-4 font-black text-white disabled:opacity-50 active:scale-[0.98] transition-transform"
                style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}
              >
                Đoán Đúng
              </button>
              <button
                onClick={() => submitKeywordResult(false)}
                disabled={!timerRunning}
                className="rounded-[1.2rem] px-6 py-4 font-black text-white disabled:opacity-50 active:scale-[0.98] transition-transform"
                style={{ background: "linear-gradient(135deg, #ef4444, #b91c1c)" }}
              >
                Bỏ Qua
              </button>
              <button
                onClick={resetRound}
                className="rounded-[1.2rem] px-6 py-4 font-black"
                style={pageStyles.subtleButton}
              >
                Chơi Lại Gói
              </button>
            </div>
          </div>
        )}

        {phase === "finished" && (
          <div className="text-center">
            <div
              className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full"
              style={{
                background: pageStyles.successSurface,
                border: pageStyles.successBorder,
              }}
            >
              <RefreshCw size={44} style={{ color: pageStyles.successText }} />
            </div>

            <h2
              className="vn-safe-heading mb-3 text-3xl sm:text-4xl font-black"
              style={{ color: finishReason === "completed" ? pageStyles.successText : pageStyles.dangerText }}
            >
              {finishReason === "completed" ? "Đã Hoàn Thành Trọn Gói" : "Đã Hết Thời Gian"}
            </h2>

            <p className="mx-auto mb-3 max-w-3xl text-sm leading-7 sm:text-base" style={pageStyles.textSecondary}>
              {finishReason === "completed"
                ? "Toàn bộ từ khóa trong gói đã được xử lý liên tiếp."
                : "Gói chơi khép lại khi đồng hồ người đoán về 0."}
            </p>

            <div className="mb-8 text-base font-bold" style={pageStyles.textPrimary}>
              Kết quả đúng: {correctCount}/{selectedPackage?.keywords.length || 0}
            </div>

            <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              {selectedPackage?.keywords.map((keyword, index) => {
                const result = keywordResults[index];

                return (
                  <div
                    key={`${keyword}-${index}`}
                    className="vn-safe-chip min-h-[84px] rounded-[1.2rem] px-4 py-4 text-center text-sm sm:text-base font-bold flex items-center justify-center"
                    style={getKeywordResultStyle(result)}
                  >
                    {keyword} {result ? (result.isCorrect ? "✔" : "✘") : ""}
                  </div>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => startPackage(selectedPackage)}
                className="rounded-[1.2rem] px-6 py-4 font-black text-white"
                style={{ background: "linear-gradient(135deg, #db2777, #a855f7)" }}
              >
                Chơi Lại Gói Này
              </button>
              <button
                onClick={resetRound}
                className="rounded-[1.2rem] px-6 py-4 font-black text-white"
                style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}
              >
                Chọn Gói Khác
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
