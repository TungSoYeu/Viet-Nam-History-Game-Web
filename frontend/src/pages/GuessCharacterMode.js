
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

  const sourceItems = useMemo(
    () => (Array.isArray(activeRecognitionItems) ? activeRecognitionItems : []),
    [activeRecognitionItems]
  );

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
  const keywordHintImage = currentItem?.imageToFind || "";
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
  }, [feedback, finished, questionPhase, timeLeft, timerRunning]); // eslint-disable-line react-hooks/exhaustive-deps

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
        className="theme-page game-screen min-h-screen flex items-center justify-center overflow-y-auto overflow-x-hidden custom-scrollbar text-2xl font-bold text-amber-400 bg-transparent"
      >
        Đang tải dữ liệu nhận diện...
      </div>
    );
  }

  if (!selectedSubmodeId) {
    return (
      <div
        className="theme-page game-screen p-3 md:p-4 h-screen w-full flex flex-col overflow-y-auto custom-scrollbar bg-transparent"
      >
        <div className="max-w-[1600px] mx-auto flex flex-col w-full min-h-0 pb-4">
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
                  className="flex flex-col justify-center items-center text-center rounded-[30px] border p-8 md:p-12 shadow-2xl transition hover:scale-[1.02]"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="inline-flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-[2rem] text-slate-950 mb-6"
                    style={{ background: submode.accent }}
                  >
                    <SubmodeIcon size={40} />
                  </div>

                  <div className="rounded-full border border-white/10 bg-slate-950/45 px-5 py-2.5 text-xs md:text-sm font-black uppercase tracking-[0.18em] text-slate-200 mb-6">
                    {submode.items.length} câu | 15 giây/câu
                  </div>

                  <h2 className="text-2xl md:text-3xl max-w-sm font-black text-white mb-10 leading-[1.3] vn-safe-heading">
                    {submode.title}
                  </h2>

                  <button
                    onClick={() => setSelectedSubmodeId(submode.id)}
                    className="w-full max-w-sm rounded-2xl px-6 py-4 md:py-5 text-sm md:text-base font-black uppercase tracking-[0.2em] text-slate-950 transition-all hover:brightness-110 active:scale-95"
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
      </div>
    );
  }

  if (loading && items.length === 0) {
    return (
      <div
        className="theme-page game-screen min-h-screen flex items-center justify-center overflow-y-auto overflow-x-hidden custom-scrollbar text-2xl font-bold text-amber-400 bg-transparent"
      >
        Đang chuẩn bị mode nhỏ...
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div
        className="theme-page game-screen min-h-screen flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden custom-scrollbar px-6 text-center bg-transparent"
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
      className="theme-page game-screen p-3 md:p-4 h-screen w-full flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar bg-transparent"
    >
      <div className="max-w-[1600px] mx-auto flex flex-col w-full h-full min-h-0 items-center">
        <div
          className="mb-3 grid w-full flex-shrink-0 gap-3 rounded-[28px] border border-white/10 bg-slate-900/80 p-4 shadow-2xl md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center"
        >
          <button
            onClick={returnToSubmodeSelection}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/5"
          >
            <ArrowLeft size={18} />
            Mode nhỏ
          </button>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/12 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-amber-300">
              <ScanSearch size={16} />
              {selectedSubmode?.shortTitle}
            </div>
            <h2 className="vn-safe-heading mt-3 text-2xl font-black tracking-[0.08em] text-white sm:text-3xl">
              Nhận diện lịch sử
            </h2>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-center">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-300/80">
                Thời gian
              </div>
              <div className="mt-1 flex items-center justify-center gap-2 text-2xl font-black text-amber-300">
                <Clock3 size={18} />
                {questionPhase === "active" ? timeLeft : QUESTION_TIME}s
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3 text-center">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Tiến độ
              </div>
              <div className="mt-1 text-2xl font-black text-white">{progressLabel}</div>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-center">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300/80">
                XP
              </div>
              <div className="mt-1 text-2xl font-black text-emerald-300">{score}</div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-4 flex-1 min-h-0 overflow-hidden">
        <div
          className="lg:w-[60%] w-full rounded-[30px] flex flex-col overflow-hidden shadow-xl min-h-0"
          style={{ background: "rgba(15,23,42,0.84)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="border-b px-5 py-4 flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="flex flex-wrap items-center gap-3">
              <p className="rounded-full bg-amber-500/12 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-amber-300">
              {recognitionTypeLabels[currentItem.type] || "Tư liệu"}
              </p>
              <h3 className="text-lg font-black text-white md:text-xl">{currentItem.title}</h3>
            </div>
          </div>
          <div className="custom-scrollbar flex-1 min-h-0 overflow-y-auto p-4 pr-2">
            <div className="flex min-h-full flex-col justify-center gap-4">
              {currentItem.type === "keyword_hint" ? (
                <div className={`grid gap-4 ${keywordHintImage ? "xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]" : ""}`}>
                  <div
                    className="flex min-h-[340px] items-center justify-center rounded-[28px] border border-white/10 bg-slate-950/65 px-6 py-8 text-center"
                  >
                    <div className="max-w-xl">
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/12 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-amber-300">
                        <History size={16} />
                        Hệ thống từ khóa
                      </div>
                      <p className="text-2xl font-black leading-relaxed text-white md:text-3xl">
                        "{currentItem.prompt}"
                      </p>
                    </div>
                  </div>

                  {keywordHintImage ? (
                    <div
                      className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/75 p-4"
                    >
                      <img
                        src={keywordHintImage}
                        alt={currentItem.title}
                        className="h-full max-h-[420px] w-full object-contain"
                      />
                      <button
                        onClick={() => {
                          setActiveImage(keywordHintImage);
                          logGameTelemetry(MODE_ID, "hint_used", {
                            index: currentIndex,
                            action: "zoom",
                            imageIndex: 0,
                            submodeId: selectedSubmodeId || null,
                          });
                        }}
                        className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-900/85 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white"
                      >
                        <ZoomIn size={12} />
                        Phóng
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : currentImages.length > 0 ? (
                <div className={`grid gap-4 ${currentImages.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
                  {currentImages.map((imageSrc, imageIndex) => (
                    <div
                      key={`${imageSrc}-${imageIndex}`}
                      className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/75 p-3"
                    >
                      <img
                        src={imageSrc}
                        alt={`${currentItem.title} ${imageIndex + 1}`}
                        className="w-full aspect-[4/3] object-contain"
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
                        className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-900/85 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white"
                      >
                        <ZoomIn size={12} />
                        Phóng
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[28px] border border-dashed border-white/10 px-6 py-10 text-center text-base text-slate-300">
                  Câu hỏi này chưa có ảnh.
                </div>
              )}

              {currentItem.type !== "keyword_hint" ? (
                <div className="rounded-[24px] border border-white/10 bg-white/5 px-6 py-5 text-center">
                  <p className="text-lg font-black leading-relaxed text-white md:text-2xl">
                    {currentItem.prompt}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div
          className="lg:w-[40%] w-full rounded-[30px] p-4 shadow-xl flex flex-col min-h-0 overflow-hidden"
          style={{ background: "rgba(15,23,42,0.84)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 flex flex-col justify-center">
            {!finished && !feedback && questionPhase === "ready" ? (
              <div className="mx-auto w-full max-w-xl rounded-[28px] border border-sky-400/20 bg-sky-500/10 px-6 py-8 text-center">
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-200">
                  Sẵn sàng trả lời
                </div>
                <div className="mt-4 text-2xl font-black text-white md:text-3xl">
                  Bấm bắt đầu để mở lượt đoán
                </div>
                <button
                  onClick={startQuestion}
                  className="mt-6 w-full rounded-2xl py-4 font-black text-base uppercase tracking-[0.18em] text-slate-950 transition hover:brightness-110"
                  style={{ background: "linear-gradient(135deg, #38bdf8, #67e8f9)" }}
                >
                  BẮT ĐẦU
                </button>
              </div>
            ) : null}

            {!finished && !feedback && questionPhase === "active" ? (
              <div className="mx-auto w-full max-w-xl rounded-[28px] border border-white/10 bg-slate-950/55 px-6 py-8">
                <div className="text-center text-[11px] font-black uppercase tracking-[0.2em] text-amber-300/80">
                  Nhập đáp án
                </div>
                <input
                  type="text"
                  value={guess}
                  onChange={(event) => setGuess(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
                  placeholder="Nhập đáp án..."
                  disabled={!timerRunning}
                  className="mt-5 w-full rounded-[24px] border border-amber-400/30 bg-white px-6 py-5 text-center text-xl font-black text-slate-900 outline-none transition focus:border-amber-500 disabled:opacity-60 md:text-2xl"
                />
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={toggleTimerRunning}
                    className="rounded-2xl border border-white/10 bg-slate-800 py-4 font-black text-base uppercase tracking-[0.16em] text-white"
                  >
                    {timerRunning ? "DỪNG" : "TIẾP TỤC"}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!timerRunning || !guess.trim()}
                    className="rounded-2xl py-4 font-black text-base uppercase tracking-[0.16em] text-slate-950 transition disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}
                  >
                    KIỂM TRA
                  </button>
                </div>
              </div>
            ) : null}

            {feedback && !finished ? (
              <div
                className="mx-auto w-full max-w-xl rounded-[28px] p-6 text-center animate-fade-in"
                style={{
                  background: feedback.isCorrect ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  border: `1px solid ${feedback.isCorrect ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                }}
              >
                <div className="mb-3 flex items-center justify-center gap-3">
                  {feedback.isCorrect ? <CheckCircle size={26} className="text-green-400" /> : <XCircle size={26} className="text-red-400" />}
                  <h4 className={`text-2xl font-black ${feedback.isCorrect ? "text-green-400" : "text-red-400"}`}>
                    {feedback.isCorrect ? "Chính xác" : feedback.timedOut ? "Hết thời gian" : "Chưa đúng"}
                  </h4>
                </div>
                <p className="mb-5 text-base text-white/80">
                  Đáp án sẽ được công bố khi kết thúc chế độ.
                </p>
                <button
                  onClick={nextQuestion}
                  className="w-full rounded-2xl py-4 font-black text-base uppercase tracking-[0.16em] text-white"
                  style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}
                >
                  CÂU TIẾP THEO
                </button>
              </div>
            ) : null}

            {finished ? (
              <div className="mx-auto w-full max-w-xl rounded-[28px] border border-amber-400/20 bg-amber-500/10 px-6 py-8 text-center animate-bounce-in">
                <Trophy size={56} className="mx-auto mb-4 text-amber-400" />
                <h3 className="text-2xl font-black uppercase text-amber-300">
                  Hoàn thành
                </h3>
                <p className="mt-3 text-xl font-black text-white">
                  Điểm: {score} / {items.length * 10}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  {selectedSubmode?.summary}
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={replay}
                    className="flex-1 rounded-2xl bg-white/10 py-4 font-black text-sm uppercase tracking-[0.16em] text-white"
                  >
                    Chơi lại
                  </button>
                  <button
                    onClick={returnToSubmodeSelection}
                    className="flex-1 rounded-2xl py-4 font-black text-sm uppercase tracking-[0.16em] text-white"
                    style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)" }}
                  >
                    Đổi mode nhỏ
                  </button>
                </div>
              </div>
            ) : null}
          </div>
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
    </div>
  );
}
