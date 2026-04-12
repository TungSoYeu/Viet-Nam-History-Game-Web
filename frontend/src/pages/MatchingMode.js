/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lightbulb, Package, Target, Trophy } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-amber-400/30 border-t-amber-400 animate-spin" />
          <span className="text-sm font-bold text-amber-300 tracking-wide animate-pulse">Đang tải dữ liệu kết nối...</span>
        </div>
      </div>
    );
  }

  if (!roundState.round) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6 bg-transparent">
        <div className="rounded-3xl border border-amber-400/20 bg-slate-900/80 p-8 max-w-md shadow-2xl">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-lg font-bold text-amber-300">Chưa có vòng nối hợp lệ</p>
          <p className="text-sm text-slate-400 mt-2">Hãy thử quay lại sau hoặc chọn chế độ chơi khác.</p>
        </div>
      </div>
    );
  }

  /* ── Timer visual helpers ── */
  const timerPercent = roundStarted ? (timeLeft / ROUND_TIME) * 100 : 100;
  const timerColor = timeLeft <= 5 ? "#ef4444" : timeLeft <= 10 ? "#f59e0b" : "#38bdf8";
  const timerCircle = 2 * Math.PI * 18; // r=18

  if (isFinished) {
    const totalPossible = activeConnectingRounds.length * 50;
    const percent = totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0;
    return (
      <div className="min-h-screen p-4 flex items-center justify-center bg-transparent">
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
    <div className="h-screen flex flex-col p-2 sm:p-3 bg-transparent relative z-10 overflow-hidden">
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
          </div>

          {/* Mini timer circle */}
          <div className="relative flex items-center justify-center w-9 h-9 shrink-0">
            <svg width="40" height="40" viewBox="0 0 40 40" className="absolute -rotate-90">
              <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
              <circle cx="20" cy="20" r="18" fill="none" stroke={timerColor} strokeWidth="2.5"
                strokeDasharray={timerCircle} strokeDashoffset={timerCircle * (1 - timerPercent / 100)}
                strokeLinecap="round" className="transition-all duration-1000"
              />
            </svg>
            <span className="text-[11px] font-black" style={{ color: timerColor }}>
              {roundStarted ? timeLeft : ROUND_TIME}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="px-2 py-1 rounded-lg text-[11px] font-black text-slate-300"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {roundIndex + 1}<span className="text-slate-500">/{activeConnectingRounds.length}</span>
            </div>
            <div className="px-2 py-1 rounded-lg text-[11px] font-black"
              style={{ color: "#fbbf24", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.15)" }}
            >
              {score} XP
            </div>
          </div>
        </div>

        {/* ═══ INSTRUCTION + PROGRESS ═══ */}
        <div className="flex-shrink-0 mb-1.5 flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.12)" }}
        >
          <Lightbulb size={14} className="text-amber-400 shrink-0" />
          <span className="flex-1 text-xs font-bold text-amber-200/90 line-clamp-1">
            {roundState.round.title}. {roundState.round.instruction}
          </span>
          <span className="text-[10px] font-black text-amber-400/60 shrink-0">
            {placedCount}/{roundState.cards.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex-shrink-0 mb-2 h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${((roundIndex + (review ? 1 : 0)) / activeConnectingRounds.length) * 100}%`,
              background: "linear-gradient(90deg, #38bdf8, #34d399, #fbbf24)",
            }}
          />
        </div>

        {/* Notice */}
        {notice ? (
          <div className={`flex-shrink-0 mb-1.5 rounded-xl px-3 py-1.5 text-xs font-bold border ${
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
        {!roundStarted && !review ? (
          /* Pre-start state */
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-md w-full text-center p-8 rounded-3xl"
              style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(56,189,248,0.12)", backdropFilter: "blur(12px)" }}
            >
              <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 rotate-3"
                style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(99,102,241,0.15))", border: "1px solid rgba(56,189,248,0.2)" }}
              >
                <Package size={28} className="text-sky-400" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Sẵn sàng kết nối</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-1">
                Kéo thả các thẻ dữ kiện vào ô đáp án tương ứng trong <span className="font-black text-sky-300">{ROUND_TIME} giây</span>.
              </p>
              <p className="text-xs text-slate-500">
                Mỗi cặp đúng = <span className="text-amber-400 font-black">+10 XP</span>
              </p>
            </div>
          </div>
        ) : (
          /* Active game board */
          <div className="flex flex-col xl:flex-row w-full gap-2.5 flex-1 min-h-0 overflow-hidden">

            {/* ── LEFT: Draggable cards ── */}
            <div className="xl:w-[42%] w-full flex flex-col min-h-0 overflow-hidden rounded-2xl"
              style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}
            >
              <div className="flex-shrink-0 flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.2))" }}
                  >
                    <Package size={13} className="text-amber-400" />
                  </div>
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wider">Thẻ dữ kiện</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ color: placedCount === roundState.cards.length ? "#34d399" : "#94a3b8", background: "rgba(255,255,255,0.04)" }}
                >
                  {availableCards.length} còn lại
                </span>
              </div>

              {/* Drop zone to return cards */}
              <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, "")}
                className="flex-shrink-0 mx-2 mt-2 rounded-lg border border-dashed px-2 py-1 text-center text-[10px] transition-colors"
                style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.02)" }}
              >
                ↩ Kéo thẻ về đây để bỏ
              </div>

              {/* Cards list */}
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-2 space-y-2">
                {availableCards.length > 0 ? (
                  availableCards.map((item) => (
                    <div key={item.id}
                      draggable={roundStarted && timerRunning && !review}
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      className={`group flex items-center gap-3 px-4 py-2.5 md:py-3 rounded-2xl cursor-grab active:cursor-grabbing transition-all duration-200 ${
                        roundStarted && timerRunning && !review
                          ? "hover:translate-x-1 hover:shadow-lg hover:shadow-amber-500/5"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      style={{
                        background: roundStarted && timerRunning && !review ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
                        border: `1px solid ${roundStarted && timerRunning && !review ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.04)"}`,
                      }}
                    >
                      {item.image ? (
                        <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-xl overflow-hidden shadow-md"
                          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                        >
                          <img src={item.image} alt={item.content} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-xl flex items-center justify-center text-2xl"
                          style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.05))", border: "1px solid rgba(251,191,36,0.15)" }}
                        >
                           📜
                        </div>
                      )}
                      <span className="flex-1 text-sm md:text-base font-bold text-white/90 leading-snug">{item.content}</span>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: "rgba(251,191,36,0.15)" }}
                      >
                        <span className="text-[10px] text-amber-400">→</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="text-2xl mb-2">✅</div>
                    <p className="text-xs text-emerald-300 font-bold">Đã đặt hết thẻ!</p>
                    <p className="text-[10px] text-slate-500 mt-1">Bấm Hoàn thành khi sẵn sàng</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: Answer slots ── */}
            <div className="xl:w-[58%] w-full flex flex-col min-h-0 overflow-hidden rounded-2xl"
              style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}
            >
              <div className="flex-shrink-0 flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.2))" }}
                  >
                    <Target size={13} className="text-emerald-400" />
                  </div>
                  <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">Ô đáp án</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ color: "#94a3b8", background: "rgba(255,255,255,0.04)" }}
                >
                  {roundState.slots.length} ô
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-2 space-y-2">
                {roundState.slots.map((slot) => {
                  const placedCard = getCardInSlot(slot.id);
                  const slotReview = review?.evaluation?.[slot.id];

                  let borderColor = "rgba(255,255,255,0.06)";
                  let bgColor = "rgba(255,255,255,0.015)";
                  let labelColor = "#e2e8f0";

                  if (review) {
                    if (slotReview?.isCorrect) {
                      borderColor = "rgba(52,211,153,0.3)";
                      bgColor = "rgba(52,211,153,0.06)";
                      labelColor = "#6ee7b7";
                    } else if (slotReview?.card || (!slotReview?.isDistractor && slotReview?.expected)) {
                      borderColor = "rgba(248,113,113,0.3)";
                      bgColor = "rgba(248,113,113,0.06)";
                      labelColor = "#fca5a5";
                    }
                  } else if (roundStarted && timerRunning) {
                    borderColor = "rgba(99,102,241,0.25)";
                    bgColor = "rgba(99,102,241,0.04)";
                  }

                  return (
                    <div key={slot.id}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, slot.id)}
                      className="flex items-center gap-3 px-4 py-2.5 md:py-3 rounded-2xl transition-all duration-200"
                      style={{ background: bgColor, border: `1.5px solid ${borderColor}` }}
                    >
                      {/* Slot label */}
                      <div className="shrink-0 w-[42%] min-w-0">
                        <span className="text-sm md:text-base font-bold leading-snug block" style={{ color: labelColor }}>
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
                            className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-grab active:cursor-grabbing transition-all border"
                            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                          >
                            {placedCard.image ? (
                              <img src={placedCard.image} alt={placedCard.content}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover shrink-0 border"
                                style={{ borderColor: "rgba(255,255,255,0.1)" }}
                              />
                            ) : null}
                            <span className="text-sm md:text-base font-bold text-white/90 truncate">{placedCard.content}</span>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed py-3 text-center text-xs md:text-sm transition-colors"
                            style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.2)" }}
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
        )}

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

