import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Flame, ChevronRight, Clock3, Trophy, Bolt, Play } from "lucide-react";
import { lightningFastQuestions } from "../data/theme4GameData";
import useTheme4ModeData from "../hooks/useTheme4ModeData";
import {
  logGameTelemetry,
  resetModeSessionId,
  saveXp,
  shuffleArray,
} from "../utils/gameHelpers";

/* eslint-disable react-hooks/exhaustive-deps */

const PREP_TIME = 20;
const PLAY_TIME = 60;
const SESSION_TIME = PLAY_TIME;
const TOTAL_QUESTIONS = 30;
const STREAK_FLAME_SLOTS = 10;
const MODE_ID = "lightning-fast";

export default function TimeAttackMode() {
  const navigate = useNavigate();
  const { data: remoteLightningQuestions, loading } = useTheme4ModeData(
    MODE_ID,
    lightningFastQuestions
  );
  const activeQuestionBank =
    Array.isArray(remoteLightningQuestions) && remoteLightningQuestions.length > 0
      ? remoteLightningQuestions
      : lightningFastQuestions;
  const targetQuestionCount = Math.min(TOTAL_QUESTIONS, activeQuestionBank.length);
  const [timeLeft, setTimeLeft] = useState(SESSION_TIME);
  const [prepTimeLeft, setPrepTimeLeft] = useState(PREP_TIME);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [xpSaved, setXpSaved] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [phase, setPhase] = useState("intro");
  const [timerRunning, setTimerRunning] = useState(false);
  const startedAtRef = useRef(Date.now());
  const sessionActiveRef = useRef(false);
  const autoAdvanceRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  const buildQuestionSet = () =>
    shuffleArray(activeQuestionBank).slice(0, targetQuestionCount);

  const endSession = (payload) => {
    if (!sessionActiveRef.current) return;
    logGameTelemetry(MODE_ID, "session_end", payload);
    sessionActiveRef.current = false;
  };

  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) {
        window.clearTimeout(autoAdvanceRef.current);
      }
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (loading || targetQuestionCount === 0) return;

    sessionActiveRef.current = false;
    setQuestions(buildQuestionSet());
    setCurrentIndex(0);
    setTimeLeft(PLAY_TIME);
    setPrepTimeLeft(PREP_TIME);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setFeedback(null);
    setFinished(false);
    setXpSaved(false);
    setHasStarted(false);
    setPhase("intro");
    setTimerRunning(false);
    setSessionReady(true);
  }, [loading, targetQuestionCount, activeQuestionBank]);


  useEffect(() => {
    if (!timerRunning || finished) return;

    if (phase === "prep") {
      if (prepTimeLeft <= 0) {
        setTimerRunning(false);
        setPhase("play-ready");
        return;
      }

      const timer = window.setTimeout(() => {
        setPrepTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => window.clearTimeout(timer);
    }

    if (phase === "play") {
      if (timeLeft <= 0) {
        setTimerRunning(false);
        setFinished(true);
        setPhase("finished");
        return;
      }

      const timer = window.setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [finished, phase, prepTimeLeft, timeLeft, timerRunning]);


  useEffect(() => {
    if (finished && phase === "finished" && !xpSaved) {
      endSession({
        solved: true,
        score,
        bestStreak,
        durationMs: Date.now() - startedAtRef.current,
      });
      saveXp(score);
      setXpSaved(true);
    }
  }, [bestStreak, finished, phase, score, xpSaved]);

  const startMode = () => {
    if (phase === "intro") {
      resetModeSessionId(MODE_ID);
      startedAtRef.current = Date.now();
      sessionActiveRef.current = true;
      logGameTelemetry(MODE_ID, "session_start", {
        totalQuestions: targetQuestionCount,
        prepSeconds: PREP_TIME,
        playSeconds: PLAY_TIME,
      });
      setQuestions(buildQuestionSet());
      setCurrentIndex(0);
      setPrepTimeLeft(PREP_TIME);
      setTimeLeft(PLAY_TIME);
      setScore(0);
      setStreak(0);
      setBestStreak(0);
      setFeedback(null);
      setFinished(false);
      setXpSaved(false);
      setHasStarted(false);
      setPhase("prep");
      setTimerRunning(true);
      return;
    }

    if (phase === "prep") {
      setTimerRunning(true);
      return;
    }

    if (phase === "play-ready") {
      setFeedback(null);
      setHasStarted(true);
      setPhase("play");
      setTimeLeft(PLAY_TIME);
      setTimerRunning(true);
      return;
    }

    if (phase === "play") {
      setTimerRunning(true);
    }
  };

  const stopMode = () => {
    if (autoAdvanceRef.current) {
      window.clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
    setTimerRunning(false);
  };

  const toggleRunState = () => {
    if (timerRunning) {
      stopMode();
      return;
    }
    startMode();
  };

  const handleExit = async () => {
    endSession({
      solved: false,
      score,
      bestStreak,
      durationMs: Date.now() - startedAtRef.current,
    });
    if ((phase === "prep" || phase === "play" || phase === "play-ready") && !finished && score > 0) {
      await saveXp(score);
    }
    navigate("/modes");
  };

  const handleAnswer = (option) => {
    if (!hasStarted || phase !== "play" || !timerRunning || !currentQuestion || feedback) return;
    const correct = option === currentQuestion.correctAnswer;

    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct,
      index: currentIndex,
      timeLeft,
      streak: correct ? streak + 1 : 0,
    });

    if (correct) {
      const bonus = 10 + streak * 2;
      const nextStreak = streak + 1;
      setScore((prev) => prev + bonus);
      setStreak(nextStreak);
      setBestStreak((prev) => Math.max(prev, nextStreak));
      setFeedback({
        correct: true,
        answer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation,
        message: "Chính xác.",
        delta: bonus,
        selectedOption: option,
      });
      
      // Auto advance after correct answer in "Nhanh như chớp" to keep pace
      autoAdvanceRef.current = window.setTimeout(nextQuestion, 600);
      return;
    }

    setStreak(0);
    setFeedback({
      correct: false,
      answer: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation,
        message: "Chưa đúng.",
      delta: 0,
      selectedOption: option,
    });
  };

  const nextQuestion = () => {
    if (autoAdvanceRef.current) {
      window.clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
    if (currentIndex === questions.length - 1) {
      setTimerRunning(false);
      setFinished(true);
      setPhase("finished");
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setFeedback(null);
  };

  const restartMode = () => {
    endSession({
      solved: false,
      score,
      bestStreak,
      durationMs: Date.now() - startedAtRef.current,
      reason: "restart",
    });
    setQuestions(buildQuestionSet());
    setCurrentIndex(0);
    setTimeLeft(PLAY_TIME);
    setPrepTimeLeft(PREP_TIME);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setFeedback(null);
    setFinished(false);
    setXpSaved(false);
    setHasStarted(false);
    setPhase("intro");
    setTimerRunning(false);
    setSessionReady(true);
  };

  if (loading || (targetQuestionCount > 0 && !sessionReady)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-300">
        Đang tải bộ câu hỏi nhanh...
      </div>
    );
  }

  if ((phase === "intro" || phase === "prep" || phase === "play-ready") && !finished) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#78350f_0%,#020617_72%)] px-4 py-8 text-white flex items-center justify-center">
        <div className="w-full max-w-3xl rounded-[32px] border border-amber-400/20 bg-slate-900/90 p-6 sm:p-8 shadow-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/15 text-amber-300">
            <Bolt size={38} />
          </div>
          <h1 className="vn-safe-heading mt-5 text-3xl sm:text-4xl font-black tracking-[0.08em] text-amber-300">
            Nhanh như chớp
          </h1>
          <p className="mt-4 text-slate-300">
            {phase === "play-ready"
              ? "Lần 2: bấm BẮT ĐẦU để vào trò chơi. Chỉ từ lúc này câu hỏi mới hiện ra và 60 giây mới bắt đầu chạy."
              : "Lần 1: bấm BẮT ĐẦU để chạy 20 giây chuẩn bị. Hết 20 giây hệ thống sẽ tách sang màn bắt đầu lần 2, không gộp chung thời gian."}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Số Câu
              </div>
              <div className="mt-2 text-3xl font-black text-white">{targetQuestionCount}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                {phase === "play-ready" ? "Lần 2" : "Lần 1"}
              </div>
              <div className="mt-2 text-3xl font-black text-amber-300">
                {phase === "prep" ? `${prepTimeLeft}s` : phase === "play-ready" ? `${PLAY_TIME}s` : `${PREP_TIME}s`}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Điều Khiển
              </div>
              <div className="mt-2 text-lg font-black text-white">
                {timerRunning ? "Đang chạy" : phase === "play-ready" ? "Chờ bắt đầu lần 2" : "Bắt đầu thủ công"}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={startMode}
              disabled={timerRunning || phase === "prep"}
              className="flex-1 rounded-2xl bg-amber-500 px-5 py-4 font-black text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
            >
              <span className="inline-flex items-center gap-2">
                <Play size={18} />
                BẮT ĐẦU
              </span>
            </button>
            <button
              onClick={toggleRunState}
              disabled={phase === "intro" || phase === "play-ready"}
              className="flex-1 rounded-2xl border border-white/10 bg-slate-800 px-5 py-4 font-black text-white transition hover:bg-slate-700 disabled:opacity-50"
            >
              {timerRunning ? "DỪNG" : phase === "prep" || phase === "play" ? "TIẾP TỤC" : "DỪNG"}
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

  if (!currentQuestion && phase === "play" && !finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-300">
        Chưa có bộ câu hỏi hợp lệ cho chế độ chơi này.
      </div>
    );
  }

  if (finished || phase === "finished") {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#451a03_0%,#020617_68%)] px-4 py-8 text-white flex items-center justify-center">
        <div className="w-full max-w-3xl rounded-[32px] border border-amber-400/20 bg-slate-900/90 p-6 sm:p-8 shadow-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
            <Trophy size={40} />
          </div>
          <h1 className="vn-safe-heading mt-5 text-3xl sm:text-4xl font-black tracking-[0.08em] text-amber-300">
            Nhanh như chớp
          </h1>
          <p className="mt-4 text-slate-300">
            Bạn đã hoàn thành lượt hỏi đáp nhanh với 2 pha tách biệt: 20 giây chuẩn bị và 60 giây vào trò chơi.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Tổng Điểm
              </div>
              <div className="mt-2 text-3xl font-black text-amber-300">{score}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Số Câu
              </div>
              <div className="mt-2 text-3xl font-black text-white">
                {questions.length}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Chuỗi Tốt Nhất
              </div>
              <div className="mt-2 text-3xl font-black text-white">{bestStreak}</div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={restartMode}
              className="flex-1 rounded-2xl bg-amber-500 px-5 py-4 font-black text-slate-950 transition hover:bg-amber-400"
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#78350f_0%,#020617_72%)] px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
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
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-amber-300">
              <Bolt size={16} />
              Nhanh như chớp
            </div>
            <h1 className="vn-safe-heading mt-3 text-2xl sm:text-3xl font-black tracking-[0.08em] text-white">
              Hỏi Nhanh, Đáp Nhanh
            </h1>
          </div>

          <div className="flex items-center justify-center gap-3 md:justify-end">
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3 text-center">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Tiến Độ
              </div>
              <div className="text-lg font-black text-white">
                {currentIndex + 1}/{questions.length}
              </div>
            </div>
            <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-center">
              <div className="text-[11px] uppercase tracking-[0.2em] text-amber-300/80">
                Điểm
              </div>
              <div className="text-lg font-black text-amber-300">{score}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-xl">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
              Hai Mốc Thời Gian
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  Lần 1: Chuẩn bị
                </div>
                <div className="mt-2 flex items-center gap-2 text-3xl font-black text-amber-300">
                  <Clock3 size={20} />
                  {prepTimeLeft}s / {PREP_TIME}s
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  Lần 2: Vào game
                </div>
                <div className="mt-2 flex items-center gap-2 text-3xl font-black text-amber-300">
                  <Clock3 size={20} />
                  {timeLeft}s / {PLAY_TIME}s
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  disabled
                  className="rounded-2xl bg-amber-500 px-5 py-4 font-black text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
                >
                  BẮT ĐẦU
                </button>
                <button
                  onClick={toggleRunState}
                  className="rounded-2xl border border-white/10 bg-slate-800 px-5 py-4 font-black text-white transition hover:bg-slate-700 disabled:opacity-50"
                >
                  {timerRunning ? "DỪNG" : "TIẾP TỤC"}
                </button>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  Chuỗi lửa
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {Array.from({ length: STREAK_FLAME_SLOTS }, (_, i) => (
                    <Flame
                      key={i}
                      size={22}
                      className={
                        i < streak
                          ? "text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.9)]"
                          : "text-slate-700 opacity-40"
                      }
                      strokeWidth={i < streak ? 2 : 1}
                    />
                  ))}
                </div>
                <div className="mt-2 text-2xl font-black text-white tabular-nums">{streak} liên tiếp</div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-xl">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
              Câu {currentIndex + 1}
            </div>

            <div className="mt-5 rounded-[28px] border border-amber-400/10 bg-slate-950/70 p-6">
              <h2 className="text-2xl font-bold leading-relaxed text-white">
                {currentQuestion.content}
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {currentQuestion.options.map((option, index) => {
                  const isChosen = feedback?.selectedOption === option;

                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={Boolean(feedback) || !timerRunning}
                      className={`rounded-2xl border p-4 text-left transition disabled:opacity-50 ${
                        feedback
                          ? isChosen && feedback.correct
                            ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
                            : isChosen
                              ? "border-rose-400/30 bg-rose-500/15 text-rose-100"
                              : "border-white/10 bg-slate-800 text-slate-400"
                          : "border-white/10 bg-slate-800 text-white hover:border-amber-400/30 hover:bg-slate-700"
                      }`}
                    >
                      <div className="text-xs font-black uppercase tracking-[0.24em] text-amber-300/80">
                        Đáp án {String.fromCharCode(65 + index)}
                      </div>
                      <div className="mt-2 text-lg font-semibold">{option}</div>
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div
                  className={`mt-5 rounded-2xl border px-5 py-4 ${
                    feedback.correct
                      ? "border-emerald-400/30 bg-emerald-500/10"
                      : "border-rose-400/30 bg-rose-500/10"
                  }`}
                >
                  <div className="text-lg font-black text-white">{feedback.message}</div>
                  <div className="mt-2 text-sm text-slate-300">
                    Đáp án và giải thích sẽ chỉ được công bố khi kết thúc chế độ.
                  </div>
                  {feedback.correct && (
                    <div className="mt-3 text-sm font-bold text-emerald-300">
                      +{feedback.delta} XP
                    </div>
                  )}
                  <button
                    onClick={nextQuestion}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-black uppercase tracking-[0.18em] text-slate-900 transition hover:bg-amber-300"
                  >
                    {currentIndex === questions.length - 1 ? "Kết Thúc Chế Độ" : "Tiếp Theo"}
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
