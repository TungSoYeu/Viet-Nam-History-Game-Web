import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock3, Play, RefreshCw, Users } from "lucide-react";
import { teammatePackages } from "../data/theme4GameData";
import useTheme4ModeData from "../hooks/useTheme4ModeData";
import { logGameTelemetry, resetModeSessionId } from "../utils/gameHelpers";

const PREP_SECONDS = 30;
const ROUND_SECONDS = 60;
const MODE_ID = "understanding-teammates";

const getShownKeywordsCountForPackage = (
  selectedPackage,
  phase,
  keywordAttempts,
  keywordQueue
) => {
  if (!selectedPackage) return 0;
  if (phase !== "play" && phase !== "finished") return 0;

  const shownIndexes = new Set(keywordAttempts.map((item) => item.keywordIndex));
  const currentIndex = keywordQueue[0];

  if (Number.isInteger(currentIndex)) {
    shownIndexes.add(currentIndex);
  }

  return Math.min(shownIndexes.size, selectedPackage.keywords.length);
};

export default function PvPMode() {
  const navigate = useNavigate();
  const { data: remoteTeammatePackages, loading } = useTheme4ModeData(
    MODE_ID,
    teammatePackages
  );
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [phase, setPhase] = useState("select");
  const [timeLeft, setTimeLeft] = useState(PREP_SECONDS);
  const [keywordQueue, setKeywordQueue] = useState([]);
  const [finishReason, setFinishReason] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [keywordStatuses, setKeywordStatuses] = useState([]);
  const [keywordAttempts, setKeywordAttempts] = useState([]);
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
    warningText: isLightMode ? "#b45309" : "#fbbf24",
    warningSurface: isLightMode ? "rgba(245, 158, 11, 0.12)" : "rgba(245, 158, 11, 0.18)",
    warningBorder: isLightMode
      ? "1px solid rgba(245, 158, 11, 0.24)"
      : "1px solid rgba(245, 158, 11, 0.34)",
    dangerText: isLightMode ? "#b91c1c" : "#f87171",
    dangerSurface: isLightMode ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.2)",
    dangerBorder: isLightMode
      ? "1px solid rgba(239, 68, 68, 0.24)"
      : "1px solid rgba(239, 68, 68, 0.38)",
  };

  const buildInitialQueue = (pkg) =>
    Array.isArray(pkg?.keywords) ? pkg.keywords.map((_, index) => index) : [];

  const endSession = (payload) => {
    if (!sessionActiveRef.current) return;
    logGameTelemetry(MODE_ID, "session_end", payload);
    sessionActiveRef.current = false;
  };

  const getKeywordResultStyle = (status) => {
    if (!status || status.status === "pending") {
      return {
        background: "var(--page-card-soft)",
        color: "var(--text-primary)",
        border: "1px solid var(--page-card-border)",
      };
    }

    if (status.status === "correct") {
      return {
        background: pageStyles.successSurface,
        color: pageStyles.successText,
        border: pageStyles.successBorder,
      };
    }

    return {
      background: pageStyles.warningSurface,
      color: pageStyles.warningText,
      border: pageStyles.warningBorder,
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
            setTimerRunning(true);
            return ROUND_SECONDS;
          }
          if (selectedPackage) {
            endSession({
              solved: false,
              reason: "time_up",
              packageId: selectedPackage.id,
              shownKeywords: getShownKeywordsCountForPackage(
                selectedPackage,
                phase,
                keywordAttempts,
                keywordQueue
              ),
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
  }, [keywordAttempts, keywordQueue, phase, selectedPackage, timerRunning]);

  const startPackage = (pkg) => {
    sessionActiveRef.current = false;
    setSelectedPackage(pkg);
    setPhase("prep-ready");
    setTimeLeft(PREP_SECONDS);
    setKeywordQueue(buildInitialQueue(pkg));
    setFinishReason(null);
    setTimerRunning(false);
    setKeywordStatuses((pkg?.keywords || []).map(() => ({ status: "pending", attempts: 0 })));
    setKeywordAttempts([]);
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
        shownKeywords: getShownKeywordsCountForPackage(
          selectedPackage,
          phase,
          keywordAttempts,
          keywordQueue
        ),
        durationMs: Date.now() - startedAtRef.current,
      });
    }
    setSelectedPackage(null);
    setPhase("select");
    setTimeLeft(PREP_SECONDS);
    setKeywordQueue([]);
    setFinishReason(null);
    setTimerRunning(false);
    setKeywordStatuses([]);
    setKeywordAttempts([]);
  };

  const submitKeywordResult = (isCorrect) => {
    if (!selectedPackage || !keywordQueue.length) return;

    const currentKeywordIndex = keywordQueue[0];
    const currentKeyword = selectedPackage.keywords[currentKeywordIndex];

    setKeywordAttempts((prev) => [
      ...prev,
      {
        keywordIndex: currentKeywordIndex,
        keyword: currentKeyword,
        isCorrect,
      },
    ]);

    setKeywordStatuses((prev) => {
      const next = [...prev];
      const previous = next[currentKeywordIndex] || { status: "pending", attempts: 0 };

      next[currentKeywordIndex] = {
        ...previous,
        status: isCorrect ? "correct" : "retry",
        attempts: (previous.attempts || 0) + 1,
        isCorrect,
      };

      return next;
    });

    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct: isCorrect,
      questionType: "keyword_cycle",
      keywordIndex: currentKeywordIndex,
      packageId: selectedPackage.id,
    });

    const nextQueue = isCorrect
      ? keywordQueue.slice(1)
      : [...keywordQueue.slice(1), currentKeywordIndex];

    setKeywordQueue(nextQueue);

    if (isCorrect && nextQueue.length === 0) {
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
  };

  const toggleTimerRunning = () => {
    setTimerRunning((prev) => !prev);
  };

  if (phase === "select") {
    if (loading && !remoteTeammatePackages) {
      return (
        <div
          className="theme-page game-screen h-screen flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar items-center justify-center px-6 text-center text-2xl font-bold"
          style={{ ...pageStyles.page, color: "var(--page-heading)" }}
        >
          Đang tải gói từ khóa đồng đội...
        </div>
      );
    }

    if (!activePackages.length) {
      return (
        <div
          className="theme-page game-screen h-screen flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar items-center justify-center text-center px-6 text-2xl font-bold"
          style={{ ...pageStyles.page, color: "var(--page-heading)" }}
        >
          Chưa có gói câu hỏi cho chế độ chơi này.
        </div>
      );
    }

    return (
        <div
          className="theme-page game-screen h-full min-h-0 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar p-4 sm:p-6 lg:p-8"
          style={pageStyles.page}
        >
        <div className="max-w-[1180px] w-full mx-auto flex flex-col min-h-0 custom-scrollbar overflow-y-auto pr-1 pb-4">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <button
              onClick={() => navigate("/modes")}
              className="game-action-btn game-action-btn--secondary self-start text-sm"
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
                      Bắt đầu lượt ghi nhớ 30 giây rồi chuyển sang người đoán trong 60 giây.
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

  const currentKeywordIndex = keywordQueue[0] ?? -1;
  const currentKeyword =
    currentKeywordIndex >= 0 ? selectedPackage?.keywords[currentKeywordIndex] : "";
  const totalKeywords = selectedPackage?.keywords.length || 0;
  const correctCount = keywordStatuses.filter((item) => item?.status === "correct").length;
  const retryCount = keywordStatuses.filter((item) => item?.status === "retry").length;
  const remainingCount = keywordQueue.length;
  const keywordProgress = totalKeywords > 0 ? (correctCount / totalKeywords) * 100 : 0;
  const completedKeywords = selectedPackage
    ? selectedPackage.keywords.filter((_, index) => keywordStatuses[index]?.status === "correct")
    : [];
  const queuedRetryKeywords = selectedPackage
    ? keywordQueue
        .slice(1)
        .filter((index) => keywordStatuses[index]?.status === "retry")
        .map((index) => selectedPackage.keywords[index])
    : [];
  const isRetryTurn =
    currentKeywordIndex >= 0 && keywordStatuses[currentKeywordIndex]?.status === "retry";
  const phaseTitle =
    phase === "prep" || phase === "prep-ready"
      ? "Ghi Nhớ Từ Khóa"
      : phase === "play"
        ? "Người Đoán Thực Hiện"
        : "Hoàn Thành Gói Chơi";

  return (
    <div
      className="theme-page game-screen h-full min-h-0 p-4 sm:p-6 lg:p-8 flex items-center justify-center overflow-y-auto overflow-x-hidden custom-scrollbar"
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
            <div className="mb-6 flex flex-col gap-2">
              <p
                className="text-xs font-black uppercase tracking-[0.2em]"
                style={{ color: "var(--page-heading)" }}
              >
                Gói từ khóa ghi nhớ
              </p>
              <p className="text-sm leading-7 sm:text-base" style={pageStyles.textSecondary}>
                Người gợi ý có {PREP_SECONDS} giây để ghi nhớ trọn bộ 10 từ khóa trước khi màn hình tự chuyển sang lượt đoán.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {selectedPackage?.keywords.map((keyword, index) => (
                <div
                  key={`${keyword}-${index}`}
                  className="vn-safe-chip min-h-[108px] rounded-[1.4rem] px-5 py-5 text-center text-lg sm:text-xl lg:text-2xl font-black leading-tight flex items-center justify-center"
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
                className="game-action-btn w-full text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #db2777, #a855f7)" }}
              >
                <Play size={18} /> BẮT ĐẦU
              </button>
              <button
                onClick={phase === "prep" ? toggleTimerRunning : undefined}
                disabled={phase !== "prep"}
                className="game-action-btn game-action-btn--secondary w-full disabled:opacity-50"
                style={pageStyles.subtleButton}
              >
                {phase === "prep" && !timerRunning ? "TIẾP TỤC" : "DỪNG"}
              </button>
            </div>
          </div>
        )}

        {phase === "play" && (
          <div className="text-center">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
              <div
                className="rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em]"
                style={pageStyles.chip}
              >
                Còn lại {remainingCount} / {totalKeywords} từ
              </div>
              {isRetryTurn && (
                <div
                  className="rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    background: pageStyles.warningSurface,
                    color: pageStyles.warningText,
                    border: pageStyles.warningBorder,
                  }}
                >
                  Đang quay lại từ đã bỏ qua
                </div>
              )}
            </div>

            <div
              className="mb-6 flex min-h-[280px] sm:min-h-[340px] lg:min-h-[400px] items-center justify-center rounded-[2rem] p-6 sm:p-10"
              style={pageStyles.keywordBoard}
            >
              <span
                className="max-w-[94%] break-words text-center text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-black leading-tight"
                style={pageStyles.textPrimary}
              >
                {currentKeyword}
              </span>
            </div>

            <p className="mx-auto mb-6 max-w-3xl text-sm leading-7 sm:text-base" style={pageStyles.textSecondary}>
              Bấm <span className="font-black">Bỏ qua</span> để đẩy từ này xuống cuối hàng chờ và quay lại sau khi xử lý các từ khác.
            </p>

            <div className="mb-8 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.5rem] p-5 sm:p-6 text-left" style={pageStyles.panel}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: "var(--page-heading)" }}>
                    Đã chốt đúng
                  </p>
                  <div className="text-sm font-bold" style={pageStyles.textSecondary}>
                    {correctCount} từ
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {completedKeywords.length > 0 ? (
                    completedKeywords.map((keyword) => (
                      <span
                        key={`done-${keyword}`}
                        className="vn-safe-chip rounded-full px-3 py-2 text-xs font-bold"
                        style={getKeywordResultStyle({ status: "correct" })}
                      >
                        {keyword} ✔
                      </span>
                    ))
                  ) : (
                    <span className="text-sm" style={pageStyles.textMuted}>
                      Chưa có từ khóa nào được chốt đúng.
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-[1.5rem] p-5 sm:p-6 text-left" style={pageStyles.panel}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: "var(--page-heading)" }}>
                    Cần quay lại
                  </p>
                  <div className="text-sm font-bold" style={pageStyles.textSecondary}>
                    {Math.max(retryCount - (isRetryTurn ? 1 : 0), 0)} từ chờ
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {queuedRetryKeywords.length > 0 ? (
                    queuedRetryKeywords.map((keyword, index) => (
                      <span
                        key={`retry-${keyword}-${index}`}
                        className="vn-safe-chip rounded-full px-3 py-2 text-xs font-bold"
                        style={getKeywordResultStyle({ status: "retry" })}
                      >
                        {keyword} ↺
                      </span>
                    ))
                  ) : (
                    <span className="text-sm" style={pageStyles.textMuted}>
                      Không có từ nào đang chờ quay lại.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <button
                onClick={toggleTimerRunning}
                className="game-action-btn game-action-btn--secondary w-full"
                style={pageStyles.subtleButton}
              >
                {timerRunning ? "DỪNG" : "TIẾP TỤC"}
              </button>
              <button
                onClick={() => submitKeywordResult(true)}
                disabled={!timerRunning}
                className="game-action-btn game-action-btn--success w-full text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}
              >
                Đoán Đúng
              </button>
              <button
                onClick={() => submitKeywordResult(false)}
                disabled={!timerRunning}
                className="game-action-btn game-action-btn--danger w-full text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #ef4444, #b91c1c)" }}
              >
                Bỏ Qua
              </button>
              <button
                onClick={resetRound}
                className="game-action-btn game-action-btn--secondary w-full"
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
                background:
                  finishReason === "completed"
                    ? pageStyles.successSurface
                    : pageStyles.warningSurface,
                border:
                  finishReason === "completed"
                    ? pageStyles.successBorder
                    : pageStyles.warningBorder,
              }}
            >
              <RefreshCw
                size={44}
                style={{
                  color:
                    finishReason === "completed"
                      ? pageStyles.successText
                      : pageStyles.warningText,
                }}
              />
            </div>

            <h2
              className="vn-safe-heading mb-3 text-3xl sm:text-4xl font-black"
              style={{
                color:
                  finishReason === "completed"
                    ? pageStyles.successText
                    : pageStyles.warningText,
              }}
            >
              {finishReason === "completed" ? "Đã Hoàn Thành Trọn Gói" : "Đã Hết Thời Gian"}
            </h2>

            <p className="mx-auto mb-3 max-w-3xl text-sm leading-7 sm:text-base" style={pageStyles.textSecondary}>
              {finishReason === "completed"
                ? "Toàn bộ từ khóa trong gói đã được đoán xong, kể cả các từ từng bị bỏ qua."
                : "Đồng hồ đã hết. Những từ chưa chốt được vẫn được giữ lại để xem lại nhanh ở bên dưới."}
            </p>

            <div className="mb-8 text-base font-bold" style={pageStyles.textPrimary}>
              Kết quả đúng: {correctCount}/{selectedPackage?.keywords.length || 0}
              {finishReason !== "completed" ? ` • Còn lại ${remainingCount} từ` : ""}
            </div>

            <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              {selectedPackage?.keywords.map((keyword, index) => {
                const result = keywordStatuses[index];

                return (
                  <div
                    key={`${keyword}-${index}`}
                    className="vn-safe-chip min-h-[84px] rounded-[1.2rem] px-4 py-4 text-center text-sm sm:text-base font-bold flex items-center justify-center"
                    style={getKeywordResultStyle(result)}
                  >
                    {keyword} {result?.status === "correct" ? "✔" : result?.status === "retry" ? "↺" : ""}
                  </div>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => startPackage(selectedPackage)}
                className="game-action-btn w-full text-white"
                style={{ background: "linear-gradient(135deg, #db2777, #a855f7)" }}
              >
                Chơi Lại Gói Này
              </button>
              <button
                onClick={resetRound}
                className="game-action-btn game-action-btn--success w-full text-white"
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
