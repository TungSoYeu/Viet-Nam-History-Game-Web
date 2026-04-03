import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound, Puzzle, Trophy } from "lucide-react";
import { crosswordSets } from "../data/theme4GameData";
import useTheme4ModeData from "../hooks/useTheme4ModeData";
import {
  logGameTelemetry,
  matchesAnswer,
  resetModeSessionId,
  saveXp,
} from "../utils/gameHelpers";
import SkeletonLoader from "../components/SkeletonLoader";

const MODE_ID = "crossword-decoding";

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
  const [keywordInput, setKeywordInput] = useState("");
  const [keywordResult, setKeywordResult] = useState(null);
  const [summary, setSummary] = useState([]);
  const [finished, setFinished] = useState(false);
  const [xpSaved, setXpSaved] = useState(false);
  const startedAtRef = useRef(Date.now());
  const [scorePop, setScorePop] = useState(false);

  const activeCrosswordSets =
    Array.isArray(remoteCrosswordSets) && remoteCrosswordSets.length > 0
      ? remoteCrosswordSets
      : crosswordSets;
  const currentSet = activeCrosswordSets[setIndex];
  const currentClue = currentSet?.clues[clueIndex];
  const inCluePhase = currentSet && clueIndex < currentSet.clues.length;

  const keywordSlots = useMemo(() => {
    if (!currentSet) return [];
    return currentSet.keyword.split("").map((char, index) => ({
      char,
      visible: index < revealedCount,
    }));
  }, [currentSet, revealedCount]);

  const resetRound = () => {
    setClueIndex(0);
    setCorrectClues(0);
    setRevealedCount(0);
    setChoice("");
    setClueResult(null);
    setKeywordInput("");
    setKeywordResult(null);
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
        title: currentSet.title,
        theme: currentSet.theme,
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

  const handleAnswer = (option) => {
    if (!currentClue || clueResult) return;
    const correct = option === currentClue.correctAnswer;
    setChoice(option);
    setClueResult({ correct, answer: currentClue.correctAnswer });
    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct,
      sectionId: currentSet.id,
      clueIndex,
    });

    if (correct) {
      setScore((prev) => prev + 10);
      setCorrectClues((prev) => prev + 1);
      setRevealedCount((prev) => Math.min(currentSet.keyword.length, prev + 1));
      setScorePop(true);
      setTimeout(() => setScorePop(false), 500);
    }
  };

  const submitKeyword = (event) => {
    event.preventDefault();
    if (!currentSet || keywordResult) return;

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
    });
    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct,
      sectionId: currentSet.id,
      questionType: "keyword",
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <SkeletonLoader variant="card" count={2} className="max-w-xl" />
      </div>
    );
  }

  if (!currentSet && !finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-300">
        Chưa có bộ câu hỏi hợp lệ cho chế độ chơi này.
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-slate-950 text-white px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-4xl rounded-[32px] border border-amber-500/20 bg-slate-900/90 p-6 sm:p-8 shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
            <Trophy size={40} />
          </div>
          <h1 className="mt-5 text-center text-3xl sm:text-4xl font-black uppercase tracking-[0.18em] text-amber-300">
            Giải Mã Ô Chữ
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1e293b_0%,#020617_72%)] text-white px-4 py-6 sm:px-6">
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
              <Puzzle size={16} />
              Giải Mã Ô Chữ
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-black uppercase tracking-[0.18em] text-white">
              {currentSet.title}
            </h1>
            <p className="mt-2 text-sm text-slate-300">{currentSet.theme}</p>
          </div>

          <div className="flex items-center justify-center gap-3 md:justify-end">
            <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-center">
              <div className="text-[11px] uppercase tracking-[0.2em] text-amber-300/80">
                Phần
              </div>
              <div className="text-lg font-black text-amber-300">
                {setIndex + 1}/{activeCrosswordSets.length}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3 text-center">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Điểm
              </div>
              <div className={`text-lg font-black text-white transition-all ${scorePop ? 'animate-score-pop' : ''}`}>{score} XP</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-xl">
            <div className="rounded-[24px] border border-amber-400/10 bg-slate-950/70 p-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-300">
                <KeyRound size={16} />
                Khung Từ Khóa
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {keywordSlots.map((slot, index) => (
                  <div
                    key={`${slot.char}-${index}`}
                    className={`flex h-12 w-11 items-center justify-center rounded-xl border text-lg font-black uppercase ${
                      slot.visible
                        ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
                        : "border-white/10 bg-slate-800 text-slate-500"
                    }`}
                  >
                    {slot.visible ? slot.char : "?"}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-slate-300">
                Số câu đúng: {correctClues}/{currentSet.clues.length}
              </div>
              <div className="mt-3 h-2 w-full rounded-full border border-white/10 bg-slate-900/80 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                  style={{ width: `${(revealedCount / currentSet.keyword.length) * 100}%` }}
                />
              </div>
              <div className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Tiến độ mở ký tự: {revealedCount}/{currentSet.keyword.length}
              </div>
            </div>

            {inCluePhase ? (
              <div className="mt-6 rounded-[28px] border border-white/10 bg-slate-950/70 p-6">
                <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                  Câu gợi mở {clueIndex + 1}/{currentSet.clues.length}
                </div>
                <h2 className="mt-4 text-2xl font-bold leading-relaxed text-white">
                  {currentClue.question}
                </h2>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {currentClue.options.map((option, index) => {
                    const selected = choice === option;
                    const correct = option === currentClue.correctAnswer;

                    return (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={Boolean(clueResult)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          clueResult
                            ? correct
                              ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
                              : selected
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

                {clueResult && (
                  <div
                    className={`mt-5 rounded-2xl border px-5 py-4 ${
                      clueResult.correct
                        ? "border-emerald-400/30 bg-emerald-500/10"
                        : "border-rose-400/30 bg-rose-500/10"
                    }`}
                  >
                    <div className="text-lg font-black text-white">
                      {clueResult.correct
                        ? "Chính xác. Bạn đã mở thêm 1 ký tự."
                        : "Chưa đúng. Câu gợi mở này đã đóng."}
                    </div>
                    {!clueResult.correct && (
                      <div className="mt-2 text-sm text-slate-300">
                        Đáp án đúng:{" "}
                        <span className="font-bold text-amber-300">
                          {clueResult.answer}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setChoice("");
                        setClueResult(null);
                        setClueIndex((prev) => prev + 1);
                      }}
                      className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-black uppercase tracking-[0.18em] text-slate-900 transition hover:bg-amber-300"
                    >
                      {clueIndex === currentSet.clues.length - 1
                        ? "Giải Mã Từ Khóa"
                        : "Câu Kế Tiếp"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 rounded-[28px] border border-white/10 bg-slate-950/70 p-6">
                <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                  Từ Khóa Cuối
                </div>
                <p className="mt-4 text-slate-300">
                  Hãy dùng toàn bộ dữ kiện để giải mã từ khóa của phần này.
                </p>

                <form onSubmit={submitKeyword} className="mt-5">
                  <input
                    value={keywordInput}
                    onChange={(event) => setKeywordInput(event.target.value)}
                    disabled={Boolean(keywordResult)}
                    placeholder="Nhập từ khóa"
                    className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-4 text-lg font-semibold text-white outline-none transition focus:border-amber-400/40"
                  />
                  {!keywordResult && (
                    <button
                      type="submit"
                      className="mt-4 rounded-2xl bg-amber-500 px-5 py-3 font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-amber-400"
                    >
                      Kiểm Tra Từ Khóa
                    </button>
                  )}
                </form>

                {keywordResult && (
                  <div
                    className={`mt-5 rounded-2xl border px-5 py-4 ${
                      keywordResult.correct
                        ? "border-emerald-400/30 bg-emerald-500/10"
                        : "border-rose-400/30 bg-rose-500/10"
                    }`}
                  >
                    <div className="text-lg font-black text-white">
                      {keywordResult.correct
                        ? "Đã giải mã đúng từ khóa."
                        : "Chưa giải mã đúng từ khóa."}
                    </div>
                    <div className="mt-2 text-sm text-slate-300">
                      Đáp án mẫu:{" "}
                      <span className="font-bold text-amber-300">
                        {keywordResult.answer}
                      </span>
                    </div>
                    <button
                      onClick={() => finishSection(keywordResult.correct)}
                      className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-black uppercase tracking-[0.18em] text-slate-900 transition hover:bg-amber-300"
                    >
                      {setIndex === activeCrosswordSets.length - 1
                        ? "Kết Thúc Chế Độ"
                        : "Sang Phần Tiếp"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-xl">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                Theo Dõi Tiến Độ
              </div>
              <div className="mt-4 space-y-3">
                {activeCrosswordSets.map((item, index) => {
                  const done = summary.find((entry) => entry.id === item.id);
                  const active = index === setIndex;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border px-4 py-4 ${
                        active
                          ? "border-amber-400/30 bg-amber-500/10"
                          : done
                            ? "border-emerald-400/20 bg-emerald-500/10"
                            : "border-white/10 bg-slate-800/80"
                      }`}
                    >
                      <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                        {item.title}
                      </div>
                      <div className="mt-2 font-bold text-white">{item.theme}</div>
                      <div className="mt-2 text-sm text-slate-300">
                        {done
                          ? `${done.correctClues}/${done.totalClues} câu`
                          : active
                            ? "Đang chơi"
                            : "Chưa mở"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
