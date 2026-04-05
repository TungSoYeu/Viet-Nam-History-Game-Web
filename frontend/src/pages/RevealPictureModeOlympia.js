import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Clock3,
  HelpCircle,
  Image as ImageIcon,
  Search,
} from "lucide-react";
import { revealPictureSets } from "../data/theme4GameData";
import useTheme4ModeData from "../hooks/useTheme4ModeData";
import {
  logGameTelemetry,
  matchesAnswer,
  resetModeSessionId,
  saveXp,
  shuffleArray,
} from "../utils/gameHelpers";

/* eslint-disable react-hooks/exhaustive-deps */

const QUESTION_SECONDS = 15;
const GUESS_SECONDS = 15;
const GRID_COLUMNS = 2;
const GRID_ROWS = 2;
const GRID_SIZE = GRID_COLUMNS * GRID_ROWS;
const MODE_ID = "turning-page";

const getKeywordGroups = (keyword = "") =>
  keyword
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => Array.from(word.replace(/[^0-9A-Za-zÀ-ỹ]/g, "")))
    .filter((group) => group.length > 0);

const getKeywordBoxClasses = (keyword = "") => {
  const totalLetters = keyword.replace(/\s/g, "").length;
  if (totalLetters > 18) return "h-7 min-w-[1.5rem] text-[10px]";
  if (totalLetters > 12) return "h-8 min-w-[1.8rem] text-xs";
  if (totalLetters > 8) return "h-9 min-w-[2rem] text-sm";
  return "h-10 min-w-[2.25rem] text-base";
};

