import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Clock3,
  Image as ImageIcon,
  Pause,
  Play,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { revealPictureSets } from "../data/theme4GameData";
import useTheme4ModeData from "../hooks/useTheme4ModeData";
import {
  logGameTelemetry,
  resetModeSessionId,
  saveXp,
  shuffleArray,
} from "../utils/gameHelpers";
const QUESTION_SECONDS = 15;
const GRID_SIZE = 4;
const MODE_ID = "turning-page";
const CLUE_TILES = [
  { id: "tile-1", label: "Góc 1", top: "0%", left: "0%" },
  { id: "tile-2", label: "Góc 2", top: "0%", left: "50%" },
  { id: "tile-3", label: "Góc 3", top: "50%", left: "0%" },
  { id: "tile-4", label: "Góc 4", top: "50%", left: "50%" },
];

const getKeywordGroups = (keyword = "") =>
  keyword
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => Array.from(word.replace(/[^0-9A-Za-zÀ-ỹ]/g, "")))
    .filter((group) => group.length > 0);

const getKeywordBoxClasses = (keyword = "") => {
  const totalLetters = keyword.replace(/\s/g, "").length;
  if (totalLetters > 20) return "h-9 min-w-[2rem] text-xs";
  if (totalLetters > 14) return "h-10 min-w-[2.2rem] text-sm";
  if (totalLetters > 9) return "h-11 min-w-[2.45rem] text-base";
  return "h-12 min-w-[2.75rem] text-lg";
};

