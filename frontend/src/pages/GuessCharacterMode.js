/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Clock3,
  History,
  ScanSearch,
  Search,
  Trophy,
  XCircle,
  ZoomIn,
} from "lucide-react";
import { historicalRecognitionItems } from "../data/theme4GameData";
import useTheme4ModeData from "../hooks/useTheme4ModeData";
import {
  logGameTelemetry,
  matchesAnswer,
  resetModeSessionId,
  saveXp,
  shuffleArray,
} from "../utils/gameHelpers";

const recognitionTypeLabels = {
  image: "Hình ảnh",
  diagram: "Lược đồ",
  keyword_hint: "Từ khóa",
};

const recognitionSubmodes = [
  {
    id: "visual-to-keyword",
    title: "Nhận diện từ khóa thông qua hình ảnh, lược đồ",
    shortTitle: "Hình ảnh, lược đồ -> từ khóa",
    description:
      "Quan sát cụm ảnh hoặc lược đồ rồi xác định chính xác nhân vật, sự kiện, địa danh hoặc phong trào lịch sử.",
    summary:
      "Nhánh này dùng tư liệu trực quan làm dữ kiện chính, phù hợp cho dạng quan sát và suy luận nhanh.",
    buttonLabel: "Chọn Nhánh Hình Ảnh",
    accent: "linear-gradient(135deg, #22d3ee, #2dd4bf)",
    filter: (item) => item?.type !== "keyword_hint",
    Icon: ScanSearch,
  },
  {
    id: "keyword-to-visual",
    title: "Nhận diện hình ảnh thông qua từ khóa",
    shortTitle: "Từ khóa -> hình ảnh",
    description:
      "Đọc hệ thống từ khóa gợi ý rồi xác định đúng hình ảnh, nhân vật, công trình hoặc địa danh lịch sử tương ứng.",
    summary:
      "Nhánh này tập trung vào suy luận từ hệ thống từ khóa, giúp học sinh nối kiến thức khái niệm với hình ảnh cụ thể.",
    buttonLabel: "Chọn Nhánh Từ Khóa",
    accent: "linear-gradient(135deg, #f59e0b, #f97316)",
    filter: (item) => item?.type === "keyword_hint",
    Icon: History,
  },
];

const MODE_ID = "historical-recognition";
const QUESTION_TIME = 15;

const getVisualAssets = (item) => {
  if (!item) return [];
  if (Array.isArray(item.imageUrls) && item.imageUrls.filter(Boolean).length > 0) {
    return item.imageUrls.filter(Boolean);
  }
  return item.imageUrl ? [item.imageUrl] : [];
};