export default function RevealPictureModeOlympia() {
  const navigate = useNavigate();
  const { data: remoteRevealPictureSets, loading } = useTheme4ModeData(
    MODE_ID,
    revealPictureSets
  );
  const [pictureData, setPictureData] = useState(null);
  const [clues, setClues] = useState([]);
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [phase, setPhase] = useState("question-ready");
  const [questionInput, setQuestionInput] = useState("");
  const [guessInput, setGuessInput] = useState("");
  const [questionTimeLeft, setQuestionTimeLeft] = useState(QUESTION_SECONDS);
  const [guessTimeLeft, setGuessTimeLeft] = useState(GUESS_SECONDS);
  const [questionFeedback, setQuestionFeedback] = useState(null);
  const [guessFeedback, setGuessFeedback] = useState(null);
  const [guessAttempted, setGuessAttempted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(100);
  const [xpSaved, setXpSaved] = useState(false);
  const [questionTimerRunning, setQuestionTimerRunning] = useState(false);
  const [guessTimerRunning, setGuessTimerRunning] = useState(false);
  const startedAtRef = useRef(Date.now());
  const sessionActiveRef = useRef(false);
  const questionInputRef = useRef("");

  const activeRevealPictureSets =
    Array.isArray(remoteRevealPictureSets) && remoteRevealPictureSets.length > 0
      ? remoteRevealPictureSets
      : revealPictureSets;

  const revealedCount = clues.filter((clue) => clue.revealed).length;
  const currentClue = clues[currentClueIndex];
  const progressWidth = `${(revealedCount / Math.max(1, clues.length || GRID_SIZE)) * 100}%`;
  const answerLengthHint = pictureData ? pictureData.answer.replace(/\s/g, "").length : 0;
  const wordCount = pictureData ? pictureData.answer.trim().split(/\s+/).filter(Boolean).length : 0;

  const answerHintLabel = useMemo(() => {
    if (!pictureData) return "";
    return `${answerLengthHint} chữ cái, ${wordCount} từ`;
  }, [answerLengthHint, pictureData, wordCount]);

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

  const loadRound = (sourceSets = activeRevealPictureSets) => {
    if (!Array.isArray(sourceSets) || sourceSets.length === 0) {
      setPictureData(null);
      setClues([]);
      return;
    }

    const selected = shuffleArray(sourceSets)[0];
    sessionActiveRef.current = false;
    setPictureData(selected);
    setClues(buildClues(selected));
    setCurrentClueIndex(0);
    setPhase("question-ready");
    setQuestionInput("");
    setGuessInput("");
    setQuestionTimeLeft(QUESTION_SECONDS);
    setGuessTimeLeft(GUESS_SECONDS);
    setQuestionFeedback(null);
    setGuessFeedback(null);
    setGuessAttempted(false);
    setIsFinished(false);
    setScore(100);
    setXpSaved(false);
    setQuestionTimerRunning(false);
    setGuessTimerRunning(false);
  };

  useEffect(() => {
    questionInputRef.current = questionInput;
  }, [questionInput]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!loading) {
      loadRound(activeRevealPictureSets);
    }
  }, [activeRevealPictureSets, loading]);

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

  const revealCurrentClue = (submittedAnswer = questionInputRef.current, timedOut = false) => {
    if (!currentClue || currentClue.revealed) return;

    const isCorrect = matchesAnswer(submittedAnswer, [currentClue.a]);
    setClues((prev) =>
      prev.map((clue, index) =>
        index === currentClueIndex
          ? {
              ...clue,
              revealed: true,
              isCorrect,
              userAnswer: submittedAnswer,
            }
          : clue
      )
    );
    setScore((prev) => Math.max(20, prev - 10));
    setQuestionFeedback({
      correct: isCorrect,
      answer: currentClue.a,
      timeout: timedOut,
    });
    setGuessFeedback(null);
    setGuessAttempted(false);
    setQuestionInput("");
    setGuessInput("");
    setGuessTimeLeft(GUESS_SECONDS);
    setQuestionTimerRunning(false);
    setGuessTimerRunning(false);
    setPhase("guess-ready");

    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct: isCorrect,
      questionType: "keyword_question",
      clueIndex: currentClueIndex,
      timedOut,
      scoreAfter: Math.max(20, score - 10),
    });
  };

  const startQuestion = () => {
    if (!currentClue || isFinished) return;
    startSessionIfNeeded();
    setQuestionFeedback(null);
    setGuessFeedback(null);
    setGuessInput("");
    setGuessAttempted(false);
    setQuestionTimeLeft(QUESTION_SECONDS);
    setPhase("question-active");
    setQuestionTimerRunning(true);
  };

  const submitQuestion = () => {
    if (phase !== "question-active" || !questionTimerRunning) return;
    revealCurrentClue(questionInput.trim(), false);
  };

  const moveToNextClue = () => {
    if (currentClueIndex >= clues.length - 1) {
      setPhase("final-open");
      return;
    }
    setCurrentClueIndex((prev) => prev + 1);
    setQuestionTimeLeft(QUESTION_SECONDS);
    setGuessTimeLeft(GUESS_SECONDS);
    setQuestionInput("");
    setGuessInput("");
    setQuestionFeedback(null);
    setGuessFeedback(null);
    setGuessAttempted(false);
    setPhase("question-ready");
    setQuestionTimerRunning(false);
    setGuessTimerRunning(false);
  };

  const startGuessWindow = () => {
    setGuessFeedback(null);
    setGuessAttempted(false);
    setGuessTimeLeft(GUESS_SECONDS);
    setPhase("guess-active");
    setGuessTimerRunning(true);
  };

  const submitGuess = () => {
    if (!pictureData || !guessInput.trim() || isFinished) return;
    if (phase !== "guess-active" && phase !== "final-open") return;
    if (phase === "guess-active" && !guessTimerRunning) return;
    if (phase === "guess-active" && guessAttempted) return;

    const isCorrect = matchesAnswer(guessInput, pictureData.acceptedAnswers);
    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct: isCorrect,
      questionType: "final_guess",
      clueIndex: currentClueIndex,
      scoreAfter: isCorrect ? score : Math.max(10, score - 5),
    });

    if (isCorrect) {
      endSession({
        solved: true,
        score,
        revealedTiles: revealedCount,
        durationMs: Date.now() - startedAtRef.current,
      });
      setIsFinished(true);
      return;
    }

    setScore((prev) => Math.max(10, prev - 5));
    setGuessFeedback({
      correct: false,
      answer: pictureData.answer,
      explanation:
        phase === "final-open"
          ? "Đáp án chưa chính xác. Có thể nhập lại hoặc chuyển sang hình khác."
          : "Đáp án chưa chính xác. Hãy chờ thêm dữ kiện ở lượt kế tiếp.",
    });
    if (phase === "guess-active") {
      setGuessAttempted(true);
    }
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (phase !== "question-active" || !questionTimerRunning) return;
    if (questionTimeLeft <= 0) {
      revealCurrentClue(questionInputRef.current, true);
      return;
    }

    const timer = window.setInterval(() => {
      setQuestionTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, questionTimeLeft, currentClueIndex, clues, questionTimerRunning]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (phase !== "guess-active" || !guessTimerRunning) return;
    if (guessTimeLeft <= 0) {
      moveToNextClue();
      return;
    }

    const timer = window.setInterval(() => {
      setGuessTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, guessTimeLeft, currentClueIndex, clues.length, guessTimerRunning]);

  useEffect(() => {
    if (isFinished && !xpSaved && score > 0) {
      saveXp(score);
      setXpSaved(true);
    }
  }, [isFinished, score, xpSaved]);

  const toggleQuestionTimer = () => {
    setQuestionTimerRunning((prev) => !prev);
  };

  const toggleGuessTimer = () => {
    setGuessTimerRunning((prev) => !prev);
  };

  const renderKeywordBoxes = (keyword, revealed) => {
    const groups = getKeywordGroups(keyword);
    const sizeClass = getKeywordBoxClasses(keyword);

    return (
      <div className="flex flex-wrap items-center gap-3">
        {groups.map((group, groupIndex) => (
          <div key={`${keyword}-${groupIndex}`} className="flex flex-wrap gap-1.5">
            {group.map((char, charIndex) => (
              <div
                key={`${char}-${charIndex}`}
                className={`rounded-xl border font-black uppercase flex items-center justify-center ${sizeClass} ${
                  revealed
                    ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
                    : "border-white/10 bg-slate-800 text-slate-500"
                }`}
              >
                {revealed ? char : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  if (loading && !pictureData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-2xl font-bold text-amber-500"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      >
        Đang tải dữ liệu trang sử...
      </div>
    );
  }

  if (!pictureData || !clues.length) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-center px-6 text-2xl font-bold text-amber-500"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      >
        Chưa có bộ câu hỏi hợp lệ cho chế độ chơi này.
      </div>
    );
  }

  if (isFinished) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      >
        <div
          className="p-8 rounded-3xl shadow-2xl max-w-2xl w-full text-center"
          style={{
            background: "#16213e",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          }}
        >
          <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
          <h2 className="vn-safe-heading text-3xl md:text-4xl font-black text-amber-400 mb-4">
            Lật mở trang sử thành công
          </h2>
          <p className="text-xl font-bold text-white mb-6">
            Đáp án là <span className="text-amber-500 uppercase">{pictureData.answer}</span>
          </p>
          <img
            src={pictureData.imageUrl}
            alt={pictureData.answer}
            className="w-full h-auto max-h-80 object-contain rounded-xl mb-4 shadow-2xl bg-slate-900"
            style={{ border: "2px solid rgba(255,255,255,0.1)" }}
          />
          <div className="grid gap-3 sm:grid-cols-2 mb-4 text-left">
            {clues.map((clue, index) => (
              <div key={clue.id} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Từ khóa {index + 1}</p>
                <p className="mt-2 text-white font-bold">{clue.a}</p>
              </div>
            ))}
          </div>
          <p className="text-sm italic mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
            {pictureData.caption}
          </p>
          <p className="text-2xl font-black text-green-400 mb-8">Thưởng: {score} XP</p>
          <div className="flex gap-4">
            <button
              onClick={() => loadRound()}
              className="flex-1 py-4 text-sm font-bold bg-white/10 hover:bg-white/20 text-white transition rounded-xl"
            >
              Chơi Hình Khác
            </button>
            <button
              onClick={handleExit}
              className="flex-1 py-4 text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white transition rounded-xl"
            >
              Về Chọn Chế Độ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 md:p-6 flex flex-col items-center"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
    >
      <div className="w-full max-w-6xl grid grid-cols-[1fr_auto_1fr] items-center mb-6 gap-2">
        <div className="flex justify-start">
          <button
            onClick={handleExit}
            className="px-3 md:px-4 py-2 text-xs md:text-sm flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Thoát</span>
          </button>
        </div>
        <h1
          className="vn-safe-heading text-lg sm:text-2xl md:text-3xl font-black tracking-[0.08em] text-center flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, #f0d48a 0%, #d4a053 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <ImageIcon size={24} className="text-amber-500 hidden sm:block" />
          Lật mở trang sử
        </h1>
        <div className="flex justify-end">
          <div
            className="text-xs sm:text-sm md:text-base font-bold text-amber-300 px-3 py-2 rounded-lg"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {revealedCount}/{clues.length} từ khóa
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mb-6">
        <div className="h-3 w-full rounded-full bg-slate-900/80 border border-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 transition-all duration-500"
            style={{ width: progressWidth }}
          />
        </div>
      </div>

      <div className="w-full max-w-6xl grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-6">
          <div
            className="relative w-full rounded-3xl overflow-hidden shadow-2xl"
            style={{
              border: "4px solid rgba(212,160,83,0.3)",
              background: "#0f3460",
              aspectRatio: "1 / 1",
            }}
          >
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url("${pictureData.imageUrl}")`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#1E293B",
              }}
            />

            <div
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
              }}
            >
              {clues.map((clue, index) => (
                <div
                  key={clue.id}
                  className={`border origin-center flex items-center justify-center transition-all duration-700 shadow-lg ${
                    clue.revealed ? "opacity-0 pointer-events-none scale-0 rotate-[360deg]" : ""
                  }`}
                  style={{
                    background: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)",
                    borderColor: "#8f7346",
                    boxShadow: "inset 0 0 36px rgba(0,0,0,0.92)",
                  }}
                >
                  {!clue.revealed && (
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200/70">
                        Góc {index + 1}
                      </span>
                      <span className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-200 to-amber-600">
                        ?
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Đáp án cần tìm</p>
                <p className="mt-2 text-sm text-slate-300">Đáp án gồm {answerHintLabel}.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-center">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Điểm hiện tại</div>
                <div className="text-xl font-black text-green-400">{score} XP</div>
              </div>
            </div>
            <p className="mt-4 text-sm italic text-slate-400">{pictureData.caption}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                  Bảng Từ Khóa
                </div>
                <div className="mt-2 text-sm text-slate-300">
                  Mỗi câu hỏi mở ra một từ khóa và một góc hình ảnh.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-center">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Lượt hiện tại</div>
                <div className="text-lg font-black text-white">{Math.min(currentClueIndex + 1, clues.length)}/{clues.length}</div>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {clues.map((clue, index) => {
                const isCurrent = index === currentClueIndex && phase !== "final-open";
                const statusLabel = clue.revealed ? "Đã mở" : isCurrent ? "Đang xét" : "Chưa mở";
                return (
                  <div
                    key={clue.id}
                    className={`rounded-[24px] border p-4 ${
                      clue.revealed
                        ? "border-emerald-400/30 bg-emerald-500/10"
                        : isCurrent
                          ? "border-amber-400/30 bg-amber-500/10"
                          : "border-white/10 bg-slate-950/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">
                        Từ khóa {index + 1}
                      </div>
                      <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-300">
                        {statusLabel}
                      </div>
                    </div>
                    <div className="mt-4">{renderKeywordBoxes(clue.a, clue.revealed)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
              Điều Khiển Lượt Chơi
            </div>

            {questionFeedback && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">
                  Kết quả mở từ khóa
                </div>
                <p className="mt-2 text-white">
                  {questionFeedback.timeout
                    ? "Hết 15 giây. Từ khóa đã được mở."
                    : questionFeedback.correct
                      ? "Trả lời đúng. Từ khóa đã được mở."
                      : "Trả lời chưa đúng, nhưng từ khóa vẫn được mở để tiếp tục suy luận."}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Từ khóa đã được mở trên bảng bên trái.
                </p>
              </div>
            )}

            {guessFeedback && (
              <div className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4">
                <div className="text-sm font-black uppercase tracking-[0.18em] text-rose-300">
                  Phản hồi đoán đáp án
                </div>
                <p className="mt-2 text-white">{guessFeedback.explanation}</p>
                <p className="mt-2 text-sm text-slate-300">
                  Đáp án chỉ được công bố khi kết thúc hình này.
                </p>
              </div>
            )}

            {(phase === "question-ready" || phase === "question-active") && currentClue && (
              <div className="mt-4">
                <div className="rounded-[28px] border border-amber-400/10 bg-slate-950/70 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                      Câu hỏi {currentClueIndex + 1}
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                      <Clock3 size={14} />
                      {phase === "question-active" ? `${questionTimeLeft}s / ${QUESTION_SECONDS}s` : `${QUESTION_SECONDS}s`}
                    </div>
                  </div>

                  {phase === "question-ready" ? (
                    <div className="mt-6 rounded-2xl border border-sky-400/20 bg-sky-500/10 p-5">
                      <p className="text-sm leading-7 text-slate-100">
                        Câu hỏi và ô nhập đáp án đang ẩn. Bấm <span className="font-black text-sky-200">BẮT ĐẦU</span> để mở câu hỏi này và chạy 15 giây trả lời.
                      </p>
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <button
                          onClick={startQuestion}
                          className="rounded-2xl bg-amber-500 px-5 py-4 text-base font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-amber-400"
                        >
                          <span className="inline-flex items-center gap-2">
                            <HelpCircle size={18} />
                            BẮT ĐẦU
                          </span>
                        </button>
                        <button
                          disabled
                          className="rounded-2xl border border-white/10 bg-slate-800 px-5 py-4 text-base font-black uppercase tracking-[0.18em] text-white/50"
                        >
                          DỪNG
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      <h2 className="text-xl font-bold leading-relaxed text-white">
                        {currentClue.q}
                      </h2>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <button
                          disabled
                          className="rounded-2xl bg-amber-500 px-5 py-4 font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
                        >
                          BẮT ĐẦU
                        </button>
                        <button
                          onClick={toggleQuestionTimer}
                          className="rounded-2xl border border-white/10 bg-slate-800 px-5 py-4 font-black uppercase tracking-[0.18em] text-white transition hover:bg-slate-700"
                        >
                          {questionTimerRunning ? "DỪNG" : "TIẾP TỤC"}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={questionInput}
                        onChange={(event) => setQuestionInput(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && submitQuestion()}
                        placeholder="Nhập câu trả lời ngắn..."
                        disabled={!questionTimerRunning}
                        className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-4 text-lg font-semibold text-white outline-none transition focus:border-amber-400/40 disabled:opacity-60"
                      />
                      <button
                        onClick={submitQuestion}
                        disabled={!questionTimerRunning || !questionInput.trim()}
                        className="w-full rounded-2xl bg-emerald-600 px-5 py-4 font-black uppercase tracking-[0.18em] text-white transition hover:bg-emerald-500 disabled:opacity-50"
                      >
                        Chốt Câu Trả Lời
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(phase === "guess-ready" || phase === "guess-active" || phase === "final-open") && (
              <div className="mt-4 rounded-[28px] border border-sky-400/10 bg-slate-950/70 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                    {phase === "final-open" ? "Đoán Đáp Án Cuối" : "Đoán Nhanh Từ Hình Ảnh"}
                  </div>
                  {phase !== "final-open" && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-sky-300">
                      <Clock3 size={14} />
                      {phase === "guess-active" ? `${guessTimeLeft}s / ${GUESS_SECONDS}s` : `${GUESS_SECONDS}s`}
                    </div>
                  )}
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  {phase === "final-open"
                    ? "Cả 4 từ khóa đã mở. Có thể nhập đáp án cuối để chốt."
                    : "Sau khi mở từ khóa và một góc hình ảnh, học sinh có 15 giây để đoán nếu đã nhận ra đáp án."}
                </p>

                {phase === "guess-ready" ? (
                  <div className="mt-6 space-y-3">
                    <p className="text-sm leading-7 text-slate-100">
                      Ô đoán đáp án đang chờ lệnh bắt đầu. Bấm <span className="font-black text-sky-200">BẮT ĐẦU</span> để chạy 15 giây đoán nhanh.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={startGuessWindow}
                        className="flex-1 rounded-2xl bg-sky-500 px-5 py-4 font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-sky-400"
                      >
                        BẮT ĐẦU
                      </button>
                      <button
                        disabled
                        className="flex-1 rounded-2xl border border-white/10 bg-slate-800 px-5 py-4 font-black uppercase tracking-[0.18em] text-white/50"
                      >
                        DỪNG
                      </button>
                      <button
                        onClick={moveToNextClue}
                        className="flex-1 rounded-2xl border border-white/10 bg-slate-800 px-5 py-4 font-black uppercase tracking-[0.18em] text-white transition hover:bg-slate-700"
                      >
                        Bỏ Lượt Đoán
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {phase === "guess-active" ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <button
                          disabled
                          className="rounded-2xl bg-sky-500 px-5 py-4 font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
                        >
                          BẮT ĐẦU
                        </button>
                        <button
                          onClick={toggleGuessTimer}
                          className="rounded-2xl border border-white/10 bg-slate-800 px-5 py-4 font-black uppercase tracking-[0.18em] text-white transition hover:bg-slate-700"
                        >
                          {guessTimerRunning ? "DỪNG" : "TIẾP TỤC"}
                        </button>
                      </div>
                    ) : null}
                    <input
                      type="text"
                      value={guessInput}
                      onChange={(event) => setGuessInput(event.target.value)}
                      onKeyDown={(event) => event.key === "Enter" && submitGuess()}
                      placeholder="Nhập đáp án lịch sử..."
                      disabled={phase === "guess-active" && !guessTimerRunning}
                      className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-4 text-lg font-semibold text-white outline-none transition focus:border-sky-400/40 disabled:opacity-60"
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={submitGuess}
                        disabled={(phase === "guess-active" && (!guessTimerRunning || guessAttempted)) || !guessInput.trim()}
                        className="flex-1 rounded-2xl bg-amber-500 px-5 py-4 font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Search size={18} />
                          Xác Nhận Đáp Án
                        </span>
                      </button>
                      {phase === "guess-active" ? (
                        <button
                          onClick={moveToNextClue}
                          className="flex-1 rounded-2xl border border-white/10 bg-slate-800 px-5 py-4 font-black uppercase tracking-[0.18em] text-white transition hover:bg-slate-700"
                        >
                          Sang Lượt Kế
                        </button>
                      ) : (
                        <button
                          onClick={() => loadRound()}
                          className="flex-1 rounded-2xl border border-white/10 bg-slate-800 px-5 py-4 font-black uppercase tracking-[0.18em] text-white transition hover:bg-slate-700"
                        >
                          Đổi Hình Khác
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
