import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Flame, ChevronRight, Clock3, Trophy, Bolt } from "lucide-react";
import { lightningFastQuestions } from "../data/theme4GameData";
import useTheme4ModeData from "../hooks/useTheme4ModeData";
import {
  logGameTelemetry,
  resetModeSessionId,
  saveXp,
  shuffleArray,
} from "../utils/gameHelpers";

/** 60 giây theo mô tả + 10 giây nhịp “thêm” cho lớp vừa kịp 30 câu */
const SESSION_TIME = 70;
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
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [xpSaved, setXpSaved] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const startedAtRef = useRef(Date.now());

  const currentQuestion = questions[currentIndex];

  const buildQuestionSet = () =>
    shuffleArray(activeQuestionBank).slice(0, targetQuestionCount);

  useEffect(() => {
    if (loading || targetQuestionCount === 0) return;

    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    logGameTelemetry(MODE_ID, "session_start", { totalQuestions: targetQuestionCount });
    setQuestions(buildQuestionSet());
    setCurrentIndex(0);
    setTimeLeft(SESSION_TIME);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setFeedback(null);
    setFinished(false);
    setXpSaved(false);
    setSessionReady(true);
  }, [loading, targetQuestionCount, activeQuestionBank]);


  useEffect(() => {
    if (finished) return;

    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [finished, timeLeft]);


  useEffect(() => {
    if (finished && !xpSaved) {
      logGameTelemetry(MODE_ID, "session_end", {
        solved: true,
        score,
        bestStreak,
        durationMs: Date.now() - startedAtRef.current,
      });
      saveXp(score);
      setXpSaved(true);
    }
  }, [bestStreak, finished, score, xpSaved]);

  const handleExit = async () => {
    logGameTelemetry(MODE_ID, "session_end", {
      solved: false,
      score,
      bestStreak,
      durationMs: Date.now() - startedAtRef.current,
    });
    if (!finished && score > 0) await saveXp(score);
    navigate("/modes");
  };

  const handleAnswer = (option) => {
    if (!currentQuestion || feedback) return;
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
      setTimeout(nextQuestion, 600);
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
    if (currentIndex === questions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setFeedback(null);
  };

  const restartMode = () => {
    logGameTelemetry(MODE_ID, "session_end", {
      solved: false,
      score,
      bestStreak,
      durationMs: Date.now() - startedAtRef.current,
      reason: "restart",
    });
    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    logGameTelemetry(MODE_ID, "session_start", {
      totalQuestions: targetQuestionCount,
      replay: true,
    });
    setQuestions(buildQuestionSet());
    setCurrentIndex(0);
    setTimeLeft(SESSION_TIME);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setFeedback(null);
    setFinished(false);
    setXpSaved(false);
    setSessionReady(true);
  };

  if (loading || (targetQuestionCount > 0 && !sessionReady)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-300">
        Đang tải bộ câu hỏi nhanh...
      </div>
    );
  }

  if (!currentQuestion && !finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-300">
        Chưa có bộ câu hỏi hợp lệ cho chế độ chơi này.
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#451a03_0%,#020617_68%)] px-4 py-8 text-white flex items-center justify-center">
        <div className="w-full max-w-3xl rounded-[32px] border border-amber-400/20 bg-slate-900/90 p-6 sm:p-8 shadow-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
            <Trophy size={40} />
          </div>
          <h1 className="mt-5 text-3xl sm:text-4xl font-black uppercase tracking-[0.18em] text-amber-300">
            Nhanh Như Chớp
          </h1>
          <p className="mt-4 text-slate-300">
            Bạn đã hoàn thành tối đa {targetQuestionCount} câu nhận biết trong nhịp thời gian nhanh của chế độ này, với chuỗi lửa theo số câu đúng liên tiếp.
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
              Nhanh Như Chớp
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-black uppercase tracking-[0.18em] text-white">
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
              Đồng Hồ Thời Gian
            </div>

            <div className="mt-6 flex flex-col items-center">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[10px] border-amber-400/20 bg-slate-950">
                <div className="absolute inset-4 rounded-full border border-white/10" />
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-300">
                    <Clock3 size={20} />
                  </div>
                  <div className="text-5xl font-black text-amber-300">{timeLeft}</div>
                  <div className="mt-1 text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                    Giây
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
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
                  const isCorrect = option === currentQuestion.correctAnswer;
                  const isChosen = feedback?.selectedOption === option;

                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={Boolean(feedback)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        feedback
                          ? isCorrect
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
                    Đáp án đúng:{" "}
                    <span className="font-bold text-amber-300">
                      {feedback.answer}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-300">
                    {feedback.explanation}
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
