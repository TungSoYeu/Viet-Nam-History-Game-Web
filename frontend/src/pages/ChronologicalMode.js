import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, History, RefreshCcw, Trophy } from "lucide-react";
import { historicalFlowSets } from "../data/theme4GameData";
import useTheme4ModeData from "../hooks/useTheme4ModeData";
import {
  logGameTelemetry,
  resetModeSessionId,
  saveXp,
  shuffleArray,
} from "../utils/gameHelpers";

const MODE_ID = "historical-flow";
const ROUND_TIME = 15;
const ROUND_SCORE = 20;

const lines = [
  { id: "context", label: "Dòng 1", title: "Bối cảnh" },
  { id: "developments", label: "Dòng 2", title: "Diễn biến" },
  { id: "result", label: "Dòng 3", title: "Kết quả - Ý nghĩa" },
  { id: "legacy", label: "Dòng 4", title: "Di sản" },
];
const lineColors = {
  context: "border-sky-400/30 bg-sky-500/10",
  developments: "border-violet-400/30 bg-violet-500/10",
  result: "border-emerald-400/30 bg-emerald-500/10",
  legacy: "border-amber-400/30 bg-amber-500/10",
};

function normalizeFlowSets(data) {
  if (Array.isArray(data)) {
    return data.filter(
      (item) => item && typeof item === "object" && Array.isArray(item.sentences)
    );
  }

  if (data && typeof data === "object" && Array.isArray(data.sentences)) {
    return [data];
  }

  return [];
}

function createBoard(flowSet) {
  let scrambled = Array.isArray(flowSet?.sentences) ? [...flowSet.sentences] : [];

  scrambled = shuffleArray(scrambled);
  scrambled = shuffleArray(scrambled);
  scrambled = shuffleArray(scrambled);

  return scrambled.map((sentence, index) => ({
    ...sentence,
    selectedGroup: "",
    sortSeed: `${index}-${sentence.id}`,
  }));
}

