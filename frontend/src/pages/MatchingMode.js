import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Target, Trophy } from "lucide-react";
import { connectingHistoryRounds } from "../data/theme4GameData";
import useTheme4ModeData from "../hooks/useTheme4ModeData";
import {
  logGameTelemetry,
  resetModeSessionId,
  saveXp,
  shuffleArray,
} from "../utils/gameHelpers";

const MODE_ID = "connecting-history";
const ROUND_TIME = 30;

const buildRoundState = (round) => {
  if (!round) {
    return {
      round: null,
      cards: [],
      slots: [],
      placements: {},
    };
  }

  const sampledPairs = shuffleArray(round.pairs).slice(0, 5);
  const cards = shuffleArray(sampledPairs.map((pair, index) => ({
    id: `left-${index}`,
    content: pair.left,
    match: pair.right,
    image: pair.image,
  })));

  let slots = sampledPairs.map((pair, index) => ({
    id: `right-${index}`,
    content: pair.right,
  }));

  const extraDistractors = round.distractors?.length
    ? round.distractors
    : Array.isArray(round.distractor)
      ? round.distractor
      : round.distractor
        ? [round.distractor]
        : [];

  extraDistractors.forEach((dist, idx) => {
    slots.push({
      id: `dist-${idx}`,
      content: dist,
      isDistractor: true,
    });
  });

  return {
    round,
    cards,
    slots: shuffleArray(slots),
    placements: {},
  };
};

