import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound, Puzzle, Trophy } from "lucide-react";
import { crosswordSets } from "../data/theme4GameData";
import useTheme4ModeData from "../hooks/useTheme4ModeData";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import Confetti from "../components/animations/Confetti";
import {
  logGameTelemetry,
  matchesAnswer,
  resetModeSessionId,
  saveXp,
} from "../utils/gameHelpers";
import SkeletonLoader from "../components/SkeletonLoader";

const MODE_ID = "crossword-decoding";
const QUESTION_TIME = 15;
const BOARD_CELL_GAP = 1;
const BOARD_ROW_GAP = 1;
const BOARD_ROW_LABEL_WIDTH = 20;
const BOARD_ROW_LABEL_GAP = 4;

const normalizeBoardText = (value) =>
  (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/Đ/g, "D")
    .replace(/đ/g, "d")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();

const getSolvedSectionLabel = (section, fallbackTitle) =>
  section?.acceptedAnswers?.[0]
    ? `Từ khóa hàng dọc: ${section.acceptedAnswers[0]}`
    : fallbackTitle;

export default function MillionaireMode() {
  const navigate = useNavigate();
  const { data: remoteCrosswordSets, loading } = useTheme4ModeData(
    MODE_ID,
    crosswordSets
  );
  const [setIndex, setSetIndex] = useState(0);
  const [clueIndex, setClueIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctClues, setCorrectClues] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [choice, setChoice] = useState("");
  const [clueResult, setClueResult] = useState(null);
  const [cluePhase, setCluePhase] = useState("ready");
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [timerRunning, setTimerRunning] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywordPhase, setKeywordPhase] = useState("ready");
  const [keywordTimeLeft, setKeywordTimeLeft] = useState(QUESTION_TIME);
  const [keywordResult, setKeywordResult] = useState(null);
  const [summary, setSummary] = useState([]);
  const [rowResults, setRowResults] = useState({});
  const [finished, setFinished] = useState(false);
  const [xpSaved, setXpSaved] = useState(false);
  const startedAtRef = useRef(Date.now());
  const [scorePop, setScorePop] = useState(false);
  
  const gridContainerRef = useRef(null);
  const [cellPx, setCellPx] = useState(40); 

  const activeCrosswordSets =
    Array.isArray(remoteCrosswordSets) && remoteCrosswordSets.length > 0
      ? remoteCrosswordSets
      : crosswordSets;
  const currentSet = activeCrosswordSets[setIndex];
  const currentClue = currentSet?.clues[clueIndex];
  const inCluePhase = currentSet && clueIndex < currentSet.clues.length;
  const displayTitle = `Ô chữ ${setIndex + 1}`;

  const keywordSlots = useMemo(() => {
    if (!currentSet) return [];
    return currentSet.keyword.split("").map((char, index) => ({
      char,
      visible: index < revealedCount,
    }));
  }, [currentSet, revealedCount]);

  const maxHighlightIndex = useMemo(() => {
    if (!currentSet) return 0;
    return Math.max(...currentSet.clues.map(clue => {
      const answer = normalizeBoardText(clue.boardAnswer || clue.correctAnswer);
      const explicit = Number.isInteger(clue.highlightIndex) ? clue.highlightIndex : null;
      return explicit != null 
        ? Math.max(0, Math.min(answer.length - 1, explicit)) 
        : (answer.length > 0 ? Math.min(answer.length - 1, Math.floor(answer.length / 2)) : 0);
    }));
  }, [currentSet]);
  
  const boardRows = useMemo(() => {
    if (!currentSet) return [];

    return currentSet.clues.map((clue, index) => {
      const answer = normalizeBoardText(clue.boardAnswer || clue.correctAnswer);
      const explicitHighlightIndex = Number.isInteger(clue.highlightIndex)
        ? clue.highlightIndex
        : null;
      const fallbackHighlightIndex =
        answer.length > 0 ? Math.min(answer.length - 1, Math.floor(answer.length / 2)) : 0;
      const highlightIndex = explicitHighlightIndex != null
        ? Math.max(0, Math.min(answer.length - 1, explicitHighlightIndex))
        : fallbackHighlightIndex;
      
    
      const padding = Math.max(0, maxHighlightIndex - highlightIndex);

      return {
        index,
        answer,
        padding,
        highlightIndex,
        keywordLetter: currentSet.keyword[index] || "",
        status: rowResults[index] || null,
      };
    });
  }, [currentSet, rowResults, maxHighlightIndex]);

  const maxRowCells = useMemo(() => {
    if (!boardRows.length) return 10;
    return Math.max(...boardRows.map((row) => row.padding + row.answer.length));
  }, [boardRows]);

 
  useEffect(() => {
    const el = gridContainerRef.current;
    if (!el) return;

    let timeoutId;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      
    
      if (rect.width === 0 || rect.height === 0) {
        timeoutId = setTimeout(measure, 50);
        return;
      }

      const numRows = boardRows.length || 1;
      const numCols = maxRowCells || 10;

      const availW = rect.width - BOARD_ROW_LABEL_WIDTH - BOARD_ROW_LABEL_GAP - (numCols - 1) * BOARD_CELL_GAP - 32;
      const availH = rect.height - (numRows - 1) * BOARD_ROW_GAP - 32;

      const pxByW = availW / numCols;
      const pxByH = availH / numRows;

      
      let exactPx = Math.floor(Math.min(pxByW, pxByH));
      
     
      setCellPx(Math.max(exactPx, 25));
    };

    measure();

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(measure);
    });
    ro.observe(el);

    return () => {
      clearTimeout(timeoutId);
      ro.disconnect();
    };
  }, [maxRowCells, boardRows.length]);

  const boardLayout = useMemo(() => ({
    width:
      BOARD_ROW_LABEL_WIDTH +
      BOARD_ROW_LABEL_GAP +
      maxRowCells * cellPx +
      Math.max(0, maxRowCells - 1) * BOARD_CELL_GAP,
    height:
      boardRows.length * cellPx +
      Math.max(0, boardRows.length - 1) * BOARD_ROW_GAP,
  }), [boardRows.length, cellPx, maxRowCells]);

  const resetRound = () => {
    setClueIndex(0);
    setCorrectClues(0);
    setRevealedCount(0);
    setChoice("");
    setClueResult(null);
    setCluePhase("ready");
    setTimeLeft(QUESTION_TIME);
    setTimerRunning(false);
    setKeywordInput("");
    setKeywordPhase("ready");
    setKeywordTimeLeft(QUESTION_TIME);
    setKeywordResult(null);
    setRowResults({});
  };

  useEffect(() => {
    if (loading || activeCrosswordSets.length === 0) return;

    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    logGameTelemetry(MODE_ID, "session_start", {
      totalSections: activeCrosswordSets.length,
    });
    setSetIndex(0);
    setScore(0);
    setSummary([]);
    setFinished(false);
    setXpSaved(false);
    resetRound();
  }, [activeCrosswordSets, loading]);

  useEffect(() => {
    if (finished && !xpSaved) {
      logGameTelemetry(MODE_ID, "session_end", {
        solved: true,
        score,
        durationMs: Date.now() - startedAtRef.current,
      });
      saveXp(score);
      setXpSaved(true);
    }
  }, [finished, score, xpSaved]);

  useEffect(() => {
    if (!inCluePhase || cluePhase !== "active" || !timerRunning || clueResult || finished || timeLeft <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [cluePhase, clueResult, finished, inCluePhase, timeLeft, timerRunning]);

  useEffect(() => {
    if (!inCluePhase || cluePhase !== "active" || !timerRunning || clueResult || finished || timeLeft > 0) {
      return;
    }
    handleAnswer("", "time_up");
  }, [cluePhase, clueResult, finished, inCluePhase, timeLeft, timerRunning]);

  useEffect(() => {
    if (inCluePhase || keywordPhase !== "active" || !timerRunning || keywordResult || finished || keywordTimeLeft <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setKeywordTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [finished, inCluePhase, keywordPhase, keywordResult, keywordTimeLeft, timerRunning]);

  useEffect(() => {
    if (inCluePhase || keywordPhase !== "active" || !timerRunning || keywordResult || finished || keywordTimeLeft > 0) {
      return;
    }
    submitKeyword(null, "time_up");
  }, [finished, inCluePhase, keywordPhase, keywordResult, keywordTimeLeft, timerRunning]);

  const handleExit = async () => {
    logGameTelemetry(MODE_ID, "session_end", {
      solved: false,
      score,
      durationMs: Date.now() - startedAtRef.current,
    });
    if (!finished && score > 0) await saveXp(score);
    navigate("/modes");
  };

  const finishSection = (solvedKeyword) => {
    const nextSummary = [
      ...summary,
      {
        id: currentSet.id,
        title: displayTitle,
        theme: getSolvedSectionLabel(currentSet, displayTitle),
        solvedKeyword,
        correctClues,
        totalClues: currentSet.clues.length,
      },
    ];

    setSummary(nextSummary);

    if (setIndex === activeCrosswordSets.length - 1) {
      setFinished(true);
      return;
    }

    setSetIndex((prev) => prev + 1);
    resetRound();
  };

  const startClue = () => {
    if (!currentClue || clueResult) return;
    setChoice("");
    setCluePhase("active");
    setTimeLeft(QUESTION_TIME);
    setTimerRunning(true);
    logGameTelemetry(MODE_ID, "question_started", {
      sectionId: currentSet.id,
      clueIndex,
      durationSeconds: QUESTION_TIME,
    });
  };

  const handleAnswer = (option, reason = "manual") => {
    if (!currentClue || clueResult || cluePhase !== "active" || !timerRunning) return;
    const correct = option === currentClue.correctAnswer;
    setChoice(option);
    setClueResult({ correct, answer: currentClue.correctAnswer, timedOut: reason === "time_up" });
    setCluePhase("review");
    setTimerRunning(false);
    setRowResults((prev) => ({
      ...prev,
      [clueIndex]: {
        completed: true,
        correct,
        answer: normalizeBoardText(currentClue.boardAnswer || currentClue.correctAnswer),
      },
    }));
    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct,
      sectionId: currentSet.id,
      clueIndex,
      reason,
    });

    if (correct) {
      setScore((prev) => prev + 10);
      setCorrectClues((prev) => prev + 1);
      setRevealedCount((prev) => Math.min(currentSet.keyword.length, prev + 1));
      setScorePop(true);
      setTimeout(() => setScorePop(false), 500);
    }
  };

  const startKeyword = () => {
    if (!currentSet || keywordResult) return;
    setKeywordPhase("active");
    setKeywordTimeLeft(QUESTION_TIME);
    setTimerRunning(true);
    logGameTelemetry(MODE_ID, "question_started", {
      sectionId: currentSet.id,
      questionType: "keyword",
      durationSeconds: QUESTION_TIME,
    });
  };

  const submitKeyword = (event, reason = "manual") => {
    event?.preventDefault();
    if (!currentSet || keywordResult || keywordPhase !== "active" || (!timerRunning && reason !== "time_up")) return;

    const correct = matchesAnswer(keywordInput, [
      currentSet.keyword,
      ...(currentSet.acceptedAnswers || []),
    ]);

    if (correct) {
      setScore((prev) => prev + 20);
      setScorePop(true);
      setTimeout(() => setScorePop(false), 500);
    }
    setKeywordResult({
      correct,
      answer: currentSet.acceptedAnswers?.[0] || currentSet.keyword,
      timedOut: reason === "time_up",
    });
    setKeywordPhase("review");
    setTimerRunning(false);
    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct,
      sectionId: currentSet.id,
      questionType: "keyword",
      reason,
    });
  };

  const restartMode = () => {
    logGameTelemetry(MODE_ID, "session_end", {
      solved: false,
      score,
      durationMs: Date.now() - startedAtRef.current,
      reason: "restart",
    });
    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    logGameTelemetry(MODE_ID, "session_start", {
      totalSections: activeCrosswordSets.length,
      replay: true,
    });
    setSetIndex(0);
    setScore(0);
    setSummary([]);
    setFinished(false);
    setXpSaved(false);
    resetRound();
  };

  const toggleTimerRunning = () => {
    setTimerRunning((prev) => !prev);
  };

  useKeyboardShortcuts(
    {
      Escape: handleExit,
      '1': () => currentClue?.options?.[0] && handleAnswer(currentClue.options[0], "manual"),
      '2': () => currentClue?.options?.[1] && handleAnswer(currentClue.options[1], "manual"),
      '3': () => currentClue?.options?.[2] && handleAnswer(currentClue.options[2], "manual"),
      '4': () => currentClue?.options?.[3] && handleAnswer(currentClue.options[3], "manual"),
      Enter: () => {
        if (!inCluePhase && keywordPhase === "active" && timerRunning && keywordInput.trim()) {
          submitKeyword(null, "manual");
        }
      },
      ' ': () => {
        if (inCluePhase) {
          if (cluePhase === "ready" && !clueResult) {
            startClue();
            return;
          }
          if (cluePhase === "active") {
            toggleTimerRunning();
          }
          return;
        }

        if (keywordPhase === "ready" && !keywordResult) {
          startKeyword();
          return;
        }
        if (keywordPhase === "active") {
          toggleTimerRunning();
        }
      },
    },
    !finished
  );

  const displayTimer = inCluePhase
    ? cluePhase === "ready"
      ? QUESTION_TIME
      : timeLeft
    : keywordPhase === "ready"
      ? QUESTION_TIME
      : keywordTimeLeft;

  if (loading) {
    return (
      <div className="theme-page game-screen min-h-screen flex flex-col items-center justify-center p-8 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <SkeletonLoader variant="card" count={2} className="max-w-xl" />
      </div>
    );
  }

  if (!currentSet && !finished) {
    return (
      <div className="theme-page game-screen min-h-screen flex items-center justify-center overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-950 text-amber-300">
        Chưa có bộ câu hỏi hợp lệ cho chế độ chơi này.
      </div>
    );
  }

  if (finished) {
    return (
      <div className="theme-page game-screen min-h-screen overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-950 text-white px-4 py-8 flex items-center justify-center">
        <Confetti active={true} count={90} />
        <div className="w-full max-w-4xl rounded-[32px] border border-amber-500/20 bg-slate-900/90 p-6 sm:p-8 shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
            <Trophy size={40} />
          </div>
          <h1 className="vn-safe-heading mt-5 text-center text-3xl sm:text-4xl font-black tracking-[0.08em] text-amber-300">
            Giải mã ô chữ
          </h1>
          <p className="mt-4 text-center text-slate-300">
            Bạn đã hoàn thành toàn bộ {activeCrosswordSets.length} từ khóa hàng dọc của chế độ ô chữ Chủ đề 4.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {summary.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-slate-800/70 p-4"
              >
                <div className="text-xs font-black uppercase tracking-[0.22em] text-amber-300/80">
                  {item.title}
                </div>
                <div className="mt-2 text-lg font-bold text-white">{item.theme}</div>
                <div className="mt-3 text-sm text-slate-300">
                  {item.correctClues}/{item.totalClues} câu đã giải
                </div>
                <div
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${
                    item.solvedKeyword
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-rose-500/20 text-rose-300"
                  }`}
                >
                  {item.solvedKeyword ? "Giải mã đúng" : "Chưa giải đúng"}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
              Tổng Điểm
            </div>
            <div className="mt-2 text-4xl font-black text-amber-300">{score} XP</div>
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

  /* ── Timer visual helpers ── */
  const timerPercent = (inCluePhase ? (cluePhase === "active" ? timeLeft : QUESTION_TIME) : (keywordPhase === "active" ? keywordTimeLeft : QUESTION_TIME)) / QUESTION_TIME * 100;
  const timerColor = displayTimer <= 5 ? "#ef4444" : displayTimer <= 10 ? "#f59e0b" : "#38bdf8";


  return (
    <div className="theme-page game-screen h-screen flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar bg-transparent text-white p-1.5 sm:p-2">
      <div className="mx-auto flex h-full w-full flex-col min-h-0">

        {/* ═══ COMPACT HEADER BAR ═══ */}
        <div className="flex-shrink-0 flex items-center gap-2 mb-1.5 p-1.5 sm:p-2 rounded-2xl"
          style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(16px)" }}
        >
          <button onClick={handleExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 transition-all hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Thoát</span>
          </button>

          <div className="flex-1 flex items-center justify-center gap-2">
            <Puzzle size={14} className="text-amber-400 shrink-0" />
            <h1 className="vn-safe-heading text-sm sm:text-base font-black tracking-wide"
              style={{ background: "linear-gradient(135deg, #f0d48a, #d4a053)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              {displayTitle}
            </h1>
          </div>

          <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
            <svg width="84" height="84" viewBox="0 0 84 84" className="absolute -rotate-90">
              <circle cx="42" cy="42" r="36" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
              <circle cx="42" cy="42" r="36" fill="none" stroke={timerColor} strokeWidth="5"
                strokeDasharray={2 * Math.PI * 36} strokeDashoffset={2 * Math.PI * 36 * (1 - timerPercent / 100)}
                strokeLinecap="round" className="transition-all duration-1000"
              />
            </svg>
            <span className="text-2xl font-black" style={{ color: timerColor }}>
              {displayTimer}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="px-2 py-1 rounded-lg text-[11px] font-black text-slate-300"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {inCluePhase ? `${clueIndex + 1}/${currentSet.clues.length}` : "Từ khóa"}
            </div>
            <div className="px-2 py-1 rounded-lg text-[11px] font-black text-slate-300"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {setIndex + 1}<span className="text-slate-500">/{activeCrosswordSets.length}</span>
            </div>
            <div className="px-2 py-1 rounded-lg text-[11px] font-black"
              style={{ color: "#fbbf24", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.15)" }}
            >
              <span className={`transition-all ${scorePop ? 'scale-125' : ''}`}>{score} XP</span>
            </div>
          </div>
        </div>

        {/* ═══ MAIN 3-COLUMN AREA ═══ */}
        <div className="flex flex-col xl:flex-row gap-1.5 flex-1 min-h-0 overflow-hidden">

          {/* ── COL 1: Crossword Grid ── */}
          <div className="xl:w-[72%] 2xl:w-[74%] w-full flex flex-col min-h-0 overflow-hidden rounded-2xl"
            style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}
          >
            <div className="flex-shrink-0 flex items-center justify-between px-2.5 py-1 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(99,102,241,0.2))" }}
                >
                  <KeyRound size={13} className="text-sky-400" />
                </div>
                <span className="text-xs font-black text-sky-300 uppercase tracking-wider">Bảng ô chữ</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ color: "#94a3b8", background: "rgba(255,255,255,0.04)" }}
              >
                {correctClues}/{currentSet.clues.length} đúng
              </span>
            </div>

            {/* Vùng lưới được tự động đo và ép tỷ lệ căng khít nhất có thể */}
            <div ref={gridContainerRef} className="flex-1 min-h-0 w-full overflow-hidden flex items-center justify-center p-2 sm:p-4 relative">
              <div
                className="shrink-0 transition-all duration-300 ease-out absolute"
                style={{
                  width: boardLayout.width,
                  height: boardLayout.height,
                  display: "flex",
                  flexDirection: "column",
                  gap: BOARD_ROW_GAP,
                }}
              >
                {boardRows.map((row) => (
                  <div
                    key={`board-row-${row.index}`}
                    className="flex items-center"
                    style={{ gap: BOARD_ROW_LABEL_GAP }}
                  >
                    <div
                      className="text-right font-black text-slate-200 shrink-0"
                      style={{
                        width: BOARD_ROW_LABEL_WIDTH, 
                        fontSize: Math.max(16, Math.floor(cellPx * 0.44)),
                      }}
                    >
                      {row.index + 1}.
                    </div>
                    <div className="flex" style={{ gap: BOARD_CELL_GAP }}>
                      {Array.from({ length: row.padding }).map((_, padIndex) => (
                        <div key={`pad-${row.index}-${padIndex}`} style={{ width: cellPx, height: cellPx }} />
                      ))}
                      {row.answer.split("").map((char, cellIndex) => {
                        const isKeywordCell = row.keywordLetter && cellIndex === row.highlightIndex;
                        const rowCompleted = Boolean(row.status?.completed);
                        const showLetter = rowCompleted;
                        const visibleChar = isKeywordCell && row.status?.correct
                          ? row.keywordLetter
                          : showLetter
                            ? char
                            : "";

                        return (
                          <div
                            key={`cell-${row.index}-${cellIndex}`}
                            style={{
                              width: cellPx,
                              height: cellPx,
                              // Cỡ chữ được boost to lên để nhìn rõ nét nhất
                              fontSize: Math.max(16, Math.floor(cellPx * 0.55)),
                            }}
                            className={`flex items-center justify-center border font-black uppercase ${
                              isKeywordCell
                                ? "border-amber-300 bg-amber-200/90 text-rose-500"
                                : "border-slate-300 bg-white/90 text-slate-900"
                            }`}
                          >
                            {visibleChar}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword slots + progress bar - fixed at bottom */}
            <div className="flex-shrink-0 px-2 py-1 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex flex-wrap gap-1 mb-1">
                {keywordSlots.map((slot, index) => (
                  <div
                    key={`${slot.char}-${index}`}
                    style={{
                      width: Math.max(28, Math.min(cellPx, 46)),
                      height: Math.max(28, Math.min(cellPx, 46)),
                      fontSize: Math.max(11, Math.floor(Math.min(cellPx, 46) * 0.44)),
                    }}
                    className={`flex items-center justify-center rounded-lg border font-black uppercase ${
                      slot.visible
                        ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
                        : "border-white/10 bg-slate-800 text-slate-500"
                    }`}
                  >
                    {slot.visible ? slot.char : "?"}
                  </div>
                ))}
              </div>
              <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(revealedCount / currentSet.keyword.length) * 100}%`,
                    background: "linear-gradient(90deg, #38bdf8, #34d399, #fbbf24)",
                  }}
                />
              </div>
              <div className="mt-0.5 text-[9px] font-bold text-slate-500">
                Tiến độ: {revealedCount}/{currentSet.keyword.length} ký tự
              </div>
            </div>
          </div>

          {/* ── COL 2: Question / Controls ── */}
          <div className="xl:w-[28%] 2xl:w-[26%] w-full flex flex-col min-h-0 overflow-hidden rounded-2xl"
            style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}
          >
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.2))" }}
                >
                  <Puzzle size={13} className="text-amber-400" />
                </div>
                <span className="text-sm font-black text-amber-300 uppercase tracking-wider">
                  {inCluePhase ? `Câu gợi mở ${clueIndex + 1}/${currentSet.clues.length}` : "Từ khóa cuối"}
                </span>
              </div>
            </div>

            <div className="custom-scrollbar flex-1 min-h-0 overflow-y-auto p-4 sm:p-5">
              {inCluePhase ? (
                <>
                  {cluePhase === "ready" && !clueResult ? (
                    <div className="rounded-[26px] p-5 text-center"
                      style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.12)" }}
                    >
                      <div className="text-xs font-black uppercase tracking-wider text-sky-300 mb-4">
                        Câu gợi mở {clueIndex + 1}
                      </div>
                      <button onClick={startClue}
                          className="w-full py-4 rounded-2xl text-base font-black uppercase tracking-[0.18em] transition-all hover:scale-[1.01]"
                          style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", color: "#0f172a" }}
                        >
                        ▶ Bắt Đầu
                      </button>
                    </div>
                  ) : null}

                  {cluePhase === "active" && !clueResult ? (
                    <>
                      <h2 className="mb-4 text-xl font-bold leading-relaxed text-white sm:text-2xl">
                        {currentClue.question}
                      </h2>
                      <div className="flex gap-2 mb-3">
                        <button disabled
                          className="px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wider text-white/30"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          Bắt đầu
                        </button>
                        <button onClick={toggleTimerRunning}
                          className="px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wider text-white transition-all hover:bg-white/5"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          {timerRunning ? "⏸ Dừng" : "▶ Tiếp"}
                        </button>
                      </div>
                      <div className="grid gap-3 grid-cols-2">
                        {currentClue.options.map((option, index) => {
                          const selected = choice === option;
                          return (
                            <button
                              key={option}
                              onClick={() => handleAnswer(option, "manual")}
                              disabled={!timerRunning}
                              className={`rounded-2xl p-4 text-left transition-all disabled:opacity-50 ${
                                selected
                                  ? "text-white"
                                  : "text-white hover:scale-[1.01]"
                              }`}
                              style={{
                                background: selected ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.03)",
                                border: `1.5px solid ${selected ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.06)"}`,
                              }}
                            >
                              <div className="text-[10px] font-black uppercase tracking-widest text-amber-300/70">
                                {String.fromCharCode(65 + index)}
                              </div>
                              <div className="mt-2 text-base font-bold sm:text-lg">{option}</div>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : null}

                  {clueResult && (
                    <div className={`rounded-xl p-4 ${
                      clueResult.correct
                        ? "bg-emerald-500/8 border border-emerald-400/20"
                        : "bg-rose-500/8 border border-rose-400/20"
                    }`}>
                      <div className="text-sm font-black text-white">
                        {clueResult.correct
                          ? "✓ Chính xác — mở thêm 1 ký tự."
                          : clueResult.timedOut
                            ? "✗ Hết giờ."
                            : "✗ Chưa đúng."}
                      </div>
                      {!clueResult.correct && (
                        <div className="mt-1 text-xs text-slate-400">
                          Đáp án sẽ được công bố khi kết thúc chế độ.
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setChoice("");
                          setClueResult(null);
                          setCluePhase("ready");
                          setTimeLeft(QUESTION_TIME);
                          setTimerRunning(false);
                          setClueIndex((prev) => prev + 1);
                        }}
                        className="mt-3 px-5 py-2 rounded-xl text-sm font-black uppercase tracking-wider transition-all hover:scale-[1.02]"
                        style={{ background: "linear-gradient(135deg, #34d399, #10b981)", color: "#0f172a" }}
                      >
                        {clueIndex === currentSet.clues.length - 1 ? "Giải Mã Từ Khóa" : "Câu Kế Tiếp →"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {keywordPhase === "ready" && !keywordResult ? (
                    <div className="rounded-[26px] p-5 text-center"
                      style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.12)" }}
                    >
                      <div className="text-xs font-black uppercase tracking-wider text-sky-300 mb-4">
                        Từ khóa cuối
                      </div>
                      <button onClick={startKeyword}
                          className="w-full py-4 rounded-2xl text-base font-black uppercase tracking-[0.18em] transition-all hover:scale-[1.01]"
                          style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", color: "#0f172a" }}
                        >
                          ▶ Bắt Đầu
                      </button>
                    </div>
                  ) : (
                    <>
                      {!keywordResult && (
                        <div className="flex gap-2 mb-3">
                          <button disabled
                            className="px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wider text-white/30"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                          >
                            Bắt đầu
                          </button>
                          <button onClick={toggleTimerRunning}
                            className="px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wider text-white transition-all hover:bg-white/5"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                          >
                            {timerRunning ? "⏸ Dừng" : "▶ Tiếp"}
                          </button>
                        </div>
                      )}
                      <form onSubmit={submitKeyword}>
                        <input
                          value={keywordInput}
                          onChange={(event) => setKeywordInput(event.target.value)}
                          disabled={Boolean(keywordResult) || !timerRunning}
                          placeholder="Nhập từ khóa"
                          className="w-full rounded-2xl border border-white/10 bg-slate-800 px-5 py-4 text-lg font-semibold text-white outline-none transition focus:border-amber-400/40 disabled:opacity-60"
                        />
                        {!keywordResult && (
                          <button type="submit" disabled={!timerRunning || !keywordInput.trim()}
                            className="mt-4 w-full py-4 rounded-2xl text-base font-black uppercase tracking-[0.18em] transition-all disabled:opacity-40"
                            style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#0f172a" }}
                          >
                            Kiểm Tra Từ Khóa
                          </button>
                        )}
                      </form>
                    </>
                  )}

                  {keywordResult && (
                    <div className={`mt-3 rounded-xl p-4 ${
                      keywordResult.correct
                        ? "bg-emerald-500/8 border border-emerald-400/20"
                        : "bg-rose-500/8 border border-rose-400/20"
                    }`}>
                      <div className="text-sm font-black text-white">
                        {keywordResult.correct
                          ? "✓ Đã giải mã đúng từ khóa."
                          : keywordResult.timedOut
                            ? "✗ Hết thời gian."
                            : "✗ Chưa giải mã đúng."}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        Từ khóa chuẩn sẽ được công bố khi kết thúc chế độ.
                      </div>
                      <button
                        onClick={() => finishSection(keywordResult.correct)}
                        className="mt-3 px-5 py-2 rounded-xl text-sm font-black uppercase tracking-wider transition-all hover:scale-[1.02]"
                        style={{ background: "linear-gradient(135deg, #34d399, #10b981)", color: "#0f172a" }}
                      >
                        {setIndex === activeCrosswordSets.length - 1 ? "Kết Thúc Chế Độ" : "Sang Phần Tiếp →"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── COL 3: Progress Sidebar ── */}
          <div className="hidden"
            style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}
          >
            <div className="flex-shrink-0 px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Tiến Độ</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-2.5 space-y-2">
              {activeCrosswordSets.map((item, index) => {
                const done = summary.find((entry) => entry.id === item.id);
                const active = index === setIndex;
                let borderCol = "rgba(255,255,255,0.06)";
                let bgCol = "rgba(255,255,255,0.015)";
                if (active) { borderCol = "rgba(251,191,36,0.2)"; bgCol = "rgba(251,191,36,0.04)"; }
                if (done) { borderCol = "rgba(52,211,153,0.2)"; bgCol = "rgba(52,211,153,0.04)"; }

                return (
                  <div key={item.id}
                    className="rounded-xl p-3 transition-all"
                    style={{ background: bgCol, border: `1px solid ${borderCol}` }}
                  >
                    <div className="text-sm font-black uppercase tracking-widest"
                      style={{ color: done ? "#6ee7b7" : active ? "#fbbf24" : "#64748b" }}
                    >
                      {`Ô chữ ${index + 1}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