export default function RevealPictureModeOlympia() {
  const navigate = useNavigate();
  const { data: remoteRevealPictureSets, loading } = useTheme4ModeData(
    MODE_ID,
    revealPictureSets
  );

  const [pictureData, setPictureData] = useState(null);
  const [phase, setPhase] = useState("select");
  const [clues, setClues] = useState([]);
  const [activeClueIndex, setActiveClueIndex] = useState(null);
  const [questionPhase, setQuestionPhase] = useState("idle");
  const [questionInput, setQuestionInput] = useState("");
  const [guessInput, setGuessInput] = useState("");
  const [questionTimeLeft, setQuestionTimeLeft] = useState(QUESTION_SECONDS);
  const [questionFeedback, setQuestionFeedback] = useState(null);
  const [guessFeedback, setGuessFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(100);
  const [xpSaved, setXpSaved] = useState(false);
  const [questionTimerRunning, setQuestionTimerRunning] = useState(false);

  const startedAtRef = useRef(Date.now());
  const sessionActiveRef = useRef(false);
  const questionInputRef = useRef("");

  const activeRevealPictureSets =
    Array.isArray(remoteRevealPictureSets) && remoteRevealPictureSets.length > 0
      ? remoteRevealPictureSets
      : revealPictureSets;

  const revealedCount = clues.filter((clue) => clue.revealed).length;
  const allCluesRevealed = clues.length > 0 && revealedCount === clues.length;
  const currentClue =
    activeClueIndex !== null && activeClueIndex >= 0 ? clues[activeClueIndex] : null;
  const progressWidth = `${(revealedCount / Math.max(1, clues.length || GRID_SIZE)) * 100}%`;

  const endSession = (payload) => {
    if (!sessionActiveRef.current) return;
    logGameTelemetry(MODE_ID, "session_end", payload);
    sessionActiveRef.current = false;
  };

  const buildClues = (selected) =>
    (selected?.questions || []).slice(0, GRID_SIZE).map((item, index) => ({
      ...item,
      id: `clue-${index}`,
      revealed: false,
      isCorrect: null,
      userAnswer: "",
    }));

  const startRound = (selected) => {
    if (!selected) return;
    sessionActiveRef.current = false;
    setPictureData(selected);
    setClues(buildClues(selected));
    setActiveClueIndex(null);
    setQuestionPhase("idle");
    setQuestionInput("");
    setGuessInput("");
    setQuestionTimeLeft(QUESTION_SECONDS);
    setQuestionFeedback(null);
    setGuessFeedback(null);
    setIsFinished(false);
    setScore(100);
    setXpSaved(false);
    setQuestionTimerRunning(false);
    setPhase("play");
  };

  const resetToSelect = () => {
    setPictureData(null);
    setPhase("select");
    setIsFinished(false);
  };

  useEffect(() => {
    questionInputRef.current = questionInput;
  }, [questionInput]);

  const startSessionIfNeeded = () => {
    if (sessionActiveRef.current || !pictureData) return;
    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    sessionActiveRef.current = true;
    logGameTelemetry(MODE_ID, "session_start", {
      totalClues: clues.length || GRID_SIZE,
      acceptedAnswers: pictureData.acceptedAnswers?.length || 0,
    });
  };

  const closeQuestionOverlay = () => {
    setQuestionTimerRunning(false);
    setQuestionPhase("idle");
    setQuestionInput("");
    setQuestionTimeLeft(QUESTION_SECONDS);
    setActiveClueIndex(null);
  };

  const revealCurrentClue = (
    submittedAnswer = questionInputRef.current,
    { timedOut = false, skipped = false } = {}
  ) => {
    if (!currentClue || currentClue.revealed || activeClueIndex === null) return;

    const acceptedAnswers = [currentClue.a, ...(currentClue.acceptedAnswers || [])];
    
    const isCorrect = !skipped && !timedOut && acceptedAnswers.some(
      (ans) => String(submittedAnswer).trim().toLowerCase() === String(ans).trim().toLowerCase()
    );

    const shouldReveal = true;

    const penalty = isCorrect ? 0 : skipped ? 15 : 10;

    setClues((prev) =>
      prev.map((clue, index) =>
        index === activeClueIndex
          ? {
              ...clue,
              revealed: shouldReveal,
              isCorrect,
              userAnswer: submittedAnswer,
            }
          : clue
      )
    );
    setScore((prev) => Math.max(20, prev - penalty));
    setQuestionFeedback({
      clueIndex: activeClueIndex,
      correct: isCorrect,
      timeout: timedOut,
      skipped,
    });
    setGuessFeedback(null);
    setQuestionInput("");
    setQuestionTimeLeft(QUESTION_SECONDS);
    setQuestionTimerRunning(false);
    setQuestionPhase("idle");
    setActiveClueIndex(null);

    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct: isCorrect,
      questionType: "keyword_question",
      clueIndex: activeClueIndex,
      timedOut,
      skipped,
      scoreAfter: Math.max(20, score - penalty),
    });
  };

  const openClue = (index) => {
    const targetClue = clues[index];
    if (!targetClue || targetClue.revealed || isFinished || questionPhase === "active") {
      return;
    }

    startSessionIfNeeded();
    setActiveClueIndex(index);
    setQuestionInput("");
    setQuestionTimeLeft(QUESTION_SECONDS);
    setQuestionFeedback(null);
    setGuessFeedback(null);
    setQuestionPhase("active");
    setQuestionTimerRunning(true);

    logGameTelemetry(MODE_ID, "question_started", {
      clueIndex: index,
      durationSeconds: QUESTION_SECONDS,
    });
  };

  const submitQuestion = () => {
    if (questionPhase !== "active" || !questionTimerRunning) return;
    revealCurrentClue(questionInput.trim(), { timedOut: false });
  };

  const submitGuess = () => {
    if (!pictureData || !guessInput.trim() || isFinished) return;
    startSessionIfNeeded();

    const acceptedFinalAnswers = [pictureData.answer, ...(pictureData.acceptedAnswers || [])];
    const isCorrect = acceptedFinalAnswers.some(
      (ans) => String(guessInput).trim().toLowerCase() === String(ans).trim().toLowerCase()
    );
    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct: isCorrect,
      questionType: "final_guess",
      clueIndex: activeClueIndex,
      scoreAfter: isCorrect ? score : Math.max(10, score - 5),
    });

    if (isCorrect) {
      endSession({
        solved: true,
        score,
        revealedTiles: revealedCount,
        durationMs: Date.now() - startedAtRef.current,
      });
      setGuessFeedback(null);
      setIsFinished(true);
      return;
    }

    setScore((prev) => Math.max(10, prev - 5));
    setGuessFeedback({
      correct: false,
      explanation: allCluesRevealed
        ? "Đáp án chưa chính xác. Có thể thử lại hoặc đổi sang hình khác."
        : "Đáp án chưa chính xác. Hãy mở thêm dữ kiện để suy luận.",
    });
  };

  const handleExit = async () => {
    endSession({
      solved: false,
      score,
      revealedTiles: revealedCount,
      durationMs: Date.now() - startedAtRef.current,
    });
    if (!isFinished && revealedCount > 0 && score > 0) {
      await saveXp(score);
    }
    navigate("/modes");
  };

  useEffect(() => {
    if (questionPhase !== "active" || !questionTimerRunning || activeClueIndex === null) {
      return;
    }
    if (questionTimeLeft <= 0) {
      revealCurrentClue(questionInputRef.current, { timedOut: true });
      return;
    }

    const timer = window.setTimeout(() => {
      setQuestionTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [questionPhase, questionTimeLeft, activeClueIndex, questionTimerRunning, clues]);

  useEffect(() => {
    if (isFinished && !xpSaved && score > 0) {
      saveXp(score);
      setXpSaved(true);
    }
  }, [isFinished, score, xpSaved]);

  const renderKeywordBoxes = (keyword) => {
    const groups = getKeywordGroups(keyword);
    const sizeClass = getKeywordBoxClasses(keyword);

    return (
      <div className="flex flex-wrap items-center gap-2.5">
        {groups.map((group, groupIndex) => (
          <div key={`${keyword}-${groupIndex}`} className="flex flex-nowrap gap-1.5">
            {group.map((char, charIndex) => (
              <div
                key={`${char}-${charIndex}`}
                className={`rounded-2xl border font-black uppercase flex items-center justify-center shrink-0 ${sizeClass}`}
                style={{
                  borderColor: "rgba(212, 160, 83, 0.28)",
                  background: "rgba(212, 160, 83, 0.12)",
                  color: "var(--page-heading)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                {char}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const resultMessage = useMemo(() => {
    if (!questionFeedback) return null;
    if (questionFeedback.skipped) return "Đã bỏ qua dữ kiện. Góc hình được mở nhưng bị trừ 15 điểm.";
    if (questionFeedback.timeout) return "Hết 15 giây. Góc hình vẫn được mở nhưng bị trừ 10 điểm.";
    if (questionFeedback.correct) return "Trả lời chính xác! Nhận 1 phần góc hình, không bị trừ điểm.";
    return "Sai đáp án. Góc hình vẫn được mở nhưng bị trừ 10 điểm.";
  }, [questionFeedback]);

  if (loading && !activeRevealPictureSets?.length) {
    return (
      <div className="theme-page game-screen min-h-screen flex items-center justify-center overflow-y-auto overflow-x-hidden custom-scrollbar text-2xl font-bold text-amber-500">
        Đang tải dữ liệu trang sử...
      </div>
    );
  }

  if (!activeRevealPictureSets || activeRevealPictureSets.length === 0) {
    return (
      <div className="theme-page game-screen min-h-screen flex items-center justify-center text-center px-6 overflow-y-auto overflow-x-hidden custom-scrollbar text-2xl font-bold text-amber-500">
        Chưa có bộ câu hỏi hợp lệ cho chế độ chơi này.
      </div>
    );
  }

  if (phase === "select") {
    return (
      <div
        className="theme-page game-screen h-full min-h-0 min-h-screen flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar p-4 sm:p-6 lg:p-8"
        style={{ background: "var(--page-bg-gradient)", color: "var(--text-primary)" }}
      >
        <div className="max-w-[1180px] w-full mx-auto flex flex-col min-h-0 custom-scrollbar overflow-y-auto pr-1 pb-4">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <button
              onClick={() => navigate("/modes")}
              className="game-action-btn game-action-btn--secondary self-start text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <ArrowLeft size={18} /> Quay lại
            </button>
            <div
              className="self-start rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.2em]"
              style={{ color: "var(--page-chip-text)", background: "var(--page-chip-bg)", border: "1px solid var(--page-chip-border)" }}
            >
              Lật mở trang sử
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
              Chọn Hình Bí Ẩn
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 sm:text-base" style={{ color: "var(--text-secondary)" }}>
              Dưới mỗi hình bức ảnh là một nhân vật lịch sử đang bị che khuất. Trả lời các câu hỏi phụ để mở khóa dần mảnh ghép.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {activeRevealPictureSets.map((pkg, index) => (
              <button
                key={pkg.id || `pic-${index}`}
                onClick={() => startRound(pkg)}
                className="group text-left rounded-[2rem] p-7 sm:p-8 transition-all hover:-translate-y-1 active:scale-[0.99]"
                style={{
                  background: "linear-gradient(135deg, rgba(15, 23, 42, 0.82), rgba(30, 41, 59, 0.78))",
                  border: "1px solid var(--page-card-border)",
                  boxShadow: "0 20px 44px rgba(0, 0, 0, 0.26)",
                }}
              >
                <div className="flex h-full items-start gap-5">
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.4rem]"
                    style={{
                      background: "linear-gradient(135deg, rgba(236,72,153,0.92), rgba(168,85,247,0.92))",
                    }}
                  >
                    <Sparkles size={28} className="text-white" />
                  </div>
                  <div className="flex min-h-[132px] flex-1 flex-col">
                    <div
                      className="mb-4 inline-flex w-max items-center rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em]"
                      style={{ color: "var(--page-chip-text)", background: "var(--page-chip-bg)", border: "1px solid var(--page-chip-border)" }}
                    >
                      Bức ảnh số {index + 1}
                    </div>
                    <h2
                      className="vn-safe-heading text-xl sm:text-2xl font-black leading-snug"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Hình Bí Ẩn {index + 1}
                    </h2>
                    <p className="mt-3 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
                      Lật mở các mảnh ghép để khám phá nhân vật hoặc sự kiện bí ẩn đằng sau bức ảnh.
                    </p>
                    <div
                      className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-black uppercase tracking-[0.16em]"
                      style={{ color: "var(--page-heading)" }}
                    >
                      <Play size={14} />
                      Bắt đầu
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

  if (isFinished) {
    return (
      <div className="theme-page game-screen min-h-screen flex flex-col items-center justify-center p-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="theme-glass-card-strong max-w-3xl w-full rounded-[36px] p-6 md:p-8 text-center">
          <CheckCircle size={68} className="mx-auto mb-4 text-emerald-500" />
          <h2 className="vn-safe-heading text-3xl md:text-4xl font-black mb-3" style={{ color: "var(--page-heading)" }}>
            Lật mở trang sử thành công
          </h2>
          <p className="text-lg md:text-xl font-bold mb-6" style={{ color: "var(--game-text-secondary)" }}>
            Đáp án là <span className="uppercase" style={{ color: "var(--page-heading)" }}>{pictureData.answer}</span>
          </p>

          <div className="mx-auto aspect-square max-w-[520px] overflow-hidden rounded-[28px] border bg-white/40">
            <img
              src={pictureData.imageUrl}
              alt={pictureData.answer}
              className="h-full w-full object-cover"
            />
          </div>

          <p className="mt-6 text-3xl font-black text-emerald-500">Thưởng: {score} XP</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button onClick={resetToSelect} className="game-action-btn game-action-btn--secondary flex-1">
              Hình Khác
            </button>
            <button onClick={handleExit} className="game-action-btn game-action-btn--primary flex-1">
              Vào Các Chế Độ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="theme-page game-screen min-h-screen flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar px-3 py-4 md:px-6"
      style={{ background: "var(--page-bg-gradient)" }}
    >
      <div className="w-full max-w-[1500px] mx-auto flex flex-col gap-4 flex-1 min-h-0">
        <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3">
          <button
            onClick={resetToSelect}
            className="game-action-btn game-action-btn--secondary game-action-btn--compact"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Quay Lại</span>
          </button>

          <div className="min-w-0 text-center">
            <div className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2" style={{ background: "rgba(212,160,83,0.08)", border: "1px solid rgba(212,160,83,0.16)" }}>
              <ImageIcon size={18} style={{ color: "var(--page-heading)" }} />
              <h1 className="vn-safe-heading text-xl sm:text-3xl font-black tracking-[0.08em]" style={{ color: "var(--page-heading)" }}>
                Lật mở trang sử
              </h1>
            </div>
          </div>

          <div className="theme-chip rounded-2xl px-4 py-3 text-center">
            <div className="text-[11px] font-black uppercase tracking-[0.18em]">Dữ kiện</div>
            <div className="mt-1 text-xl font-black">
              {revealedCount}/{clues.length}
            </div>
          </div>

          <div className="theme-chip rounded-2xl px-4 py-3 text-center">
            <div className="text-[11px] font-black uppercase tracking-[0.18em]">Điểm</div>
            <div className="mt-1 text-xl font-black text-emerald-600">{score} XP</div>
          </div>
        </div>

        <div className="h-3 w-full rounded-full overflow-hidden" style={{ background: "rgba(132,94,46,0.08)", border: "1px solid rgba(132,94,46,0.16)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: progressWidth,
              background: "linear-gradient(90deg, #f4c256 0%, #d4a053 45%, #ea580c 100%)",
            }}
          />
        </div>

        <div className="grid flex-1 min-h-0 gap-4 xl:grid-cols-[minmax(0,1.18fr)_minmax(380px,0.82fr)]">
          <div className="flex flex-col gap-4 min-h-0">
            <div className="theme-glass-card-strong rounded-[36px] p-3 sm:p-4">
              <div className="relative aspect-square overflow-hidden rounded-[28px]" style={{ background: "rgba(255,255,255,0.34)" }}>
                <img
                  src={pictureData.imageUrl}
                  alt={pictureData.answer}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(10,15,27,0.08) 0%, rgba(10,15,27,0.18) 100%)",
                  }}
                />

                {clues.map((clue, index) => {
                  const tile = CLUE_TILES[index];
                  const isActive = activeClueIndex === index && questionPhase === "active";

                  return (
                    <button
                      key={clue.id}
                      type="button"
                      onClick={() => openClue(index)}
                      disabled={clue.revealed || questionPhase === "active"}
                      className={`absolute flex items-center justify-center border transition-all duration-700 ${
                        clue.revealed ? "pointer-events-none opacity-0 scale-90" : ""
                      } ${!clue.revealed ? "cursor-pointer" : ""}`}
                      style={{
                        top: tile.top,
                        left: tile.left,
                        width: "50%",
                        height: "50%",
                        background:
                          "linear-gradient(135deg, #FFF9ED 0%, #F5E8C9 100%)",
                        borderColor: isActive
                          ? "rgba(212,160,83,0.72)"
                          : "rgba(132,94,46,0.18)",
                        boxShadow: isActive
                          ? "0 0 0 4px rgba(212,160,83,0.2), inset 0 0 48px rgba(212,160,83,0.2)"
                          : "inset 0 1px 0 rgba(255,255,255,0.65)",
                      }}
                    >
                      <div className="text-center">
                        <div className="text-sm sm:text-base font-black uppercase tracking-[0.24em]" style={{ color: "var(--page-heading)" }}>
                          {tile.label}
                        </div>
                        <div className="mt-2 text-5xl sm:text-6xl font-black" style={{ color: "var(--page-heading)" }}>
                          ?
                        </div>
                      </div>
                    </button>
                  );
                })}


              </div>
            </div>

            <div className="premium-glass-panel p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.24em]" style={{ color: "var(--page-heading)" }}>
                    Đáp án cần tìm
                  </div>
                  <div className="mt-2 text-sm font-semibold" style={{ color: "var(--game-text-muted)" }}>
                    {pictureData?.answer ? `Đáp án gồm ${pictureData.answer.replace(/\\s/g, "").length} chữ cái` : "Ô đoán đáp án chính"}
                  </div>
                </div>

                {allCluesRevealed ? (
                  <div className="theme-chip rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em]">
                    Đã mở đủ 4 góc
                  </div>
                ) : null}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
                <input
                  type="text"
                  value={guessInput}
                  onChange={(event) => setGuessInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && submitGuess()}
                  placeholder="Nhập đáp án lịch sử..."
                  className="game-input w-full rounded-2xl px-4 py-4 text-lg font-semibold outline-none transition"
                  style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)" }}
                />
                <button
                  onClick={submitGuess}
                  disabled={!guessInput.trim()}
                  className="game-action-btn game-action-btn--primary"
                >
                  <Search size={18} />
                  Chốt Đáp Án
                </button>
              </div>

              {guessFeedback ? (
                <div className="mt-4 rounded-2xl border px-4 py-3" style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)", color: "#b91c1c" }}>
                  {guessFeedback.explanation}
                </div>
              ) : null}

              {allCluesRevealed && !isFinished ? (
                <div className="mt-4">
                  <button onClick={resetToSelect} className="game-action-btn game-action-btn--secondary">
                    Đổi Hình Khác
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-4 min-h-0">
            <div className="theme-glass-card-strong rounded-[32px] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.24em]" style={{ color: "var(--game-text-faint)" }}>
                    Bảng từ khóa
                  </div>
                </div>
                <div className="theme-chip rounded-2xl px-4 py-3 text-center">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em]">Tiến độ</div>
                  <div className="mt-1 text-xl font-black">{revealedCount}/4</div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {clues.map((clue, index) => (
                  <div
                    key={clue.id}
                    className="rounded-[26px] border p-4 sm:p-5"
                    style={{
                      background: clue.revealed
                        ? clue.isCorrect
                          ? "linear-gradient(135deg, rgba(220,252,231,0.7) 0%, rgba(240,253,244,0.88) 100%)"
                          : "linear-gradient(135deg, rgba(254,226,226,0.7) 0%, rgba(254,242,242,0.88) 100%)"
                        : "linear-gradient(135deg, rgba(255,255,255,0.56) 0%, rgba(255,250,242,0.84) 100%)",
                      borderColor: clue.revealed
                        ? clue.isCorrect
                          ? "rgba(34,197,94,0.22)"
                          : "rgba(239,68,68,0.22)"
                        : "rgba(132,94,46,0.14)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-black uppercase tracking-[0.18em]" style={{ color: "var(--page-heading)" }}>
                        Dữ kiện {index + 1}
                      </div>
                      <div
                        className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em]"
                        style={{
                          background: clue.revealed
                            ? clue.isCorrect ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)"
                            : "rgba(132,94,46,0.08)",
                          color: clue.revealed
                            ? clue.isCorrect ? "#15803d" : "#b91c1c"
                            : "var(--game-text-faint)",
                        }}
                      >
                        {clue.revealed ? (clue.isCorrect ? "Đúng ✓" : "Sai ✗") : "Chưa mở"}
                      </div>
                    </div>

                    <div className="mt-4 min-h-[92px] flex items-center">
                      {clue.revealed ? (
                        renderKeywordBoxes(clue.a)
                      ) : (
                        <div className="text-base font-bold" style={{ color: "var(--game-text-muted)" }}>
                          Chưa mở
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {questionFeedback ? (
              <div
                className="theme-glass-card-strong rounded-[28px] p-5"
                style={{
                  borderColor: questionFeedback.correct
                    ? "rgba(34,197,94,0.2)"
                    : "rgba(239,68,68,0.2)",
                }}
              >
                <div className="text-xs font-black uppercase tracking-[0.24em]" style={{ color: "var(--game-text-faint)" }}>
                  Kết quả dữ kiện {questionFeedback.clueIndex + 1}
                </div>
                <div className="mt-3 text-base font-bold" style={{
                  color: questionFeedback.correct ? "#15803d" : "#b91c1c",
                }}>
                  {resultMessage}
                </div>
              </div>
            ) : (
              <div className="theme-glass-card rounded-[28px] p-5">
                <div className="text-xs font-black uppercase tracking-[0.24em]" style={{ color: "var(--game-text-faint)" }}>
                  Trạng thái
                </div>
                <div className="mt-3 text-base font-bold" style={{ color: "var(--game-text-secondary)" }}>
                  Sẵn sàng mở dữ kiện.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {questionPhase === "active" && currentClue ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 game-overlay">
          <div className="theme-glass-card-strong w-full max-w-3xl rounded-[36px] p-5 sm:p-7 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.24em]" style={{ color: "var(--game-text-faint)" }}>
                  Dữ kiện {activeClueIndex + 1}
                </div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.16em]" style={{ background: "rgba(212,160,83,0.08)", color: "var(--page-heading)" }}>
                  <Clock3 size={16} />
                  {questionTimeLeft}s / {QUESTION_SECONDS}s
                </div>
              </div>

              <button
                type="button"
                onClick={closeQuestionOverlay}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border transition"
                style={{
                  background: "rgba(255,255,255,0.52)",
                  borderColor: "rgba(132,94,46,0.14)",
                  color: "var(--game-text)",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 rounded-[28px] border px-5 py-6 sm:px-6" style={{ background: "rgba(255,255,255,0.56)", borderColor: "rgba(132,94,46,0.14)" }}>
              <h2 className="vn-safe-heading text-xl sm:text-2xl font-black leading-[1.5]" style={{ color: "var(--game-text)" }}>
                {currentClue.q}
              </h2>

              <div className="mt-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
                <input
                  type="text"
                  value={questionInput}
                  onChange={(event) => setQuestionInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && submitQuestion()}
                  placeholder="Nhập câu trả lời ngắn..."
                  disabled={!questionTimerRunning}
                  className="game-input w-full rounded-2xl px-4 py-4 text-lg font-semibold outline-none transition disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setQuestionTimerRunning((prev) => !prev)}
                  className="game-action-btn game-action-btn--secondary"
                >
                  {questionTimerRunning ? <Pause size={18} /> : <Play size={18} />}
                  {questionTimerRunning ? "Tạm Dừng" : "Tiếp Tục"}
                </button>
                <button
                  type="button"
                  onClick={submitQuestion}
                  disabled={!questionTimerRunning || !questionInput.trim()}
                  className="game-action-btn game-action-btn--primary"
                >
                  Chốt Trả Lời
                </button>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => revealCurrentClue("", { skipped: true })}
                  className="text-sm font-black uppercase tracking-[0.16em]"
                  style={{ color: "var(--game-text-faint)" }}
                >
                  Bỏ qua dữ kiện này
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