export default function ChronologicalMode() {
  const navigate = useNavigate();
  const { data: remoteHistoricalFlowSets, loading } = useTheme4ModeData(
    MODE_ID,
    historicalFlowSets
  );
  const activeHistoricalFlowSets = useMemo(() => {
    const remoteSets = normalizeFlowSets(remoteHistoricalFlowSets);
    return remoteSets.length > 0 ? remoteSets : normalizeFlowSets(historicalFlowSets);
  }, [remoteHistoricalFlowSets]);

  const [sentences, setSentences] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [incorrectIds, setIncorrectIds] = useState([]);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [xpSaved, setXpSaved] = useState(false);
  const [boardReady, setBoardReady] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [roundStarted, setRoundStarted] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [roundSolved, setRoundSolved] = useState(false);
  const startedAtRef = useRef(Date.now());

  const totalRounds = activeHistoricalFlowSets.length;
  const currentRound = activeHistoricalFlowSets[roundIndex] || null;

  const prepareRound = useCallback((nextRoundIndex, nextSets = activeHistoricalFlowSets) => {
    const nextRound = nextSets[nextRoundIndex];
    setRoundIndex(nextRoundIndex);
    setSentences(createBoard(nextRound));
    setFeedback(null);
    setIncorrectIds([]);
    setTimeLeft(ROUND_TIME);
    setRoundStarted(false);
    setTimerRunning(false);
    setRoundSolved(false);
    setBoardReady(true);
  }, [activeHistoricalFlowSets]);

  const resetSession = useCallback((replay = false) => {
    if (activeHistoricalFlowSets.length === 0) return;

    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    logGameTelemetry(MODE_ID, "session_start", {
      totalRounds: activeHistoricalFlowSets.length,
      replay,
    });
    setFinished(false);
    setScore(0);
    setXpSaved(false);
    prepareRound(0, activeHistoricalFlowSets);
  }, [activeHistoricalFlowSets, prepareRound]);

  useEffect(() => {
    if (loading || totalRounds === 0) return;
    resetSession(false);
  }, [loading, resetSession, totalRounds]);

  useEffect(() => {
    if (!roundStarted || !timerRunning || finished || timeLeft <= 0) return undefined;

    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [finished, roundStarted, timeLeft, timerRunning]);

  useEffect(() => {
    if (finished && !xpSaved) {
      logGameTelemetry(MODE_ID, "session_end", {
        solved: true,
        score,
        durationMs: Date.now() - startedAtRef.current,
        totalRounds,
      });
      saveXp(score);
      setXpSaved(true);
    }
  }, [finished, score, totalRounds, xpSaved]);

  const requiredSentences = useMemo(
    () => sentences.filter((sentence) => sentence.group !== "extra"),
    [sentences]
  );
  const requiredCount = requiredSentences.length;
  const placedRequiredCount = requiredSentences.filter(
    (sentence) => sentence.selectedGroup
  ).length;

  const groupedLines = useMemo(
    () =>
      lines.map((line) => ({
        ...line,
        required: requiredSentences.filter((sentence) => sentence.group === line.id)
          .length,
        items: sentences.filter((sentence) => sentence.selectedGroup === line.id),
      })),
    [requiredSentences, sentences]
  );
  const availableSentences = useMemo(
    () => sentences.filter((sentence) => !sentence.selectedGroup),
    [sentences]
  );

  const assignSentence = (sentenceId, lineId) => {
    if (!roundStarted || !timerRunning || finished || roundSolved) return;
    setSentences((prev) =>
      prev.map((sentence) =>
        sentence.id === sentenceId
          ? { ...sentence, selectedGroup: lineId }
          : sentence
      )
    );
  };

  const handleDragStart = (event, sentenceId) => {
    if (!roundStarted || !timerRunning || finished || roundSolved) return;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", sentenceId);
  };

  const handleDrop = (event, lineId = "") => {
    if (!roundStarted || !timerRunning || finished || roundSolved) return;
    event.preventDefault();
    const sentenceId = event.dataTransfer.getData("text/plain");
    if (!sentenceId) return;
    assignSentence(sentenceId, lineId);
  };

  const resetBoard = () => {
    logGameTelemetry(MODE_ID, "session_end", {
      solved: false,
      score,
      durationMs: Date.now() - startedAtRef.current,
      reason: "reset",
      roundIndex,
    });
    resetSession(true);
  };

  const startRound = () => {
    if (finished || roundSolved || !currentRound) return;
    setFeedback(null);
    setIncorrectIds([]);
    setRoundStarted(true);
    setTimerRunning(true);
    setTimeLeft((prev) => (prev > 0 ? prev : ROUND_TIME));
    logGameTelemetry(MODE_ID, "question_started", {
      roundIndex: roundIndex + 1,
      totalRounds,
      durationSeconds: ROUND_TIME,
      title: currentRound.title,
    });
  };

  const toggleTimerRunning = () => {
    if (!roundStarted || roundSolved || finished) return;
    setTimerRunning((prev) => !prev);
  };

  const moveNextRound = () => {
    if (!roundSolved || finished) return;
    prepareRound(roundIndex + 1);
  };

  const handleExit = async () => {
    logGameTelemetry(MODE_ID, "session_end", {
      solved: finished,
      score,
      durationMs: Date.now() - startedAtRef.current,
      roundIndex,
      totalRounds,
    });
    if (!finished && score > 0 && !xpSaved) await saveXp(score);
    navigate("/modes");
  };

  const checkArrangement = useCallback((timeUp = false) => {
    if (!currentRound) return;

    setRoundStarted(false);
    setTimerRunning(false);

    const missingRequired = sentences.filter(
      (sentence) => sentence.group !== "extra" && !sentence.selectedGroup
    );
    const wrongRequired = sentences.filter(
      (sentence) =>
        sentence.group !== "extra" &&
        sentence.selectedGroup &&
        sentence.selectedGroup !== sentence.group
    );
    const misplacedExtra = sentences.filter(
      (sentence) => sentence.group === "extra" && sentence.selectedGroup
    );

    const allIncorrect = [
      ...missingRequired.map((sentence) => sentence.id),
      ...wrongRequired.map((sentence) => sentence.id),
      ...misplacedExtra.map((sentence) => sentence.id),
    ];

    if (allIncorrect.length > 0) {
      setIncorrectIds(allIncorrect);
      setFeedback({
        type: timeUp ? "error" : "warning",
        text: timeUp
          ? `Hết thời gian. Còn ${missingRequired.length} dữ kiện chưa vào đúng dòng, ${wrongRequired.length} dữ kiện đặt sai và ${misplacedExtra.length} dữ kiện thừa bị xếp nhầm.`
          : `Chưa đúng. Còn ${missingRequired.length} dữ kiện bắt buộc chưa xếp, ${wrongRequired.length} dữ kiện đang sai dòng và ${misplacedExtra.length} dữ kiện thừa cần đưa ra ngoài.`,
      });
      logGameTelemetry(MODE_ID, "answer_submitted", {
        correct: false,
        roundIndex: roundIndex + 1,
        reason: timeUp ? "time_up_wrong_group" : "wrong_group",
        missingRequired: missingRequired.length,
        wrongRequired: wrongRequired.length,
        misplacedExtra: misplacedExtra.length,
      });
      return;
    }

    const nextScore = score + ROUND_SCORE;
    setIncorrectIds([]);
    setFeedback({
      type: "success",
      text:
        roundIndex === totalRounds - 1
          ? `Bạn đã hoàn thành đúng cả ${totalRounds} câu của Dòng chảy lịch sử.`
          : `Đúng rồi. Hoàn thành câu ${roundIndex + 1}/${totalRounds}. Bấm sang lượt tiếp theo để mở bộ dữ kiện mới.`,
    });
    setScore(nextScore);
    setRoundSolved(true);
    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct: true,
      roundIndex: roundIndex + 1,
      reason: timeUp ? "time_up_full_correct" : "full_correct",
    });

    if (roundIndex === totalRounds - 1) {
      setFinished(true);
    }
  }, [currentRound, roundIndex, score, sentences, totalRounds]);

  useEffect(() => {
    if (!roundStarted || !timerRunning || finished || timeLeft > 0) return;
    checkArrangement(true);
  }, [checkArrangement, finished, roundStarted, timeLeft, timerRunning]);

  if (loading || (totalRounds > 0 && !boardReady)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-300">
        Đang tải dòng chảy lịch sử...
      </div>
    );
  }

  if (!currentRound || totalRounds === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-300">
        Chưa có bộ dữ kiện hợp lệ cho chế độ chơi này.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1f2937_0%,#020617_70%)] px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="grid gap-4 rounded-[28px] border border-white/10 bg-slate-900/80 p-4 shadow-2xl md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="flex justify-center md:justify-start">
            <button
              onClick={handleExit}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/5"
            >
              <ArrowLeft size={18} />
              Thoát
            </button>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-amber-300">
              <History size={16} />
              Dòng chảy lịch sử
            </div>
            <h1 className="vn-safe-heading mt-3 text-2xl font-black tracking-[0.08em] text-white sm:text-3xl">
              Câu {roundIndex + 1}/{totalRounds}
            </h1>
            <p className="mt-2 text-sm text-slate-300">{currentRound.instruction}</p>
          </div>

          <div className="flex items-center justify-center gap-3 md:justify-end">
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3 text-center">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Câu
              </div>
              <div className="text-lg font-black text-white">
                {roundIndex + 1}/{totalRounds}
              </div>
            </div>
            <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-center">
              <div className="text-[11px] uppercase tracking-[0.2em] text-amber-300/80">
                XP
              </div>
              <div className="text-lg font-black text-amber-300">{score}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                  Các Dữ Kiện Lịch Sử
                </div>
                <div className="mt-2 text-sm text-slate-300">
                  Kéo dữ kiện vào đúng dòng. Dữ kiện thừa phải được giữ lại ngoài
                  4 hộp.
                </div>
              </div>
              <button
                onClick={resetBoard}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/5"
              >
                <RefreshCcw size={16} />
                Chơi Lại
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-4 text-center">
                <div className="text-[11px] uppercase tracking-[0.2em] text-amber-300/80 font-black">
                  Đồng hồ
                </div>
                <div className="mt-2 text-3xl font-black text-amber-300">{timeLeft}s</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-4 text-center">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Đúng dòng
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  {placedRequiredCount}/{requiredCount}
                </div>
              </div>
              <button
                onClick={startRound}
                disabled={timerRunning || finished || roundSolved}
                className="rounded-2xl bg-sky-400 px-5 py-4 font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-sky-300 disabled:opacity-50"
              >
                {feedback && !roundSolved ? "BẮT ĐẦU LẠI" : "BẮT ĐẦU"}
              </button>
              <button
                onClick={toggleTimerRunning}
                disabled={!roundStarted || roundSolved || finished}
                className="rounded-2xl border border-white/10 bg-slate-800 px-5 py-4 font-black uppercase tracking-[0.18em] text-white transition hover:bg-slate-700 disabled:opacity-50"
              >
                {roundStarted && !timerRunning ? "TIẾP TỤC" : "DỪNG"}
              </button>
            </div>

            {!roundStarted && !feedback ? (
              <div className="mt-5 rounded-[24px] border border-dashed border-sky-400/20 bg-sky-500/10 px-4 py-8 text-center text-sm text-slate-100">
                Bộ dữ kiện đang được ẩn. Bấm{" "}
                <span className="font-black text-sky-200">BẮT ĐẦU</span> để mở
                câu {roundIndex + 1} và chạy 15 giây.
              </div>
            ) : (
              <>
                <div
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(event, "")}
                  className="mt-5 rounded-2xl border border-dashed border-white/10 bg-slate-950/50 px-4 py-3 text-center text-sm text-slate-400"
                >
                  Kéo dữ kiện thừa hoặc dữ kiện muốn bỏ ra khỏi hộp về vùng này.
                </div>

                <div className="mt-5 grid gap-4">
                  {availableSentences.length > 0 ? (
                    availableSentences.map((sentence) => (
                      <div
                        key={`${currentRound.id}-${sentence.id}`}
                        draggable={timerRunning}
                        onDragStart={(event) => handleDragStart(event, sentence.id)}
                        className={`rounded-[24px] border p-4 ${
                          incorrectIds.includes(sentence.id)
                            ? "border-rose-400/40 bg-rose-500/10"
                            : "border-white/10 bg-slate-950/60"
                        } ${timerRunning ? "cursor-grab" : "opacity-70"}`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-sm font-black text-amber-300">
                            {sentence.id}
                          </div>
                          <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                            Đang để ngoài
                          </div>
                        </div>

                        <div className="mt-4 text-base font-semibold leading-7 text-white">
                          {sentence.text}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-white/10 bg-slate-950/40 px-4 py-6 text-center text-sm text-slate-400">
                      Không còn dữ kiện nào ở ngoài. Kiểm tra lại để chắc rằng
                      không có đáp án thừa bị đặt nhầm vào 4 dòng.
                    </div>
                  )}
                </div>
              </>
            )}

            {feedback && (
              <div
                className={`mt-5 rounded-2xl border px-5 py-4 ${
                  feedback.type === "success"
                    ? "border-emerald-400/30 bg-emerald-500/10"
                    : feedback.type === "warning"
                      ? "border-amber-400/30 bg-amber-500/10"
                      : "border-rose-400/30 bg-rose-500/10"
                }`}
              >
                <div className="text-sm font-bold text-white">{feedback.text}</div>
              </div>
            )}

            {roundSolved && !finished ? (
              <button
                onClick={moveNextRound}
                className="mt-5 w-full rounded-2xl bg-emerald-500 px-5 py-4 text-base font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-emerald-400"
              >
                Sang Câu Tiếp Theo
              </button>
            ) : (
              <button
                onClick={() => checkArrangement(false)}
                disabled={!roundStarted || !timerRunning || roundSolved}
                className="mt-5 w-full rounded-2xl bg-amber-500 px-5 py-4 text-base font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
              >
                Kiểm Tra Kết Quả
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-xl">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                Bốn Dòng Lịch Sử
              </div>
              {!roundStarted && !feedback ? (
                <div className="mt-4 rounded-[24px] border border-dashed border-sky-400/20 bg-sky-500/10 px-4 py-8 text-center text-sm text-slate-100">
                  Bốn dòng lịch sử sẽ chỉ hiện ra sau khi bấm{" "}
                  <span className="font-black text-sky-200">BẮT ĐẦU</span>.
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {groupedLines.map((line) => (
                    <div
                      key={line.id}
                      className={`rounded-[24px] border p-4 ${lineColors[line.id]}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-black uppercase tracking-[0.22em] text-amber-300/80">
                            {line.label}
                          </div>
                          <div className="mt-1 text-lg font-bold text-white">
                            {line.title}
                          </div>
                        </div>
                        <div className="rounded-full bg-white/5 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-300">
                          {line.items.length}/{line.required}
                        </div>
                      </div>

                      <div
                        className="mt-4 space-y-3 min-h-[120px]"
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => handleDrop(event, line.id)}
                      >
                        {line.items.length > 0 ? (
                          line.items.map((item) => (
                            <div
                              key={`${line.id}-${item.id}`}
                              draggable={timerRunning}
                              onDragStart={(event) => handleDragStart(event, item.id)}
                              className={`rounded-2xl border bg-slate-800/90 px-4 py-3 text-sm leading-6 text-slate-200 ${
                                timerRunning ? "cursor-grab" : "opacity-70"
                              } ${
                                incorrectIds.includes(item.id)
                                  ? "border-rose-400/40"
                                  : "border-white/10"
                              }`}
                            >
                              <span className="mr-2 font-black text-amber-300">
                                {item.id}.
                              </span>
                              {item.text}
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-white/10 px-4 py-4 text-sm text-slate-500">
                            Chưa có dữ kiện nào trong dòng này.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-xl">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                Tiến Độ {totalRounds} Câu
              </div>
              <div className="mt-4 space-y-3">
                {activeHistoricalFlowSets.map((flowSet, index) => {
                  const isCurrent = index === roundIndex;
                  const isDone = index < roundIndex || (finished && index === roundIndex);

                  return (
                    <div
                      key={flowSet.id || index}
                      className={`rounded-2xl border px-4 py-3 ${
                        isDone
                          ? "border-emerald-400/30 bg-emerald-500/10"
                          : isCurrent
                            ? "border-amber-400/30 bg-amber-500/10"
                            : "border-white/10 bg-slate-800/80"
                      }`}
                    >
                      <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Câu {index + 1}
                      </div>
                      <div className="mt-1 text-sm font-bold text-white">
                        {index < roundIndex || (finished && index === roundIndex)
                          ? "Đã hoàn thành"
                          : index === roundIndex
                            ? "Đang thực hiện"
                            : "Chưa mở"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {finished && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[32px] border border-emerald-400/20 bg-slate-900 p-6 text-center shadow-2xl">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                <Trophy size={40} />
              </div>
              <h2 className="vn-safe-heading mt-5 text-3xl font-black tracking-[0.08em] text-emerald-300">
                Hoàn thành dòng chảy lịch sử
              </h2>
              <p className="mt-4 text-slate-300">
                Bạn đã hoàn thành đúng cả {totalRounds} câu và xử lý đúng cả dữ
                kiện thừa.
              </p>
              <div className="mt-5 text-4xl font-black text-amber-300">{score} XP</div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={resetBoard}
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
        )}
      </div>
    </div>
  );
}