export default function MatchingMode() {
  const navigate = useNavigate();
  const { data: activeConnectingRounds, loading } = useTheme4ModeData(
    MODE_ID,
    connectingHistoryRounds
  );
  const [roundIndex, setRoundIndex] = useState(0);
  const [roundState, setRoundState] = useState(() => buildRoundState(null));
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [notice, setNotice] = useState(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [roundStarted, setRoundStarted] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [review, setReview] = useState(null);
  const startedAtRef = useRef(Date.now());
  const sessionActiveRef = useRef(false);

  useEffect(() => {
    if (!Array.isArray(activeConnectingRounds) || activeConnectingRounds.length === 0) return;

    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    sessionActiveRef.current = true;
    logGameTelemetry(MODE_ID, "session_start", {
      totalRounds: activeConnectingRounds.length,
    });
    setRoundIndex(0);
    setRoundState(buildRoundState(activeConnectingRounds[0]));
    setScore(0);
    setIsFinished(false);
    setNotice(null);
    setTimeLeft(ROUND_TIME);
    setRoundStarted(false);
    setTimerRunning(false);
    setReview(null);
  }, [activeConnectingRounds]);

  useEffect(() => {
    if (!Array.isArray(activeConnectingRounds) || activeConnectingRounds.length === 0) return;

    setRoundState(buildRoundState(activeConnectingRounds[roundIndex]));
    setNotice(null);
    setTimeLeft(ROUND_TIME);
    setRoundStarted(false);
    setTimerRunning(false);
    setReview(null);
  }, [activeConnectingRounds, roundIndex]);

  useEffect(() => {
    if (!roundStarted || !timerRunning || review || isFinished || timeLeft <= 0) return undefined;

    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [isFinished, review, roundStarted, timeLeft, timerRunning]);

  useEffect(() => {
    if (!roundStarted || !timerRunning || review || isFinished || timeLeft > 0) return;
    submitRound(true);
  }, [isFinished, review, roundStarted, timeLeft, timerRunning]);

  const getPlacedSlotId = (cardId) => roundState.placements?.[cardId] || "";

  const getCardById = (cardId) =>
    roundState.cards.find((card) => card.id === cardId) || null;

  const getCardInSlot = (slotId) => {
    const cardId = Object.entries(roundState.placements || {}).find(([, value]) => value === slotId)?.[0];
    return cardId ? getCardById(cardId) : null;
  };

  const startRound = () => {
    if (!roundState.round) return;
    setNotice(null);
    setReview(null);
    setTimeLeft(ROUND_TIME);
    setRoundStarted(true);
    setTimerRunning(true);
    logGameTelemetry(MODE_ID, "round_started", {
      roundId: roundState.round.id,
      durationSeconds: ROUND_TIME,
    });
  };

  const placeCard = (cardId, slotId = "") => {
    if (!roundStarted || !timerRunning || review) return;

    setRoundState((prev) => {
      const nextPlacements = { ...(prev.placements || {}) };
      const currentHolder = Object.keys(nextPlacements).find(
        (key) => nextPlacements[key] === slotId
      );

      if (currentHolder) nextPlacements[currentHolder] = "";
      nextPlacements[cardId] = slotId;

      return {
        ...prev,
        placements: nextPlacements,
      };
    });
    setNotice(null);
  };

  const handleDragStart = (event, cardId) => {
    if (!roundStarted || !timerRunning || review) return;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", cardId);
  };

  const handleDrop = (event, slotId = "") => {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain");
    if (!cardId) return;
    placeCard(cardId, slotId);
  };

  const submitRound = (timeUp = false) => {
    if (!roundState.round || review || (!timeUp && (!roundStarted || !timerRunning))) return;

    const placedCards = roundState.cards.filter((card) => getPlacedSlotId(card.id));
    if (!timeUp && placedCards.length !== roundState.cards.length) {
      setNotice({
        type: "warning",
        text: `Hãy kéo đủ ${roundState.cards.length} thẻ rồi bấm Hoàn thành.`,
      });
      return;
    }

    let correctCount = 0;
    const evaluation = {};

    roundState.slots.forEach((slot) => {
      const card = getCardInSlot(slot.id);
      const expected = roundState.cards.find((item) => item.match === slot.content) || null;
      const isCorrect = Boolean(card && !slot.isDistractor && card.match === slot.content);

      if (isCorrect) correctCount += 1;
      evaluation[slot.id] = {
        card,
        expected,
        isCorrect,
        isDistractor: Boolean(slot.isDistractor),
      };
    });

    const nextScore = score + correctCount * 10;
    setScore(nextScore);
    setReview({
      evaluation,
      correctCount,
      placedCount: placedCards.length,
      timeUp,
    });
    setRoundStarted(false);
    setTimerRunning(false);
    setNotice({
      type: correctCount === roundState.cards.length ? "success" : "warning",
      text: timeUp
        ? `Hết giờ. Bạn nối đúng ${correctCount}/${roundState.cards.length} cặp.`
        : `Bạn nối đúng ${correctCount}/${roundState.cards.length} cặp.`,
    });
    logGameTelemetry(MODE_ID, "answer_submitted", {
      roundId: roundState.round.id,
      correctCount,
      totalPairs: roundState.cards.length,
      timeUp,
      scoreAfter: nextScore,
    });
  };

  const moveNext = async () => {
    if (!review) return;

    if (roundIndex + 1 < activeConnectingRounds.length) {
      setRoundIndex((prev) => prev + 1);
      return;
    }

    if (sessionActiveRef.current) {
      sessionActiveRef.current = false;
      logGameTelemetry(MODE_ID, "session_end", {
        solved: true,
        score,
        durationMs: Date.now() - startedAtRef.current,
      });
    }
    setIsFinished(true);
    if (score > 0) await saveXp(score);
  };

  const restart = () => {
    if (!Array.isArray(activeConnectingRounds) || activeConnectingRounds.length === 0) return;

    if (sessionActiveRef.current) {
      sessionActiveRef.current = false;
      logGameTelemetry(MODE_ID, "session_end", {
        solved: false,
        score,
        durationMs: Date.now() - startedAtRef.current,
        reason: "restart",
      });
    }
    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    sessionActiveRef.current = true;
    logGameTelemetry(MODE_ID, "session_start", {
      totalRounds: activeConnectingRounds.length,
      replay: true,
    });
    setRoundIndex(0);
    setRoundState(buildRoundState(activeConnectingRounds[0]));
    setScore(0);
    setIsFinished(false);
    setNotice(null);
    setTimeLeft(ROUND_TIME);
    setRoundStarted(false);
    setTimerRunning(false);
    setReview(null);
  };

  const handleExit = async () => {
    if (sessionActiveRef.current) {
      sessionActiveRef.current = false;
      logGameTelemetry(MODE_ID, "session_end", {
        solved: isFinished,
        score,
        durationMs: Date.now() - startedAtRef.current,
      });
    }
    if (!isFinished && score > 0) await saveXp(score);
    navigate("/modes");
  };

  const toggleTimerRunning = () => {
    setTimerRunning((prev) => !prev);
  };

  const availableCards = roundState.cards.filter((card) => !getPlacedSlotId(card.id));
  const placedCount = roundState.cards.length - availableCards.length;
  const allCardsPlaced = roundState.cards.length > 0 && availableCards.length === 0;

  if (loading && !roundState.round) {
    return (
      <div className="theme-page game-screen min-h-screen flex items-center justify-center overflow-y-auto overflow-x-hidden custom-scrollbar bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-amber-400/30 border-t-amber-400 animate-spin" />
          <span className="text-sm font-bold text-amber-300 tracking-wide animate-pulse">Đang tải dữ liệu kết nối...</span>
        </div>
      </div>
    );
  }

  if (!roundState.round) {
    return (
      <div className="theme-page game-screen min-h-screen flex items-center justify-center text-center px-6 overflow-y-auto overflow-x-hidden custom-scrollbar bg-transparent">
        <div className="rounded-3xl border border-amber-400/20 bg-slate-900/80 p-8 max-w-md shadow-2xl">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-lg font-bold text-amber-300">Chưa có vòng nối hợp lệ</p>
          <p className="text-sm text-slate-400 mt-2">Hãy thử quay lại sau hoặc chọn chế độ chơi khác.</p>
        </div>
      </div>
    );
  }

  /* ── Timer visual helpers ── */
  const timerColor = timeLeft <= 5 ? "#ef4444" : timeLeft <= 10 ? "#f59e0b" : "#38bdf8";

  if (isFinished) {
    const totalPossible = activeConnectingRounds.length * 50;
    const percent = totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0;
    return (
      <div className="theme-page game-screen min-h-screen p-4 flex items-center justify-center overflow-y-auto overflow-x-hidden custom-scrollbar bg-transparent">
        <div className="max-w-lg w-full rounded-[28px] text-center shadow-2xl overflow-hidden"
          style={{ background: "linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(7,11,20,0.98) 100%)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Confetti top strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400" />
          <div className="p-8">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-5"
              style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(16,185,129,0.15))", border: "2px solid rgba(251,191,36,0.3)" }}
            >
              <Trophy size={36} className="text-amber-400 drop-shadow-lg" />
            </div>
            <h2 className="vn-safe-heading text-2xl font-black uppercase tracking-wide"
              style={{ background: "linear-gradient(135deg, #fbbf24, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Hoàn Thành Kết Nối
            </h2>
            <div className="mt-6 flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-black text-amber-300">{score}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">XP đạt được</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center">
                <div className="text-3xl font-black text-emerald-300">{percent}%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Chính xác</div>
              </div>
            </div>
            <p className="text-xs mt-5 text-slate-400 leading-relaxed">
              Bạn đã hoàn thành {activeConnectingRounds.length} lượt nối trong chế độ chơi.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={restart}
                className="flex-1 py-3 rounded-2xl font-black text-sm text-white transition-all hover:scale-[1.02]"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Chơi Lại
              </button>
              <button onClick={handleExit}
                className="flex-1 py-3 rounded-2xl font-black text-sm text-slate-950 transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}
              >
                Quay Lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-page game-screen h-screen flex flex-col p-2 sm:p-3 bg-transparent relative z-10 overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div className="max-w-[1600px] mx-auto flex flex-col h-full w-full min-h-0">

        {/* ═══ HEADER BAR ═══ */}
        <div className="flex-shrink-0 flex items-center gap-2 mb-2 p-2 sm:p-2.5 rounded-2xl"
          style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(16px)" }}
        >
          <button onClick={handleExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 transition-all hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Thoát</span>
          </button>

        <div className="flex-1 text-center">
          <h2 className="vn-safe-heading text-sm sm:text-base font-black tracking-wide"
              style={{ background: "linear-gradient(135deg, #f0d48a, #d4a053)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Kết nối lịch sử
            </h2>
            <p className="mt-2 text-sm font-black text-white sm:text-base">
              {roundState.round.title}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-2xl border px-4 py-3 text-center"
              style={{ borderColor: "rgba(251,191,36,0.2)", background: "rgba(251,191,36,0.08)" }}
            >
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-300/80">
                Thời gian
              </div>
              <div className="mt-1 text-2xl font-black" style={{ color: timerColor }}>
                {roundStarted ? timeLeft : ROUND_TIME}s
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3 text-center">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Lượt
              </div>
              <div className="mt-1 text-2xl font-black text-white">
                {roundIndex + 1}/{activeConnectingRounds.length}
              </div>
            </div>
            <div className="rounded-2xl border px-4 py-3 text-center"
              style={{ color: "#fbbf24", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.15)" }}
            >
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-300/80">
                XP
              </div>
              <div className="mt-1 text-2xl font-black">{score}</div>
            </div>
          </div>
        </div>

        {/* Notice */}
        {notice ? (
          <div className={`flex-shrink-0 mb-2 rounded-xl px-3 py-2 text-sm font-bold border ${
            notice.type === "success"
              ? "border-emerald-400/20 bg-emerald-500/8 text-emerald-300"
              : notice.type === "warning"
                ? "border-amber-400/20 bg-amber-500/8 text-amber-300"
                : "border-rose-400/20 bg-rose-500/8 text-rose-300"
          }`}>
            {notice.text}
          </div>
        ) : null}

        {/* ═══ GAME AREA ═══ */}
        <div className="flex flex-col xl:flex-row w-full gap-3 flex-1 min-h-0 overflow-hidden">

            {/* ── LEFT: Draggable cards ── */}
            <div className="xl:w-[45%] w-full flex flex-col min-h-0 overflow-hidden rounded-[28px]"
              style={{ background: "var(--game-surface)", border: "1px solid var(--game-border)" }}
            >
              <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.2))" }}
                  >
                    <Package size={16} className="text-amber-400" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-wider" style={{ color: "var(--page-heading)" }}>Thẻ dữ kiện</span>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-bold"
                  style={{ color: placedCount === roundState.cards.length ? "#10b981" : "var(--game-text-secondary)", background: "var(--game-surface)" }}
                >
                  {availableCards.length} còn lại
                </span>
              </div>

              {/* Drop zone to return cards */}
              <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, "")}
                className="flex-shrink-0 mx-3 mt-3 rounded-xl border border-dashed px-3 py-2 text-center text-xs font-bold transition-colors"
                style={{ borderColor: "var(--game-border)", color: "var(--game-text-secondary)", background: "var(--game-surface)" }}
              >
                ↩ Kéo thẻ về đây để bỏ
              </div>

              {/* Cards list */}
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3 space-y-3">
                {availableCards.length > 0 ? (
                  availableCards.map((item) => (
                    <div key={item.id}
                      draggable={roundStarted && timerRunning && !review}
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      className={`group flex items-center gap-4 px-4 py-3 md:py-4 rounded-[24px] cursor-grab active:cursor-grabbing transition-all duration-200 ${
                        roundStarted && timerRunning && !review
                          ? "hover:translate-x-1 hover:shadow-lg hover:shadow-amber-500/5"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      style={{
                        background: roundStarted && timerRunning && !review ? "var(--game-surface-strong)" : "var(--game-surface)",
                        border: `1px solid ${roundStarted && timerRunning && !review ? "rgba(251,191,36,0.4)" : "var(--game-border)"}`,
                      }}
                    >
                      {item.image ? (
                        <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl overflow-hidden shadow-md"
                          style={{ border: "1px solid var(--game-border)" }}
                        >
                          <img src={item.image} alt={item.content} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl flex items-center justify-center text-3xl"
                          style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.05))", border: "1px solid rgba(251,191,36,0.15)" }}
                        >
                           📜
                        </div>
                      )}
                      <span className="flex-1 text-base md:text-lg font-bold leading-snug" style={{ color: "var(--page-heading)" }}>{item.content}</span>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: "rgba(251,191,36,0.15)" }}
                      >
                        <span className="text-xs text-amber-400">→</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="text-2xl mb-2">✅</div>
                    <p className="text-sm text-emerald-300 font-bold">Đã đặt hết thẻ</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: Answer slots ── */}
            <div className="xl:w-[55%] w-full flex flex-col min-h-0 overflow-hidden rounded-[28px]"
              style={{ background: "var(--game-surface)", border: "1px solid var(--game-border)" }}
            >
              <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.2))" }}
                  >
                    <Target size={16} className="text-emerald-400" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-wider" style={{ color: "var(--page-heading)" }}>Ô đáp án</span>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-bold"
                  style={{ color: "var(--game-text-secondary)", background: "var(--game-surface)" }}
                >
                  {roundState.slots.length} ô
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3 space-y-3">
                {roundState.slots.map((slot) => {
                  const placedCard = getCardInSlot(slot.id);
                  const slotReview = review?.evaluation?.[slot.id];

                  let borderColor = "var(--game-border)";
                  let bgColor = "var(--game-surface)";
                  let labelColor = "var(--page-heading)";

                  if (review) {
                    if (slotReview?.isCorrect) {
                      borderColor = "rgba(52,211,153,0.4)";
                      bgColor = "rgba(52,211,153,0.1)";
                      labelColor = "#10b981";
                    } else if (slotReview?.card || (!slotReview?.isDistractor && slotReview?.expected)) {
                      borderColor = "rgba(248,113,113,0.4)";
                      bgColor = "rgba(248,113,113,0.1)";
                      labelColor = "#ef4444";
                    }
                  } else if (roundStarted && timerRunning) {
                    borderColor = "rgba(99,102,241,0.3)";
                    bgColor = "rgba(99,102,241,0.05)";
                  }

                  return (
                    <div key={slot.id}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, slot.id)}
                      className="flex items-center gap-4 px-4 py-3 md:py-4 rounded-[24px] transition-all duration-200"
                      style={{ background: bgColor, borderColor: borderColor, borderWidth: "1.5px", borderStyle: "solid" }}
                    >
                      {/* Slot label */}
                      <div className="shrink-0 w-[42%] min-w-0">
                        <span className="block text-base md:text-lg font-bold leading-snug" style={{ color: labelColor }}>
                          {slot.content}
                        </span>
                      </div>

                      {/* Connector dot */}
                      <div className="shrink-0 flex flex-col items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: borderColor }} />
                        <div className="w-0.5 h-5 md:h-6" style={{ background: borderColor }} />
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: borderColor }} />
                      </div>

                      {/* Drop area */}
                      <div className="flex-1 min-w-0">
                        {placedCard ? (
                          <div draggable={roundStarted && timerRunning && !review}
                            onDragStart={(e) => handleDragStart(e, placedCard.id)}
                            className="flex items-center gap-3 px-3 py-3 rounded-2xl cursor-grab active:cursor-grabbing transition-all border"
                            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                          >
                            {placedCard.image ? (
                              <img src={placedCard.image} alt={placedCard.content}
                                className="w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover shrink-0 border"
                                style={{ borderColor: "var(--game-border)" }}
                              />
                            ) : null}
                            <span className="text-base md:text-lg font-bold truncate" style={{ color: "var(--page-heading)" }}>{placedCard.content}</span>
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-dashed py-4 text-center text-sm md:text-base font-bold transition-colors"
                            style={{ borderColor: "var(--game-border)", color: "var(--game-text-faint)" }}
                          >
                            Thả thẻ vào đây
                          </div>
                        )}
                      </div>

                      {/* Review indicator */}
                      {review && slotReview ? (
                        <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                          style={{
                            background: slotReview.isCorrect ? "rgba(52,211,153,0.15)" : slotReview.isDistractor ? "transparent" : "rgba(248,113,113,0.15)",
                          }}
                        >
                          {slotReview.isCorrect ? "✓" : slotReview.isDistractor ? "" : "✗"}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        {/* ═══ BOTTOM ACTION BAR ═══ */}
        <div className="flex-shrink-0 mt-2 flex items-center gap-2 p-2 rounded-2xl"
          style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(16px)" }}
        >
          {!review ? (
            !roundStarted ? (
              <>
                <button onClick={startRound}
                  className="flex-1 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all hover:scale-[1.01]"
                  style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", color: "#0f172a" }}
                >
                  ▶ Bắt Đầu
                </button>
                <button disabled
                  className="px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider text-white/30"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  Dừng
                </button>
              </>
            ) : (
              <>
                <button onClick={toggleTimerRunning}
                  className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-white/5"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {timerRunning ? "⏸ Dừng" : "▶ Tiếp"}
                </button>
                <button onClick={() => submitRound(false)}
                  disabled={!timerRunning || !allCardsPlaced}
                  className="flex-1 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all hover:scale-[1.01] disabled:opacity-40 disabled:hover:scale-100"
                  style={{ background: allCardsPlaced ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : "rgba(251,191,36,0.15)", color: allCardsPlaced ? "#0f172a" : "#fbbf24" }}
                >
                  Hoàn Thành ({placedCount}/{roundState.cards.length})
                </button>
              </>
            )
          ) : (
            <>
              <div className="flex-1 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: review.correctCount === roundState.cards.length ? "rgba(52,211,153,0.15)" : "rgba(251,191,36,0.15)" }}
                >
                  <span className="text-sm">{review.correctCount === roundState.cards.length ? "🎉" : "📊"}</span>
                </div>
                <div>
                  <div className="text-xs font-black text-white">
                    Đúng {review.correctCount}/{roundState.cards.length} cặp
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {review.timeUp ? "Hết giờ — tự chấm" : "Đã chấm điểm"}
                  </div>
                </div>
              </div>
              <button onClick={moveNext}
                className="px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #34d399, #10b981)", color: "#0f172a" }}
              >
                {roundIndex === activeConnectingRounds.length - 1 ? "Kết Thúc" : "Lượt Tiếp →"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

