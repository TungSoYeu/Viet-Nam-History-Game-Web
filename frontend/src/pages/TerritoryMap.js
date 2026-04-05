/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock3, ImageIcon, Lightbulb, Trophy } from "lucide-react";
import { picturePuzzleItems } from "../data/theme4GameData";
import useTheme4ModeData from "../hooks/useTheme4ModeData";
import {
  logGameTelemetry,
  matchesAnswer,
  resetModeSessionId,
  saveXp,
  shuffleArray,
} from "../utils/gameHelpers";

const MODE_ID = "picture-puzzle";
const QUESTION_TIME = 15;

export default function TerritoryMap() {
  const navigate = useNavigate();
  const { data: remotePicturePuzzleItems, loading } = useTheme4ModeData(
    MODE_ID,
    picturePuzzleItems
  );
  const activePicturePuzzleItems =
    Array.isArray(remotePicturePuzzleItems) && remotePicturePuzzleItems.length > 0
      ? remotePicturePuzzleItems
      : picturePuzzleItems;
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [xpSaved, setXpSaved] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [sessionReady, setSessionReady] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [questionPhase, setQuestionPhase] = useState("ready");
  const [timerRunning, setTimerRunning] = useState(false);
  const startedAtRef = useRef(Date.now());

  const currentItem = items[currentIndex];
  const computedHints = useMemo(() => {
    if (!currentItem) return [];
    const normalized = currentItem.answer.trim();
    const words = normalized.split(/\s+/).filter(Boolean);
    const compact = normalized.replace(/\s+/g, "");
    return [
      `Tên đáp án có ${words.length} từ.`,
      `Đáp án bắt đầu bằng chữ "${normalized.charAt(0)}".`,
      `Đáp án có ${compact.length} ký tự (không tính khoảng trắng).`,
    ];
  }, [currentItem]);

  useEffect(() => {
    if (loading || activePicturePuzzleItems.length === 0) return;

    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    logGameTelemetry(MODE_ID, "session_start", {
      totalQuestions: activePicturePuzzleItems.length,
    });
    setItems(shuffleArray(activePicturePuzzleItems));
    setCurrentIndex(0);
    setSelectedOption("");
    setFeedback(null);
    setScore(0);
    setCorrectCount(0);
    setFinished(false);
    setXpSaved(false);
    setHintLevel(0);
    setTimeLeft(QUESTION_TIME);
    setQuestionPhase("ready");
    setTimerRunning(false);
    setSessionReady(true);
  }, [activePicturePuzzleItems, loading]);

  useEffect(() => {
    if (finished && !xpSaved) {
      logGameTelemetry(MODE_ID, "session_end", {
        solved: true,
        score,
        correctCount,
        durationMs: Date.now() - startedAtRef.current,
      });
      saveXp(score);
      setXpSaved(true);
    }
  }, [correctCount, finished, score, xpSaved]);

  useEffect(() => {
    if (questionPhase !== "active" || !timerRunning || feedback || finished || timeLeft <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [feedback, finished, questionPhase, timeLeft]);

  useEffect(() => {
    if (questionPhase !== "active" || !timerRunning || feedback || finished || timeLeft > 0) return;
    handleAnswer("", "time_up");
  }, [feedback, finished, questionPhase, timeLeft, timerRunning]);

  const handleExit = async () => {
    logGameTelemetry(MODE_ID, "session_end", {
      solved: false,
      score,
      correctCount,
      durationMs: Date.now() - startedAtRef.current,
    });
    if (!finished && score > 0) await saveXp(score);
    navigate("/modes");
  };

  const startPuzzle = () => {
    if (!currentItem || finished) return;
    setSelectedOption("");
    setFeedback(null);
    setTimeLeft(QUESTION_TIME);
    setQuestionPhase("active");
    setTimerRunning(true);
    logGameTelemetry(MODE_ID, "question_started", {
      index: currentIndex,
      durationSeconds: QUESTION_TIME,
    });
  };

  const handleAnswer = (option, reason = "manual") => {
    if (!currentItem || feedback || questionPhase !== "active" || !timerRunning) return;
    const acceptedAnswers = currentItem.acceptedAnswers?.length
      ? currentItem.acceptedAnswers
      : [currentItem.answer];
    const isCorrect = matchesAnswer(option, acceptedAnswers);
    setSelectedOption(option);
    setFeedback({
      correct: isCorrect,
      timedOut: reason === "time_up",
      answer: currentItem.acceptedAnswers?.[0] || currentItem.answer,
      explanation: currentItem.explanation,
    });
    setQuestionPhase("review");
    setTimerRunning(false);
    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct: isCorrect,
      index: currentIndex,
      hintLevel,
      reason,
      scoreAfter: isCorrect ? score + 10 : score,
    });

    if (isCorrect) {
      setScore((prev) => prev + 10);
      setCorrectCount((prev) => prev + 1);
    }
  };

  const nextPuzzle = () => {
    if (currentIndex === items.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedOption("");
    setFeedback(null);
    setHintLevel(0);
    setTimeLeft(QUESTION_TIME);
    setQuestionPhase("ready");
    setTimerRunning(false);
  };

  const restartMode = () => {
    logGameTelemetry(MODE_ID, "session_end", {
      solved: false,
      score,
      correctCount,
      durationMs: Date.now() - startedAtRef.current,
      reason: "restart",
    });
    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    logGameTelemetry(MODE_ID, "session_start", {
      totalQuestions: activePicturePuzzleItems.length,
      replay: true,
    });
    setItems(shuffleArray(activePicturePuzzleItems));
    setCurrentIndex(0);
    setSelectedOption("");
    setFeedback(null);
    setScore(0);
    setCorrectCount(0);
    setFinished(false);
    setXpSaved(false);
    setHintLevel(0);
    setTimeLeft(QUESTION_TIME);
    setQuestionPhase("ready");
    setTimerRunning(false);
    setSessionReady(true);
  };

  const toggleTimerRunning = () => {
    setTimerRunning((prev) => !prev);
  };

  if (loading || (activePicturePuzzleItems.length > 0 && !sessionReady)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-300">
        Đang chuẩn bị phần đuổi hình bắt chữ...
      </div>
    );
  }

  if (!currentItem && !finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-300">
        Chưa có bộ câu hỏi hợp lệ cho chế độ chơi này.
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1d4ed8_0%,#020617_72%)] px-4 py-8 text-white flex items-center justify-center">
        <div className="w-full max-w-3xl rounded-[32px] border border-sky-400/20 bg-slate-900/90 p-6 sm:p-8 shadow-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
            <Trophy size={40} />
          </div>
          <h1 className="vn-safe-heading mt-5 text-3xl sm:text-4xl font-black tracking-[0.08em] text-sky-200">
            Đuổi hình bắt chữ
          </h1>
          <p className="mt-4 text-slate-300">
            Bạn đã hoàn thành toàn bộ {items.length} câu ghép từ khóa thành đáp án lịch sử hoàn chỉnh.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Đúng
              </div>
              <div className="mt-2 text-3xl font-black text-white">
                {correctCount}/{items.length}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Số Câu
              </div>
              <div className="mt-2 text-3xl font-black text-white">{items.length}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Điểm
              </div>
              <div className="mt-2 text-3xl font-black text-amber-300">{score}</div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={restartMode}
              className="flex-1 rounded-2xl bg-sky-400 px-5 py-4 font-black text-slate-950 transition hover:bg-sky-300"
            >
              Chơi Lại
            </button>
            <button
              onClick={() => navigate("/modes")}
              className="flex-1 rounded-2xl border border-white/10 bg-slate-800 px-5 py-4 font-black text-white transition hover:bg-slate-700"
            >
              Về Chủ Đề 4
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0f766e_0%,#020617_72%)] px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="grid gap-4 rounded-[28px] border border-white/10 bg-slate-900/80 p-4 shadow-2xl md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="flex justify-center md:justify-start">
            <button
              onClick={handleExit}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/5"
            >
              <ArrowLeft size={18} />
              Thoát Với {score} XP
            </button>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-sky-200">
              <ImageIcon size={16} />
              Đuổi hình bắt chữ
            </div>
            <h1 className="vn-safe-heading mt-3 text-2xl sm:text-3xl font-black tracking-[0.08em] text-white">
              Xác Định Từ Khóa, Ghép Thành Đáp Án
            </h1>
          </div>

          <div className="flex items-center justify-center gap-3 md:justify-end">
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3 text-center">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Tiến Độ
              </div>
              <div className="text-lg font-black text-white">
                {currentIndex + 1}/{items.length}
              </div>
            </div>
            <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-center">
              <div className="text-[11px] uppercase tracking-[0.2em] text-sky-200/80">
                Điểm
              </div>
              <div className="text-lg font-black text-sky-200">{score}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-xl">
            {questionPhase === "ready" && !feedback ? (
              <div className="rounded-[28px] border border-dashed border-sky-400/20 bg-sky-500/10 p-8 text-center">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-sky-200">
                  Câu hỏi đang chờ bắt đầu
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-100">
                  Ảnh và câu hỏi sẽ chỉ hiện ra sau khi bấm <span className="font-black text-sky-200">BẮT ĐẦU</span>.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-5 rounded-[24px] border border-amber-400/20 bg-amber-500/10 p-5">
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">
                    Câu Hỏi
                  </div>
                  <p className="mt-3 text-base font-semibold leading-7 text-white sm:text-lg">
                    {currentItem.prompt || "Hãy xác định từ khóa của từng hình rồi ghép thành đáp án lịch sử hoàn chỉnh."}
                  </p>
                </div>
                <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70 p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {currentItem.images.map((img, idx) => (
                      <div key={idx} className="aspect-square bg-slate-900 rounded-2xl overflow-hidden border border-white/5 p-2">
                        <img
                          src={img}
                          alt={`Mảnh ghép ${idx + 1}`}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/60 p-5">
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-amber-300">
                    <Lightbulb size={16} />
                    Gợi Ý
                  </div>
                  <p className="mt-4 text-base leading-7 text-slate-200">
                    Hãy tìm từ khóa của từng hình rồi ghép chúng thành cụm từ lịch sử hoàn chỉnh.
                  </p>
                  <div className="mt-4 space-y-2">
                    {hintLevel > 0 ? (
                      computedHints.slice(0, hintLevel).map((hint, index) => (
                        <div
                          key={hint}
                          className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-100"
                        >
                          Gợi ý tầng {index + 1}: {hint}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-400">
                        Chưa mở gợi ý.
                      </div>
                    )}
                  </div>
                  {questionPhase === "active" && !feedback && hintLevel < computedHints.length ? (
                    <button
                      onClick={() => {
                        const nextLevel = Math.min(computedHints.length, hintLevel + 1);
                        setHintLevel(nextLevel);
                        logGameTelemetry(MODE_ID, "hint_used", {
                          index: currentIndex,
                          level: nextLevel,
                        });
                      }}
                      disabled={!timerRunning}
                      className="mt-4 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-amber-200 transition hover:bg-amber-500/20 disabled:opacity-50"
                    >
                      Mở Gợi Ý Tầng {hintLevel + 1}
                    </button>
                  ) : null}
                </div>
              </>
            )}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-xl">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
              Bảng Đáp Án
            </div>
            <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-4 text-center">
              <div className="text-[11px] uppercase tracking-[0.2em] text-amber-300/80 font-black">
                Đồng hồ mỗi câu
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 text-2xl font-black text-amber-300">
                <Clock3 size={20} />
                {questionPhase === "ready" ? `${QUESTION_TIME}s` : `${timeLeft}s`}
              </div>
            </div>
            <div className="mt-5">
              {!feedback && questionPhase === "ready" ? (
                <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-5">
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-sky-200">
                    Sẵn sàng ghép đáp án
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-100">
                    Bấm bắt đầu để mở 15 giây suy luận cho câu này.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      onClick={startPuzzle}
                      className="rounded-2xl bg-sky-400 py-4 font-black uppercase tracking-widest text-slate-900 transition hover:bg-sky-300"
                    >
                      BẮT ĐẦU
                    </button>
                    <button
                      disabled
                      className="rounded-2xl border border-white/10 bg-slate-800 py-4 font-black uppercase tracking-widest text-white/50"
                    >
                      DỪNG
                    </button>
                  </div>
                </div>
              ) : null}

              {!feedback && questionPhase === "active" ? (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      disabled
                      className="rounded-2xl bg-sky-400 py-4 font-black uppercase tracking-widest text-slate-900 transition hover:bg-sky-300 disabled:opacity-50"
                    >
                      BẮT ĐẦU
                    </button>
                    <button
                      onClick={toggleTimerRunning}
                      className="rounded-2xl border border-white/10 bg-slate-800 py-4 font-black uppercase tracking-widest text-white transition hover:bg-slate-700"
                    >
                      {timerRunning ? "DỪNG" : "TIẾP TỤC"}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAnswer(selectedOption, "manual")}
                    placeholder="Nhập đáp án lịch sử hoàn chỉnh..."
                    disabled={!timerRunning}
                    className="w-full rounded-2xl border border-white/10 bg-slate-800 px-5 py-4 text-lg font-bold text-white outline-none focus:border-sky-400 disabled:opacity-60"
                  />
                  <button
                    onClick={() => handleAnswer(selectedOption, "manual")}
                    disabled={!timerRunning || !selectedOption.trim()}
                    className="w-full rounded-2xl bg-sky-500 py-4 font-black uppercase tracking-widest text-slate-900 transition hover:bg-sky-400 disabled:opacity-50"
                  >
                    Xác Nhận Đáp Án
                  </button>
                </div>
              ) : null}
            </div>

            {feedback && (
              <div
                className={`mt-5 rounded-2xl border px-5 py-4 ${
                  feedback.correct
                    ? "border-emerald-400/30 bg-emerald-500/10"
                    : "border-rose-400/30 bg-rose-500/10"
                }`}
              >
                <div className="text-lg font-black text-white">
                  {feedback.correct
                    ? "Ghép đúng đáp án lịch sử."
                    : feedback.timedOut
                      ? "Hết thời gian cho câu này."
                      : "Ghép chưa đúng đáp án."}
                </div>
                <div className="mt-2 text-sm text-slate-300">
                  Đáp án và giải thích sẽ chỉ được công bố khi kết thúc chế độ.
                </div>
                <button
                  onClick={nextPuzzle}
                  className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-black uppercase tracking-[0.18em] text-slate-900 transition hover:bg-sky-200"
                >
                  {currentIndex === items.length - 1 ? "Kết Thúc Chế Độ" : "Hình Kế Tiếp"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