export default function GuessCharacterMode() {
  const navigate = useNavigate();
  const { data: activeRecognitionItems, loading } = useTheme4ModeData(
    MODE_ID,
    historicalRecognitionItems
  );

  const [selectedSubmodeId, setSelectedSubmodeId] = useState("");
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [questionPhase, setQuestionPhase] = useState("ready");
  const [timerRunning, setTimerRunning] = useState(false);

  const startedAtRef = useRef(Date.now());
  const sessionActiveRef = useRef(false);

  const sourceItems = Array.isArray(activeRecognitionItems)
    ? activeRecognitionItems
    : [];

  const availableSubmodes = useMemo(
    () =>
      recognitionSubmodes
        .map((submode) => ({
          ...submode,
          items: sourceItems.filter(submode.filter),
        }))
        .filter((submode) => submode.items.length > 0),
    [sourceItems]
  );

  const selectedSubmode = useMemo(
    () =>
      availableSubmodes.find((submode) => submode.id === selectedSubmodeId) || null,
    [availableSubmodes, selectedSubmodeId]
  );

  const currentItem = items[currentIndex];
  const currentImages = useMemo(() => getVisualAssets(currentItem), [currentItem]);
  const progressLabel = useMemo(
    () => `${Math.min(currentIndex + 1, items.length)}/${items.length}`,
    [currentIndex, items.length]
  );

  const resetSessionState = () => {
    setItems([]);
    setCurrentIndex(0);
    setGuess("");
    setFeedback(null);
    setScore(0);
    setFinished(false);
    setActiveImage("");
    setTimeLeft(QUESTION_TIME);
    setQuestionPhase("ready");
    setTimerRunning(false);
  };

  const endSession = async (payload = {}) => {
    if (!sessionActiveRef.current) return;
    sessionActiveRef.current = false;
    logGameTelemetry(MODE_ID, "session_end", {
      score,
      solved: finished,
      submodeId: selectedSubmodeId || null,
      durationMs: Date.now() - startedAtRef.current,
      answered: currentIndex + (feedback ? 1 : 0),
      ...payload,
    });
  };

  const initializeSession = (sourceSubmode, replay = false) => {
    if (!sourceSubmode || !Array.isArray(sourceSubmode.items)) return;

    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    sessionActiveRef.current = true;
    logGameTelemetry(MODE_ID, "session_start", {
      totalQuestions: sourceSubmode.items.length,
      replay,
      submodeId: sourceSubmode.id,
      submodeTitle: sourceSubmode.title,
    });
    setItems(shuffleArray(sourceSubmode.items));
    setCurrentIndex(0);
    setGuess("");
    setFeedback(null);
    setScore(0);
    setFinished(false);
    setActiveImage("");
    setTimeLeft(QUESTION_TIME);
    setQuestionPhase("ready");
    setTimerRunning(false);
  };

  useEffect(() => {
    if (selectedSubmodeId && !selectedSubmode) {
      setSelectedSubmodeId("");
      resetSessionState();
    }
  }, [selectedSubmode, selectedSubmodeId]);

  useEffect(() => {
    if (!selectedSubmode) return;
    initializeSession(selectedSubmode);
  }, [selectedSubmode]);

  useEffect(() => {
    if (questionPhase !== "active" || !timerRunning || feedback || finished || timeLeft <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [feedback, finished, questionPhase, timeLeft, timerRunning]);

  useEffect(() => {
    if (questionPhase !== "active" || !timerRunning || feedback || finished || timeLeft > 0) {
      return;
    }
    void finalizeAnswer("", "time_up");
  }, [feedback, finished, questionPhase, timeLeft, timerRunning]);

  const startQuestion = () => {
    if (!currentItem || finished) return;
    setGuess("");
    setFeedback(null);
    setTimeLeft(QUESTION_TIME);
    setQuestionPhase("active");
    setTimerRunning(true);
    logGameTelemetry(MODE_ID, "question_started", {
      index: currentIndex,
      type: currentItem.type,
      durationSeconds: QUESTION_TIME,
      submodeId: selectedSubmodeId || null,
    });
  };

  const finalizeAnswer = async (answerText, reason = "manual") => {
    if (!currentItem || feedback) return;

    const acceptedAnswers = currentItem.acceptedAnswers?.length
      ? currentItem.acceptedAnswers
      : currentItem.answer
        ? [currentItem.answer]
        : [];
    const submittedAnswer = answerText.trim();
    const isCorrect = submittedAnswer
      ? matchesAnswer(submittedAnswer, acceptedAnswers)
      : false;
    const nextScore = isCorrect ? score + 10 : score;

    setFeedback({
      isCorrect,
      timedOut: reason === "time_up",
      answer: acceptedAnswers[0] || "Chưa cấu hình đáp án",
      explanation: currentItem.explanation,
    });
    setScore(nextScore);
    setQuestionPhase("review");
    setTimerRunning(false);
    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct: isCorrect,
      index: currentIndex,
      type: currentItem.type,
      reason,
      scoreAfter: nextScore,
      submodeId: selectedSubmodeId || null,
    });

    if (currentIndex === items.length - 1) {
      await endSession({
        score: nextScore,
        solved: true,
        submodeId: selectedSubmodeId || null,
      });
      setFinished(true);
      if (nextScore > 0) await saveXp(nextScore);
    }
  };

  const handleSubmit = async () => {
    if (!guess.trim() || !currentItem || questionPhase !== "active" || !timerRunning) return;
    await finalizeAnswer(guess, "manual");
  };

  const nextQuestion = () => {
    setFeedback(null);
    setGuess("");
    setActiveImage("");
    setCurrentIndex((prev) => prev + 1);
    setTimeLeft(QUESTION_TIME);
    setQuestionPhase("ready");
    setTimerRunning(false);
  };

  const toggleTimerRunning = () => {
    setTimerRunning((prev) => !prev);
  };

  const replay = async () => {
    if (!selectedSubmode) return;
    await endSession({
      reason: "replay",
      submodeId: selectedSubmode.id,
    });
    initializeSession(selectedSubmode, true);
  };

  const returnToSubmodeSelection = async () => {
    await endSession({
      reason: "back_to_submode_selection",
      score,
      solved: finished,
      submodeId: selectedSubmodeId || null,
    });
    setSelectedSubmodeId("");
    resetSessionState();
  };

  if (loading && sourceItems.length === 0 && !selectedSubmodeId) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-2xl font-bold text-amber-400"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      >
        Đang tải dữ liệu nhận diện...
      </div>
    );
  }

  if (!selectedSubmodeId) {
    return (
      <div
        className="p-4 md:p-6 min-h-screen max-w-6xl mx-auto flex flex-col"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      >
        <div
          className="mb-6 rounded-[28px] border p-5 shadow-2xl"
          style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => navigate("/modes")}
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-slate-950/40 px-4 py-2 text-sm font-black text-slate-200"
            >
              <ArrowLeft size={18} />
              Quay Lại
            </button>
            <div className="rounded-full border border-amber-400/15 bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-amber-300">
              Mode 3 gồm 2 mode nhỏ
            </div>
          </div>

          <div className="mt-6 max-w-4xl">
            <h1
              className="vn-safe-heading text-3xl font-black tracking-[0.08em] sm:text-4xl"
              style={{
                background: "linear-gradient(135deg, #f0d48a, #d4a053)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Nhận diện lịch sử
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">
              Chọn một trong hai nhánh chơi trước khi bắt đầu. Mỗi mode nhỏ có
              5 câu, mỗi câu 15 giây, và chỉ mở câu hỏi sau khi bấm{" "}
              <span className="font-black text-sky-200">BẮT ĐẦU</span>.
            </p>
          </div>
        </div>

        {availableSubmodes.length === 0 ? (
          <div
            className="rounded-[28px] border px-6 py-10 text-center text-2xl font-bold text-amber-400"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            Chưa có dữ liệu hợp lệ cho mode 3.
          </div>
        ) : (
          <div className="grid items-stretch gap-6 lg:grid-cols-2">
            {availableSubmodes.map((submode) => {
              const SubmodeIcon = submode.Icon;
              return (
                <div
                  key={submode.id}
                  className="flex h-full flex-col rounded-[30px] border p-6 shadow-2xl"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="inline-flex h-16 w-16 items-center justify-center rounded-2xl text-slate-950"
                      style={{ background: submode.accent }}
                    >
                      <SubmodeIcon size={28} />
                    </div>
                    <div className="rounded-full border border-white/10 bg-slate-950/45 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-200">
                      {submode.items.length} câu | 15 giây/câu
                    </div>
                  </div>

                  <h2 className="mt-6 text-2xl font-black text-white">
                    {submode.title}
                  </h2>
                  <div className="mt-4 flex flex-1 flex-col">
                    <p className="text-sm leading-7 text-slate-300">
                      {submode.description}
                    </p>
                    <p className="mt-4 flex-1 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4 text-sm leading-7 text-slate-200">
                      {submode.summary}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedSubmodeId(submode.id)}
                    className="mt-6 w-full rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950"
                    style={{ background: submode.accent }}
                  >
                    {submode.buttonLabel}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (loading && items.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-2xl font-bold text-amber-400"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      >
        Đang chuẩn bị mode nhỏ...
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      >
        <div className="text-2xl font-bold text-amber-400">
          Chưa có dữ liệu hợp lệ cho mode nhỏ này.
        </div>
        <button
          onClick={returnToSubmodeSelection}
          className="mt-6 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-950"
        >
          Quay Lại Chọn Mode Nhỏ
        </button>
      </div>
    );
  }

  return (
    <div
      className="p-4 md:p-6 min-h-screen max-w-6xl mx-auto flex flex-col items-center"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
    >
      <div
        className="w-full grid grid-cols-[1fr_auto_1fr] items-center mb-6 p-4 rounded-xl shadow gap-4"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex justify-start">
          <button
            onClick={returnToSubmodeSelection}
            className="font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Mode Nhỏ</span>
          </button>
        </div>
        <div className="text-center">
          <h2
            className="vn-safe-heading text-lg sm:text-xl md:text-2xl font-black tracking-[0.08em] flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #f0d48a, #d4a053)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <ScanSearch size={24} className="text-amber-500" /> Nhận diện lịch sử
          </h2>
          <p className="mt-2 text-[11px] font-black uppercase tracking-[0.2em] text-sky-200">
            {selectedSubmode?.shortTitle}
          </p>
        </div>
        <div className="flex justify-end">
          <span
            className="text-xs sm:text-sm font-black px-3 py-2 rounded-full"
            style={{
              color: "#f0d48a",
              background: "rgba(212,160,83,0.12)",
              border: "1px solid rgba(212,160,83,0.2)",
            }}
          >
            {progressLabel}
          </span>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-[1.25fr_0.95fr] gap-6">
        <div
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: "#16213e", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: "rgba(212,160,83,0.8)" }}>
              {recognitionTypeLabels[currentItem.type] || "Tư liệu"}
            </p>
            <h3 className="text-white text-xl font-black">{currentItem.title}</h3>
          </div>
          <div className="p-5">
            {questionPhase === "ready" && !feedback ? (
              <div className="rounded-2xl mb-5 min-h-[320px] border border-dashed border-sky-400/20 bg-sky-500/10 px-6 py-10 text-center flex flex-col items-center justify-center">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-sky-200">
                  Câu hỏi sẽ mở sau khi bấm bắt đầu
                </div>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200">
                  {selectedSubmode?.shortTitle} đang chờ mở lượt chơi. Bấm{" "}
                  <span className="font-black text-sky-200">BẮT ĐẦU</span> để
                  hiện tư liệu và chạy đồng hồ 15 giây.
                </p>
              </div>
            ) : (
              <>
                <div
                  className="rounded-2xl overflow-hidden mb-5 bg-slate-900 relative min-h-[320px] flex items-center justify-center p-6"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {currentItem.type === "keyword_hint" ? (
                    <div className="text-center p-4">
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-amber-300">
                        <History size={16} />
                        Hệ thống từ khóa gợi ý
                      </div>
                      <p className="text-xl md:text-2xl font-black text-white leading-relaxed italic">
                        "{currentItem.prompt}"
                      </p>
                    </div>
                  ) : currentImages.length > 0 ? (
                    <div className={`grid w-full gap-4 ${currentImages.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
                      {currentImages.map((imageSrc, imageIndex) => (
                        <div
                          key={`${imageSrc}-${imageIndex}`}
                          className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 p-3"
                        >
                          <img
                            src={imageSrc}
                            alt={`${currentItem.title} ${imageIndex + 1}`}
                            className="w-full aspect-square object-contain"
                          />
                          <button
                            onClick={() => {
                              setActiveImage(imageSrc);
                              logGameTelemetry(MODE_ID, "hint_used", {
                                index: currentIndex,
                                action: "zoom",
                                imageIndex,
                                submodeId: selectedSubmodeId || null,
                              });
                            }}
                            className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-900/80 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-white"
                          >
                            <ZoomIn size={14} />
                            Phóng To
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 px-6 py-10 text-sm text-slate-400">
                      Câu hỏi này chưa có ảnh hiển thị.
                    </div>
                  )}
                </div>
                {currentItem.type !== "keyword_hint" ? (
                  <p className="text-lg font-bold text-white leading-relaxed">{currentItem.prompt}</p>
                ) : (
                  <p className="text-sm leading-7 text-slate-300">
                    Đọc chuỗi gợi ý phía trên và nhập chính xác nhân vật, sự kiện hoặc địa danh tương ứng.
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div
          className="rounded-3xl p-6 shadow-2xl flex flex-col"
          style={{ background: "#16213e", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="mb-5 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              Mode nhỏ đang chơi
            </div>
            <div className="mt-2 text-sm font-black leading-6 text-white">
              {selectedSubmode?.title}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-4 text-center">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-300/80">
                Đồng hồ
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 text-2xl font-black text-amber-300">
                <Clock3 size={20} />
                {questionPhase === "ready" ? `${QUESTION_TIME}s` : `${timeLeft}s`}
              </div>
              <div className="mt-1 text-xs text-slate-300">Mỗi câu 15 giây</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-4 text-center">
              <div className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-400">
                Điểm hiện tại
              </div>
              <div className="mt-2 text-3xl font-black text-green-400">{score} XP</div>
              <div className="mt-1 text-xs text-slate-400">Mỗi đáp án đúng +10 XP</div>
            </div>
          </div>

          {!finished && !feedback && questionPhase === "ready" ? (
            <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-5">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-sky-200">
                Sẵn sàng trả lời
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                Bấm bắt đầu để mở lượt đoán 15 giây cho câu này.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={startQuestion}
                  className="rounded-xl py-4 font-black text-slate-950"
                  style={{ background: "linear-gradient(135deg, #38bdf8, #67e8f9)" }}
                >
                  BẮT ĐẦU
                </button>
                <button
                  disabled
                  className="rounded-xl border border-white/10 bg-slate-800 py-4 font-black text-white/50"
                >
                  DỪNG
                </button>
              </div>
            </div>
          ) : null}

          {!finished && !feedback && questionPhase === "active" ? (
            <div className="space-y-4">
              <input
                type="text"
                value={guess}
                onChange={(event) => setGuess(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
                placeholder="Nhập đáp án..."
                disabled={!timerRunning}
                className="w-full p-4 rounded-xl outline-none text-lg font-bold text-white transition-all disabled:opacity-60"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,160,83,0.3)" }}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  disabled
                  className="rounded-xl py-4 font-black text-slate-950 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #38bdf8, #67e8f9)" }}
                >
                  BẮT ĐẦU
                </button>
                <button
                  onClick={toggleTimerRunning}
                  className="rounded-xl border border-white/10 bg-slate-800 py-4 font-black text-white"
                >
                  {timerRunning ? "DỪNG" : "TIẾP TỤC"}
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!timerRunning || !guess.trim()}
                className="btn-primary py-4 rounded-xl font-black disabled:opacity-50"
              >
                Kiểm Tra Đáp Án
              </button>
            </div>
          ) : null}

          {feedback && !finished ? (
            <div
              className="rounded-2xl p-5 animate-fade-in"
              style={{
                background: feedback.isCorrect ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                border: `1px solid ${feedback.isCorrect ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                {feedback.isCorrect ? <CheckCircle size={28} className="text-green-400" /> : <XCircle size={28} className="text-red-400" />}
                <h4 className={`text-xl font-black ${feedback.isCorrect ? "text-green-400" : "text-red-400"}`}>
                  {feedback.isCorrect ? "Chính xác" : feedback.timedOut ? "Hết thời gian" : "Chưa đúng"}
                </h4>
              </div>
              <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>
                Đáp án và phần giải thích chỉ được công bố khi kết thúc chế độ.
              </p>
              <button
                onClick={nextQuestion}
                className="w-full py-3 rounded-xl font-black text-white"
                style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}
              >
                Câu Tiếp Theo
              </button>
            </div>
          ) : null}

          {finished ? (
            <div className="mt-auto text-center animate-bounce-in">
              <Trophy size={72} className="text-amber-400 mx-auto mb-4" />
              <h3 className="text-3xl font-black text-amber-400 mb-2 uppercase">
                Hoàn Thành Nhận Diện
              </h3>
              <p className="text-white font-bold text-xl mb-3">
                Điểm: {score} / {items.length * 10}
              </p>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
                {selectedSubmode?.summary}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={replay}
                  className="flex-1 py-3 rounded-xl font-black text-white"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  Chơi Lại
                </button>
                <button
                  onClick={returnToSubmodeSelection}
                  className="flex-1 py-3 rounded-xl font-black text-white"
                  style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)" }}
                >
                  Đổi Mode Nhỏ
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setActiveImage("")}
        >
          <div
            className="w-full max-w-5xl rounded-2xl border border-white/10 bg-slate-950 p-3"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-sky-200">
                <Search size={14} />
                Quan Sát Chi Tiết
              </div>
              <button
                onClick={() => setActiveImage("")}
                className="rounded-full border border-white/15 bg-slate-900 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-200"
              >
                Đóng
              </button>
            </div>
            <img
              src={activeImage}
              alt={currentItem.title}
              className="h-[80vh] w-full rounded-xl object-contain bg-slate-900 p-2"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
