import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Film,
  ListOrdered,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { picturePuzzleItems } from "../data/theme4GameData";
import useTheme4ModeData from "../hooks/useTheme4ModeData";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import Confetti from "../components/animations/Confetti";
import {
  logGameTelemetry,
  resetModeSessionId,
  saveXp,
  shuffleArray,
} from "../utils/gameHelpers";

const MODE_ID = "picture-puzzle";

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toEmbedUrl(videoUrl) {
  try {
    const url = new URL(videoUrl);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace(/\//g, "");
      return id ? `https://www.youtube.com/embed/${id}?rel=0` : "";
    }
    const videoId = url.searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : "";
  } catch {
    return "";
  }
}

function normalizeSequenceRounds(data) {
  const source = Array.isArray(data) ? data : [];
  return source
    .map((item, itemIndex) => {
      const baseId = String(item?.id || `picture-sequence-${itemIndex + 1}`);
      const frames = (Array.isArray(item?.frames) ? item.frames : [])
        .map((frame, frameIndex) => ({
          id: frame?._adminId || `${baseId}-frame-${frameIndex + 1}`,
          imageUrl: String(frame?.imageUrl || "").trim(),
          order: toPositiveInt(frame?.order, frameIndex + 1),
          caption: String(frame?.caption || "").trim(),
        }))
        .filter((frame) => frame.imageUrl)
        .sort((a, b) => a.order - b.order)
        .map((frame, frameIndex) => ({ ...frame, order: frameIndex + 1 }));
      const videoUrl = String(item?.videoUrl || "").trim();
      if (!videoUrl || frames.length < 2) return null;
      return {
        id: baseId,
        title: String(item?.title || `Lượt ${itemIndex + 1}`),
        instruction: String(
          item?.instruction ||
            "Xem video rồi sắp xếp các khung hình theo đúng diễn biến lịch sử."
        ),
        videoUrl,
        embedUrl: toEmbedUrl(videoUrl),
        timeLimitSeconds: toPositiveInt(
          item?.timeLimitSeconds,
          Math.max(75, frames.length * 12)
        ),
        xpReward: toPositiveInt(item?.xpReward, 20),
        frames,
      };
    })
    .filter(Boolean);
}

