/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock3, Lightbulb, Package, Target, Trophy } from "lucide-react";
import { connectingHistoryRounds } from "../data/theme4GameData";
import useTheme4ModeData from "../hooks/useTheme4ModeData";
import {
  logGameTelemetry,
  resetModeSessionId,
  saveXp,
  shuffleArray,
} from "../utils/gameHelpers";

const MODE_ID = "connecting-history";
const ROUND_TIME = 15;

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
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-amber-400 bg-transparent">
        Đang tải dữ liệu kết nối...
      </div>
    );
  }

  if (!roundState.round) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6 text-2xl font-bold text-amber-400 bg-transparent">
        Chưa có vòng nối hợp lệ cho chế độ chơi này.
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center bg-transparent">
        <div className="max-w-md w-full p-8 rounded-3xl text-center backdrop-blur-xl shadow-2xl" style={{ background: "rgba(15, 23, 42, 0.85)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <Trophy size={72} className="text-amber-400 mx-auto mb-5" />
          <h2 className="text-3xl font-black text-green-400 mb-3 uppercase">Hoàn Thành Kết Nối</h2>
          <p className="text-white font-bold text-xl mb-3">Điểm: {score} XP</p>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
            Bạn đã hoàn thành toàn bộ {activeConnectingRounds.length} lượt nối của chế độ chơi này.
          </p>
          <div className="flex gap-3">
            <button onClick={restart} className="flex-1 py-3 rounded-xl font-black text-white" style={{ background: "rgba(255,255,255,0.08)" }}>
              Chơi Lại
            </button>
            <button onClick={handleExit} className="flex-1 py-3 rounded-xl font-black text-white" style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)" }}>
              Quay Lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-transparent relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center mb-8 p-4 rounded-2xl shadow-xl border gap-2 backdrop-blur-xl" style={{ background: "rgba(15, 23, 42, 0.85)", borderColor: "rgba(255,255,255,0.1)" }}>
          <div className="flex justify-start">
            <button onClick={handleExit} className="btn-primary px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm flex items-center gap-1 md:gap-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition">
              <ArrowLeft size={18} /> <span className="hidden sm:inline">Thoát</span>
            </button>
          </div>
          <h2 className="vn-safe-heading text-lg sm:text-2xl md:text-3xl font-black tracking-[0.08em] text-center text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f0d48a 0%, #d4a053 100%)" }}>
            Kết nối lịch sử
          </h2>
          <div className="flex justify-end">
            <div className="text-sm md:text-xl font-black text-amber-400 px-3 py-1.5 md:px-4 md:py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              Điểm: {score}
            </div>
          </div>
        </div>

        <div className="mb-8 text-center font-bold p-4 rounded-xl border w-full animate-fade-in flex flex-col sm:flex-row items-center justify-center gap-3 backdrop-blur-md shadow-lg" style={{ background: "rgba(212,160,83,0.1)", borderColor: "rgba(212,160,83,0.3)", color: "#f0d48a" }}>
          <Lightbulb size={24} className="text-amber-400 drop-shadow-md" />
          <span>
            {roundState.round.title}. {roundState.round.instruction}
          </span>
        </div>

        <div className="mb-6 h-3 w-full rounded-full bg-slate-900/80 border border-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 transition-all duration-500"
            style={{ width: `${((roundIndex + (review ? 1 : 0)) / activeConnectingRounds.length) * 100}%` }}
          />
        </div>

        {notice ? (
          <div
            className={`mb-4 w-full rounded-xl border px-4 py-3 text-sm font-bold ${
              notice.type === "success"
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                : notice.type === "warning"
                  ? "border-amber-400/30 bg-amber-500/10 text-amber-200"
                  : "border-rose-400/30 bg-rose-500/10 text-rose-200"
            }`}
          >
            {notice.text}
          </div>
        ) : null}

        <div className="mb-6 grid w-full gap-4 lg:grid-cols-[1fr_auto_auto]">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-black">
              Tiến độ kéo thả
            </div>
            <div className="mt-2 text-lg font-black text-white">
              {placedCount}/{roundState.cards.length} thẻ đã được đặt
            </div>
            <div className="mt-1 text-sm text-slate-300">
              Kéo đủ toàn bộ thẻ rồi bấm <span className="font-black text-amber-300">Hoàn thành</span>.
            </div>
          </div>
          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-4 text-center">
            <div className="text-[11px] uppercase tracking-[0.2em] text-amber-300/80 font-black">
              Đồng hồ
            </div>
            <div className="mt-2 flex items-center justify-center gap-2 text-2xl font-black text-amber-300">
              <Clock3 size={20} />
              {roundStarted ? `${timeLeft}s` : `${ROUND_TIME}s`}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-center">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-black">
              Lượt
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {roundIndex + 1}/{activeConnectingRounds.length}
            </div>
          </div>
        </div>

        {!roundStarted && !review ? (
          <div className="w-full rounded-[28px] border border-dashed border-sky-400/20 bg-sky-500/10 px-6 py-10 text-center">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-sky-200">
              Bàn kéo thả sẽ mở sau khi bắt đầu
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-100">
              Nhấn <span className="font-black text-sky-200">BẮT ĐẦU</span> để hiện các thẻ dữ kiện, ô đáp án và chạy 15 giây của lượt này.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] w-full gap-4 md:gap-8 items-start">
            <div className="w-full p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-xl border backdrop-blur-xl" style={{ background: "rgba(15, 23, 42, 0.85)", borderColor: "rgba(255,255,255,0.1)" }}>
              <h3 className="text-center font-black mb-4 md:mb-6 text-amber-400 uppercase tracking-widest border-b pb-2 md:pb-4 flex items-center justify-center gap-2 text-sm md:text-base" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <Package size={24} /> Thẻ Dữ Kiện
              </h3>
              <div
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, "")}
                className="mb-4 rounded-2xl border border-dashed border-white/15 bg-slate-900/60 px-4 py-3 text-center text-sm text-slate-300"
              >
                Kéo thẻ về đây nếu muốn bỏ khỏi ô đã đặt.
              </div>
              <div className="flex flex-col gap-4">
                {availableCards.length > 0 ? (
                  availableCards.map((item) => (
                    <div
                      key={item.id}
                      draggable={roundStarted && timerRunning && !review}
                      onDragStart={(event) => handleDragStart(event, item.id)}
                      className={`flex cursor-grab flex-col xl:flex-row items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg font-bold text-center xl:text-left transition-all duration-300 border ${
                        roundStarted && timerRunning && !review ? "bg-[#16213e] text-white hover:bg-white/10" : "bg-slate-800 text-slate-400"
                      }`}
                      style={{ borderColor: "rgba(255,255,255,0.1)" }}
                    >
                      {item.image ? (
                        <div className="w-16 h-16 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden border border-white/20 shadow-md">
                          <img src={item.image} alt={item.content} className="w-full h-full object-cover" />
                        </div>
                      ) : null}
                      <span className="flex-1 text-sm md:text-base leading-snug md:leading-relaxed">{item.content}</span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/60 px-4 py-6 text-center text-sm text-slate-400">
                    Tất cả thẻ đã được đặt vào các ô đích.
                  </div>
                )}
              </div>
            </div>

            <div className="w-full flex flex-col gap-4 md:gap-5">
              <h3 className="text-center font-black mb-1 text-green-400 uppercase tracking-widest border-b pb-2 md:pb-4 flex items-center justify-center gap-2 text-sm md:text-base" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <Target size={24} className="hidden md:block" /> Ô Đáp Án
              </h3>

              {roundState.slots.map((slot) => {
                const placedCard = getCardInSlot(slot.id);
                const slotReview = review?.evaluation?.[slot.id];
                const slotClass = review
                  ? slotReview?.isCorrect
                    ? "border-emerald-400/40 bg-emerald-500/10"
                    : slotReview?.card || (!slotReview?.isDistractor && slotReview?.expected)
                      ? "border-rose-400/40 bg-rose-500/10"
                      : "border-white/10 bg-[#16213e]"
                  : roundStarted && timerRunning
                    ? "border-indigo-400 bg-indigo-900/40 border-dashed"
                    : "border-white/10 bg-[#16213e]";

                return (
                  <div
                    key={slot.id}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => handleDrop(event, slot.id)}
                    className={`relative p-4 md:p-6 rounded-xl md:rounded-2xl transition-all flex flex-col min-h-[120px] w-full text-center border-2 shadow-lg ${slotClass}`}
                  >
                    <span className="font-bold text-white/85 text-sm md:text-lg">{slot.content}</span>
                    <div className="mt-4 flex-1">
                      {placedCard ? (
                        <div
                          draggable={roundStarted && timerRunning && !review}
                          onDragStart={(event) => handleDragStart(event, placedCard.id)}
                          className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 text-left"
                        >
                          {placedCard.image ? (
                            <img src={placedCard.image} alt={placedCard.content} className="mb-3 h-16 w-16 rounded-lg object-cover border border-white/20 shadow-md" />
                          ) : null}
                          <div className="font-bold text-white">{placedCard.content}</div>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-400">
                          Thả thẻ vào đây
                        </div>
                      )}
                    </div>

                    {review && !slotReview?.isCorrect && !slotReview?.isDistractor && slotReview?.expected ? (
                      <div className="mt-3 rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-left text-sm text-amber-100">
                        Đúng phải là: <span className="font-black">{slotReview.expected.content}</span>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 w-full">
          {!review ? (
            !roundStarted ? (
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  onClick={startRound}
                  className="rounded-2xl bg-sky-400 px-5 py-4 text-base font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-sky-300 sm:col-span-2"
                >
                  BẮT ĐẦU
                </button>
                <button
                  disabled
                  className="rounded-2xl border border-white/10 bg-slate-800 px-5 py-4 text-base font-black uppercase tracking-[0.18em] text-white/50"
                >
                  DỪNG
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    disabled
                    className="rounded-2xl bg-sky-400 px-5 py-4 text-base font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-sky-300 disabled:opacity-50 sm:col-span-2"
                  >
                    BẮT ĐẦU
                  </button>
                  <button
                    onClick={toggleTimerRunning}
                    className="rounded-2xl border border-white/10 bg-slate-800 px-5 py-4 text-base font-black uppercase tracking-[0.18em] text-white transition hover:bg-slate-700"
                  >
                    {timerRunning ? "DỪNG" : "TIẾP TỤC"}
                  </button>
                </div>
                <button
                  onClick={() => submitRound(false)}
                  disabled={!timerRunning || !allCardsPlaced}
                  className="w-full rounded-2xl bg-amber-500 px-5 py-4 text-base font-black uppercase tracking-[0.18em] text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-amber-400"
                >
                  Hoàn Thành
                </button>
              </div>
            )
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Kết quả lượt chơi
              </div>
              <div className="mt-3 text-lg font-black text-white">
                Đúng {review.correctCount}/{roundState.cards.length} cặp
              </div>
              <div className="mt-2 text-sm text-slate-300">
                {review.timeUp ? "Lượt này đã được chấm vì hết giờ." : "Lượt này được chấm sau khi bấm Hoàn thành."}
              </div>
              <button
                onClick={moveNext}
                className="mt-5 w-full rounded-2xl bg-emerald-500 px-5 py-4 font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-emerald-400"
              >
                {roundIndex === activeConnectingRounds.length - 1 ? "Kết Thúc Chế Độ" : "Lượt Kế Tiếp"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