export default function PictureSequenceMode() {
  const navigate = useNavigate();
  const { data: remotePicturePuzzleItems, loading } = useTheme4ModeData(
    MODE_ID,
    picturePuzzleItems
  );
  const activeRounds = useMemo(() => {
    const remoteRounds = normalizeSequenceRounds(remotePicturePuzzleItems);
    return remoteRounds.length > 0
      ? remoteRounds
      : normalizeSequenceRounds(picturePuzzleItems);
  }, [remotePicturePuzzleItems]);

  const [roundIndex, setRoundIndex] = useState(0);
  const [shuffledFrames, setShuffledFrames] = useState([]);
  const [selectedFrameIds, setSelectedFrameIds] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [incorrectSlots, setIncorrectSlots] = useState([]);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpSaved, setXpSaved] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [roundStarted, setRoundStarted] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [roundSolved, setRoundSolved] = useState(false);
  const startedAtRef = useRef(Date.now());
  const isLightMode =
    typeof document !== "undefined" &&
    document.documentElement.dataset.theme === "light";

  const totalRounds = activeRounds.length;
  const currentRound = activeRounds[roundIndex] || null;
  const frameMap = useMemo(
    () => new Map((currentRound?.frames || []).map((frame) => [frame.id, frame])),
    [currentRound]
  );
  const selectedFrames = useMemo(
    () => selectedFrameIds.map((frameId) => frameMap.get(frameId)).filter(Boolean),
    [frameMap, selectedFrameIds]
  );
  const availableFrames = useMemo(() => {
    const selectedSet = new Set(selectedFrameIds);
    return shuffledFrames.filter((frame) => !selectedSet.has(frame.id));
  }, [selectedFrameIds, shuffledFrames]);
  const goldTextColor = isLightMode ? "#8b5e2a" : "#f0d48a";
  const rewardTextColor = isLightMode ? "#0f766e" : "#6ee7b7";
  const successTextColor = isLightMode ? "#166534" : "#6ee7b7";
  const warningTextColor = isLightMode ? "#9a6700" : "#fde68a";
  const dangerTextColor = isLightMode ? "#b91c1c" : "#fecaca";
  const infoTextColor = isLightMode ? "#075985" : "#bae6fd";
  const accentChipStyle = {
    background: "var(--page-chip-bg)",
    border: "1px solid var(--page-chip-border)",
    color: "var(--page-chip-text)",
  };
  const surfaceStyle = {
    background: "var(--game-surface)",
    borderColor: "var(--game-border)",
  };
  const surfaceStrongStyle = {
    background: "var(--game-surface-strong)",
    borderColor: "var(--game-border)",
  };
  const feedbackToneStyles = {
    success: {
      background: isLightMode ? "rgba(34, 197, 94, 0.12)" : "rgba(16, 185, 129, 0.16)",
      border: `1px solid ${isLightMode ? "rgba(34, 197, 94, 0.24)" : "rgba(16, 185, 129, 0.28)"}`,
      color: successTextColor,
    },
    warning: {
      background: isLightMode ? "rgba(245, 158, 11, 0.12)" : "rgba(245, 158, 11, 0.14)",
      border: `1px solid ${isLightMode ? "rgba(180, 83, 9, 0.22)" : "rgba(245, 158, 11, 0.26)"}`,
      color: warningTextColor,
    },
    error: {
      background: isLightMode ? "rgba(239, 68, 68, 0.1)" : "rgba(244, 63, 94, 0.14)",
      border: `1px solid ${isLightMode ? "rgba(239, 68, 68, 0.22)" : "rgba(244, 63, 94, 0.26)"}`,
      color: dangerTextColor,
    },
    neutral: {
      background: "var(--game-surface)",
      border: "1px dashed var(--game-border)",
      color: "var(--game-text-secondary)",
    },
  };
  const successPanelStyle = {
    background: isLightMode ? "rgba(34, 197, 94, 0.12)" : "rgba(16, 185, 129, 0.14)",
    borderColor: isLightMode ? "rgba(34, 197, 94, 0.24)" : "rgba(16, 185, 129, 0.26)",
  };
  const errorPanelStyle = {
    background: isLightMode ? "rgba(239, 68, 68, 0.1)" : "rgba(244, 63, 94, 0.12)",
    borderColor: isLightMode ? "rgba(239, 68, 68, 0.22)" : "rgba(244, 63, 94, 0.24)",
  };

  const prepareRound = useCallback((nextRoundIndex, nextRounds = activeRounds) => {
    const nextRound = nextRounds[nextRoundIndex];
    if (!nextRound) return;
    setRoundIndex(nextRoundIndex);
    setShuffledFrames(shuffleArray(nextRound.frames));
    setSelectedFrameIds([]);
    setFeedback(null);
    setIncorrectSlots([]);
    setFinished(false);
    setTimeLeft(nextRound.timeLimitSeconds);
    setRoundStarted(false);
    setTimerRunning(false);
    setRoundSolved(false);
    setSessionReady(true);
  }, [activeRounds]);

  const resetSession = useCallback((replay = false) => {
    if (activeRounds.length === 0) return;
    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    logGameTelemetry(MODE_ID, "session_start", {
      totalRounds: activeRounds.length,
      replay,
    });
    setScore(0);
    setCorrectCount(0);
    setXpSaved(false);
    prepareRound(0, activeRounds);
  }, [activeRounds, prepareRound]);

  useEffect(() => {
    if (loading || totalRounds === 0) return;
    resetSession(false);
  }, [loading, resetSession, totalRounds]);

  useEffect(() => {
    if (!roundStarted || !timerRunning || finished || timeLeft <= 0) return undefined;
    const timer = window.setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [finished, roundStarted, timeLeft, timerRunning]);

  useEffect(() => {
    if (finished && !xpSaved) {
      logGameTelemetry(MODE_ID, "session_end", {
        solved: true,
        score,
        correctCount,
        totalRounds,
        durationMs: Date.now() - startedAtRef.current,
      });
      saveXp(score);
      setXpSaved(true);
    }
  }, [correctCount, finished, score, totalRounds, xpSaved]);

  const checkArrangement = useCallback((timeUp = false) => {
    if (!currentRound) return;
    setRoundStarted(false);
    setTimerRunning(false);
    const correctIds = currentRound.frames.map((frame) => frame.id);
    const wrongPositions = correctIds.reduce((indexes, frameId, index) => {
      if (selectedFrameIds[index] !== frameId) indexes.push(index);
      return indexes;
    }, []);
    if (wrongPositions.length > 0) {
      const missingCount = Math.max(correctIds.length - selectedFrameIds.length, 0);
      setIncorrectSlots(wrongPositions);
      setFeedback({
        type: timeUp ? "error" : "warning",
        text: timeUp
          ? `Hết thời gian. Còn ${wrongPositions.length} vị trí chưa khớp${missingCount > 0 ? ` và thiếu ${missingCount} khung hình.` : "."}`
          : `Chưa đúng. Có ${wrongPositions.length} vị trí đang sai thứ tự${missingCount > 0 ? ` và thiếu ${missingCount} khung hình.` : "."}`,
      });
      logGameTelemetry(MODE_ID, "answer_submitted", {
        correct: false,
        roundIndex: roundIndex + 1,
        reason: timeUp ? "time_up_wrong_order" : "wrong_order",
        wrongPositions: wrongPositions.length,
        missingCount,
        title: currentRound.title,
      });
      return;
    }
    const nextScore = score + currentRound.xpReward;
    setIncorrectSlots([]);
    setFeedback({
      type: "success",
      text:
        roundIndex === totalRounds - 1
          ? `Bạn đã hoàn thành đúng cả ${totalRounds} video của Mảnh vỡ lịch sử.`
          : `Đúng rồi. Bạn đã xếp chuẩn ${currentRound.frames.length} khung hình của lượt ${roundIndex + 1}/${totalRounds}.`,
    });
    setScore(nextScore);
    setCorrectCount((prev) => prev + 1);
    setRoundSolved(true);
    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct: true,
      roundIndex: roundIndex + 1,
      reason: timeUp ? "time_up_full_correct" : "full_correct",
      title: currentRound.title,
      scoreAfter: nextScore,
    });
    if (roundIndex === totalRounds - 1) setFinished(true);
  }, [currentRound, roundIndex, score, selectedFrameIds, totalRounds]);

  useEffect(() => {
    if (!roundStarted || !timerRunning || finished || timeLeft > 0) return;
    checkArrangement(true);
  }, [checkArrangement, finished, roundStarted, timeLeft, timerRunning]);

  const startRound = () => {
    if (!currentRound || finished || roundSolved) return;
    setFeedback(null);
    setIncorrectSlots([]);
    setTimeLeft(currentRound.timeLimitSeconds);
    setRoundStarted(true);
    setTimerRunning(true);
    logGameTelemetry(MODE_ID, "question_started", {
      roundIndex: roundIndex + 1,
      title: currentRound.title,
      durationSeconds: currentRound.timeLimitSeconds,
      frameCount: currentRound.frames.length,
      replay: Boolean(feedback),
    });
  };

  const toggleTimerRunning = () => {
    if (!roundStarted || roundSolved || finished) return;
    setTimerRunning((prev) => !prev);
  };

  const handleExit = async () => {
    logGameTelemetry(MODE_ID, "session_end", {
      solved: finished,
      score,
      correctCount,
      roundIndex,
      totalRounds,
      durationMs: Date.now() - startedAtRef.current,
    });
    if (!finished && score > 0 && !xpSaved) await saveXp(score);
    navigate("/modes");
  };

  const restartMode = () => {
    logGameTelemetry(MODE_ID, "session_end", {
      solved: false,
      score,
      correctCount,
      roundIndex,
      totalRounds,
      reason: "restart",
      durationMs: Date.now() - startedAtRef.current,
    });
    resetSession(true);
  };

  const moveNextRound = () => {
    if (!roundSolved || finished) return;
    prepareRound(roundIndex + 1);
  };

  const clearArrangement = () => {
    if (!timerRunning || roundSolved || finished) return;
    setSelectedFrameIds([]);
    setFeedback(null);
    setIncorrectSlots([]);
  };

  const placeFrame = (frameId) => {
    if (!timerRunning || roundSolved || finished || !currentRound) return;
    setSelectedFrameIds((prev) => {
      if (prev.includes(frameId) || prev.length >= currentRound.frames.length) return prev;
      return [...prev, frameId];
    });
  };

  const removeFrameAt = (index) => {
    if (!timerRunning || roundSolved || finished) return;
    setSelectedFrameIds((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const moveFrame = (index, direction) => {
    if (!timerRunning || roundSolved || finished) return;
    setSelectedFrameIds((prev) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  useKeyboardShortcuts(
    {
      Escape: handleExit,
      Enter: () => roundStarted && timerRunning && !roundSolved && checkArrangement(false),
      " ": () => {
        if (!roundStarted && !finished) return startRound();
        if (roundStarted && !roundSolved && !finished) toggleTimerRunning();
      },
    },
    !finished
  );

  if (loading || (totalRounds > 0 && !sessionReady)) {
    return (
      <div
        className="theme-page game-screen flex h-full min-h-0 items-center justify-center overflow-y-auto overflow-x-hidden custom-scrollbar px-6 text-center text-2xl font-black"
        style={{ color: goldTextColor }}
      >
        Đang chuẩn bị phần mảnh vỡ lịch sử...
      </div>
    );
  }
  if (!currentRound || totalRounds === 0) {
    return (
      <div
        className="theme-page game-screen flex h-full min-h-0 items-center justify-center overflow-y-auto overflow-x-hidden custom-scrollbar px-6 text-center text-2xl font-black"
        style={{ color: goldTextColor }}
      >
        Chưa có bộ dữ liệu hợp lệ cho chế độ chơi này.
      </div>
    );
  }

  return (
    <div className="theme-page game-screen flex h-full min-h-0 flex-col overflow-y-auto px-3 py-4 sm:px-4 xl:overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div className="mx-auto flex min-h-full w-full max-w-none flex-1 flex-col gap-4 xl:min-h-0">
        <div className="game-panel-strong grid gap-3 rounded-[28px] p-3 shadow-2xl md:grid-cols-[1fr_auto_1fr] md:items-center sm:p-4">
          <div className="flex justify-center md:justify-start">
            <button
              onClick={handleExit}
              className="game-action-btn game-action-btn--secondary text-sm"
            >
              <ArrowLeft size={18} />
              Thoát Với {score} XP
            </button>
          </div>
          <div className="text-center">
            <div className="theme-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.24em]">
              <ListOrdered size={16} />
              Mảnh Vỡ Lịch Sử
            </div>
            <h1
              className="vn-safe-heading mt-3 text-2xl font-black tracking-[0.08em] sm:text-3xl"
              style={{ color: "var(--game-text)" }}
            >
              Lượt {roundIndex + 1}/{totalRounds}
            </h1>
            <p className="game-text-secondary mt-2 text-sm">{currentRound.title}</p>
          </div>
          <div className="flex items-center justify-center gap-3 md:justify-end">
            <div className="game-panel rounded-2xl px-4 py-3 text-center">
              <div className="game-text-muted text-[11px] uppercase tracking-[0.2em]">Hoàn Thành</div>
              <div className="text-lg font-black" style={{ color: "var(--game-text)" }}>
                {correctCount}/{totalRounds}
              </div>
            </div>
            <div className="rounded-2xl px-4 py-3 text-center" style={accentChipStyle}>
              <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: goldTextColor }}>
                Điểm
              </div>
              <div className="text-lg font-black" style={{ color: goldTextColor }}>
                {score}
              </div>
            </div>
          </div>
        </div>

        <div className="grid flex-1 min-h-0 items-stretch gap-4 xl:grid-cols-[minmax(360px,0.88fr)_minmax(520px,1.12fr)_minmax(300px,0.72fr)]">
          <div className="game-panel-strong custom-scrollbar flex min-h-[420px] flex-col overflow-y-auto rounded-[28px] p-4 pr-3 shadow-xl sm:p-5 sm:pr-4 xl:min-h-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="game-text-muted text-xs font-black uppercase tracking-[0.24em]">Video Tư Liệu</div>
                <h2 className="mt-2 text-2xl font-black" style={{ color: "var(--game-text)" }}>
                  {currentRound.title}
                </h2>
                <p className="game-text-secondary mt-3 text-sm leading-6">{currentRound.instruction}</p>
              </div>
              <a
                href={currentRound.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="game-action-btn game-action-btn--secondary game-action-btn--compact"
              >
                <ExternalLink size={14} />
                Mở Video
              </a>
            </div>
            <div className="mt-4 flex-shrink-0 overflow-hidden rounded-[24px] border" style={surfaceStyle}>
              {currentRound.embedUrl ? (
                <div className="aspect-video w-full"><iframe src={currentRound.embedUrl} title={currentRound.title} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
              ) : (
                <div className="game-text-faint flex aspect-video items-center justify-center px-6 text-center text-sm">
                  Không nhúng được video. Hãy dùng nút Mở Video để xem bản gốc.
                </div>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl px-4 py-4 text-center" style={accentChipStyle}>
                <div className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: goldTextColor }}>
                  Đồng Hồ
                </div>
                <div className="mt-2 flex items-center justify-center gap-2 text-2xl font-black" style={{ color: goldTextColor }}>
                  <Clock3 size={20} />
                  {roundStarted ? `${timeLeft}s` : `${currentRound.timeLimitSeconds}s`}
                </div>
              </div>
              <div className="game-panel rounded-2xl px-4 py-4 text-center">
                <div className="game-text-muted text-[11px] uppercase tracking-[0.2em]">Khung Hình</div>
                <div className="mt-2 text-2xl font-black" style={{ color: "var(--game-text)" }}>
                  {selectedFrameIds.length}/{currentRound.frames.length}
                </div>
              </div>
              <div className="game-panel rounded-2xl px-4 py-4 text-center">
                <div className="game-text-muted text-[11px] uppercase tracking-[0.2em]">Thưởng</div>
                <div className="mt-2 text-2xl font-black" style={{ color: rewardTextColor }}>
                  {currentRound.xpReward} XP
                </div>
              </div>
              <button onClick={restartMode} className="game-action-btn game-action-btn--secondary w-full">
                <RotateCcw size={16} />
                Chơi Lại
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                onClick={startRound}
                disabled={timerRunning || finished || roundSolved}
                className="game-action-btn game-action-btn--primary w-full"
              >
                <PlayCircle size={18} />
                {feedback && !roundSolved ? "Bắt Đầu Lại" : "Bắt Đầu Sắp Xếp"}
              </button>
              <button
                onClick={toggleTimerRunning}
                disabled={!roundStarted || roundSolved || finished}
                className="game-action-btn game-action-btn--secondary w-full"
              >
                <PauseCircle size={18} />
                {roundStarted && !timerRunning ? "Tiếp Tục" : "Dừng"}
              </button>
              <button
                onClick={() => checkArrangement(false)}
                disabled={!roundStarted || !timerRunning || roundSolved}
                className="game-action-btn game-action-btn--success w-full"
              >
                <CheckCircle2 size={18} />
                Kiểm Tra Thứ Tự
              </button>
              <button
                onClick={clearArrangement}
                disabled={!timerRunning || roundSolved || finished}
                className="game-action-btn game-action-btn--secondary w-full"
              >
                Xóa Thứ Tự
              </button>
            </div>
            <div
              className="mt-4 rounded-2xl px-5 py-4"
              style={feedback ? feedbackToneStyles[feedback.type] : feedbackToneStyles.neutral}
            >
              <div className="text-sm font-semibold">{feedback?.text || "Xem video trước, rồi bấm Bắt Đầu Sắp Xếp để mở lượt chơi và xếp các khung hình từ sớm đến muộn."}</div>
            </div>
            {roundSolved && !finished ? (
              <button onClick={moveNextRound} className="game-action-btn game-action-btn--sky mt-4 w-full text-base">
                Sang Video Tiếp Theo
              </button>
            ) : null}
          </div>

          <div className="game-panel-strong flex min-h-[420px] flex-col rounded-[28px] p-4 shadow-xl sm:p-5 xl:min-h-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="game-text-muted text-xs font-black uppercase tracking-[0.24em]">Bảng Sắp Xếp</div>
                <div className="game-text-secondary mt-2 text-sm">Nhấn vào khung hình bên dưới để đưa vào timeline. Khi đã đặt vào thứ tự, bạn có thể dịch trái, dịch phải hoặc bỏ ra.</div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em]" style={accentChipStyle}>
                <Film size={14} />
                {currentRound.frames.length} Khung
              </div>
            </div>
            <div className="mt-4 custom-scrollbar flex-1 overflow-y-auto pr-1">
              <div className="space-y-3">
                {currentRound.frames.map((_, index) => {
                  const frame = selectedFrames[index];
                  const slotStyle = roundSolved
                    ? successPanelStyle
                    : incorrectSlots.includes(index)
                      ? errorPanelStyle
                      : surfaceStrongStyle;
                  return (
                    <div key={`${currentRound.id}-slot-${index + 1}`} className="rounded-[24px] border p-4" style={slotStyle}>
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-base font-black"
                          style={accentChipStyle}
                        >
                          {index + 1}
                        </div>
                        {frame ? (
                          <div className="min-w-0 flex-1">
                            <div className="overflow-hidden rounded-2xl border" style={surfaceStrongStyle}>
                              <img src={frame.imageUrl} alt={`${currentRound.title} - bước ${index + 1}`} className="h-32 w-full object-cover xl:h-36" />
                            </div>
                            {frame.caption ? <div className="game-text-secondary mt-3 text-sm">{frame.caption}</div> : null}
                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                onClick={() => moveFrame(index, -1)}
                                disabled={!timerRunning || index === 0 || roundSolved || finished}
                                className="game-action-btn game-action-btn--secondary game-action-btn--compact"
                              >
                                Sang Trái
                              </button>
                              <button
                                onClick={() => moveFrame(index, 1)}
                                disabled={!timerRunning || index === selectedFrames.length - 1 || roundSolved || finished}
                                className="game-action-btn game-action-btn--secondary game-action-btn--compact"
                              >
                                Sang Phải
                              </button>
                              <button
                                onClick={() => removeFrameAt(index)}
                                disabled={!timerRunning || roundSolved || finished}
                                className="game-action-btn game-action-btn--danger game-action-btn--compact"
                              >
                                Bỏ Ra
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="game-text-faint flex min-h-32 flex-1 items-center justify-center rounded-2xl border border-dashed px-4 py-6 text-center text-sm xl:min-h-36"
                            style={surfaceStyle}
                          >
                            Chưa có khung hình ở vị trí này.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="game-panel-strong flex min-h-[420px] flex-col rounded-[28px] p-4 shadow-xl sm:p-5 xl:min-h-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="game-text-muted text-xs font-black uppercase tracking-[0.24em]">Kho Khung Hình</div>
                <div className="game-text-secondary mt-2 text-sm">Các khung hình chưa được xếp sẽ nằm ở đây. Chọn trực tiếp để đẩy sang bảng sắp xếp ở cột giữa.</div>
              </div>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em]"
                style={{
                  background: isLightMode ? "rgba(56, 189, 248, 0.12)" : "rgba(14, 165, 233, 0.14)",
                  border: `1px solid ${isLightMode ? "rgba(2, 132, 199, 0.2)" : "rgba(56, 189, 248, 0.24)"}`,
                  color: infoTextColor,
                }}
              >
                {availableFrames.length} còn lại
              </div>
            </div>
            <div className="mt-4 custom-scrollbar flex-1 overflow-y-auto pr-1">
              {availableFrames.length > 0 ? (
                <div className="grid gap-3">
                  {availableFrames.map((frame) => (
                    <button
                      key={frame.id}
                      type="button"
                      onClick={() => placeFrame(frame.id)}
                      disabled={!timerRunning || roundSolved || finished}
                      className="overflow-hidden rounded-[22px] border text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                      style={surfaceStrongStyle}
                    >
                      <img src={frame.imageUrl} alt={currentRound.title} className="h-32 w-full object-cover xl:h-36" />
                      <div className="flex items-center justify-between gap-3 px-4 py-3">
                        <div className="game-text-secondary text-xs font-black uppercase tracking-[0.16em]">Chọn vào thứ tự</div>
                        <div className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em]" style={surfaceStyle}>
                          Kho
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  className="game-text-faint rounded-2xl border border-dashed px-4 py-6 text-center text-sm"
                  style={surfaceStyle}
                >
                  Tất cả khung hình đã được đưa vào timeline. Kiểm tra lại thứ tự ở cột giữa rồi nộp kết quả.
                </div>
              )}
            </div>
          </div>
        </div>

        {finished ? (
          <div className="game-overlay fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
            <Confetti active={true} count={100} />
            <div className="game-panel-strong w-full max-w-3xl rounded-[32px] p-6 text-center shadow-2xl sm:p-8">
              <div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
                style={{
                  background: isLightMode ? "rgba(34, 197, 94, 0.12)" : "rgba(16, 185, 129, 0.16)",
                  border: `1px solid ${isLightMode ? "rgba(34, 197, 94, 0.24)" : "rgba(16, 185, 129, 0.28)"}`,
                  color: successTextColor,
                }}
              >
                <Trophy size={40} />
              </div>
              <h2
                className="vn-safe-heading mt-5 text-3xl font-black tracking-[0.08em] sm:text-4xl"
                style={{ color: successTextColor }}
              >
                Hoàn thành Mảnh vỡ lịch sử
              </h2>
              <p className="game-text-secondary mt-4">Bạn đã sắp xếp đúng toàn bộ {totalRounds} video và khôi phục chính xác mạch diễn biến của từng sự kiện.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="game-panel rounded-2xl px-4 py-5">
                  <div className="game-text-muted text-xs font-black uppercase tracking-[0.22em]">Đúng</div>
                  <div className="mt-2 text-3xl font-black" style={{ color: "var(--game-text)" }}>
                    {correctCount}/{totalRounds}
                  </div>
                </div>
                <div className="game-panel rounded-2xl px-4 py-5">
                  <div className="game-text-muted text-xs font-black uppercase tracking-[0.22em]">Video</div>
                  <div className="mt-2 text-3xl font-black" style={{ color: "var(--game-text)" }}>
                    {totalRounds}
                  </div>
                </div>
                <div className="rounded-2xl px-4 py-5" style={accentChipStyle}>
                  <div className="text-xs font-black uppercase tracking-[0.22em]" style={{ color: goldTextColor }}>
                    Điểm
                  </div>
                  <div className="mt-2 text-3xl font-black" style={{ color: goldTextColor }}>
                    {score}
                  </div>
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={restartMode} className="game-action-btn game-action-btn--primary flex-1">
                  Chơi Lại
                </button>
                <button onClick={() => navigate("/modes")} className="game-action-btn game-action-btn--secondary flex-1">
                  Về Chủ Đề 4
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
