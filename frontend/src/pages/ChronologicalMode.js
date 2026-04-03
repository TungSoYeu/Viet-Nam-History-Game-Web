import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, History, RefreshCcw, Trophy } from "lucide-react";
import { historicalFlowSet } from "../data/theme4GameData";
import useTheme4ModeData from "../hooks/useTheme4ModeData";
import {
  logGameTelemetry,
  resetModeSessionId,
  saveXp,
  shuffleArray,
} from "../utils/gameHelpers";

const MODE_ID = "historical-flow";

const lines = [
  { id: "context", label: "Dòng 1", title: "Bối cảnh", required: 2 },
  { id: "developments", label: "Dòng 2", title: "Diễn biến", required: 4 },
  { id: "result", label: "Dòng 3", title: "Kết quả – Ý nghĩa", required: 2 },
  { id: "legacy", label: "Dòng 4", title: "Di sản", required: 2 },
];
const lineColors = {
  context: "border-sky-400/30 bg-sky-500/10",
  developments: "border-violet-400/30 bg-violet-500/10",
  result: "border-emerald-400/30 bg-emerald-500/10",
  legacy: "border-amber-400/30 bg-amber-500/10",
};

const createBoard = (flowSet) =>
  shuffleArray(flowSet?.sentences || []).map((sentence) => ({
    ...sentence,
    selectedGroup: "",
  }));

export default function ChronologicalMode() {
  const navigate = useNavigate();
  const { data: remoteHistoricalFlowSet, loading } = useTheme4ModeData(
    MODE_ID,
    historicalFlowSet
  );
  const activeHistoricalFlowSet =
    remoteHistoricalFlowSet &&
    !Array.isArray(remoteHistoricalFlowSet) &&
    Array.isArray(remoteHistoricalFlowSet.sentences)
      ? remoteHistoricalFlowSet
      : historicalFlowSet;
  const totalSentences = activeHistoricalFlowSet?.sentences?.length || 0;
  const [sentences, setSentences] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [incorrectIds, setIncorrectIds] = useState([]);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [xpSaved, setXpSaved] = useState(false);
  const [boardReady, setBoardReady] = useState(false);
  const startedAtRef = useRef(Date.now());

  useEffect(() => {
    if (loading || totalSentences === 0) return;

    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    logGameTelemetry(MODE_ID, "session_start", { totalSentences });
    setSentences(createBoard(activeHistoricalFlowSet));
    setFeedback(null);
    setIncorrectIds([]);
    setFinished(false);
    setScore(0);
    setXpSaved(false);
    setBoardReady(true);
  }, [activeHistoricalFlowSet, loading, totalSentences]);

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

  const placedCount = sentences.filter((sentence) => sentence.selectedGroup).length;

  const groupedLines = useMemo(
    () =>
      lines.map((line) => ({
        ...line,
        items: sentences
          .filter((sentence) => sentence.selectedGroup === line.id)
          .sort((a, b) => a.id.localeCompare(b.id)),
      })),
    [sentences]
  );

  const assignSentence = (sentenceId, lineId) => {
    setSentences((prev) =>
      prev.map((sentence) =>
        sentence.id === sentenceId
          ? { ...sentence, selectedGroup: lineId }
          : sentence
      )
    );
  };

  const resetBoard = () => {
    logGameTelemetry(MODE_ID, "session_end", {
      solved: false,
      score,
      durationMs: Date.now() - startedAtRef.current,
      reason: "reset",
    });
    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    logGameTelemetry(MODE_ID, "session_start", { totalSentences, replay: true });
    setSentences(createBoard(activeHistoricalFlowSet));
    setFeedback(null);
    setIncorrectIds([]);
    setFinished(false);
    setScore(0);
    setXpSaved(false);
    setBoardReady(true);
  };

  const handleExit = async () => {
    logGameTelemetry(MODE_ID, "session_end", {
      solved: finished,
      score,
      durationMs: Date.now() - startedAtRef.current,
    });
    if (!finished && score > 0) await saveXp(score);
    navigate("/modes");
  };

  const checkArrangement = () => {
    const missingTimeMarkers = sentences.filter((sentence) => !/\d{3,4}/.test(sentence.text));
    if (missingTimeMarkers.length > 0) {
      setFeedback({
        type: "warning",
        text: `Có ${missingTimeMarkers.length} câu thiếu mốc thời gian rõ ràng. Hãy ưu tiên bổ sung mốc năm trước khi dùng chính thức.`,
      });
      setIncorrectIds(missingTimeMarkers.map((sentence) => sentence.id));
      logGameTelemetry(MODE_ID, "answer_submitted", {
        correct: false,
        reason: "missing_time_marker",
        count: missingTimeMarkers.length,
      });
      return;
    }

    if (placedCount !== totalSentences) {
      setFeedback({
        type: "warning",
        text: `Hãy xếp đủ ${totalSentences} câu trước. Hiện mới có ${placedCount}/${totalSentences} câu đã được đưa vào dòng.`,
      });
      setIncorrectIds([]);
      logGameTelemetry(MODE_ID, "answer_submitted", {
        correct: false,
        reason: "incomplete_arrangement",
        placedCount,
      });
      return;
    }

    const wrongItems = sentences.filter(
      (sentence) => sentence.selectedGroup !== sentence.group
    );

    if (wrongItems.length === 0) {
      setIncorrectIds([]);
      setFeedback({
        type: "success",
        text: `Cả ${totalSentences} câu đã được xếp đúng vào các dòng lịch sử.`,
      });
      setScore(100);
      setFinished(true);
      logGameTelemetry(MODE_ID, "answer_submitted", { correct: true, reason: "full_correct" });
      return;
    }

    setIncorrectIds(wrongItems.map((sentence) => sentence.id));
    setFeedback({
      type: "error",
      text: `Vẫn còn ${wrongItems.length} câu đang nằm sai dòng.`,
    });
    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct: false,
      reason: "wrong_group",
      wrongCount: wrongItems.length,
    });
  };

  if (loading || (totalSentences > 0 && !boardReady)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-300">
        Đang tải dòng chảy lịch sử...
      </div>
    );
  }

  if (!activeHistoricalFlowSet || totalSentences === 0) {
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
              Dòng Chảy Lịch Sử
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-black uppercase tracking-[0.18em] text-white">
              {activeHistoricalFlowSet.title}
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              {activeHistoricalFlowSet.instruction}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 md:justify-end">
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3 text-center">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Đã xếp
              </div>
              <div className="text-lg font-black text-white">{placedCount}/{totalSentences}</div>
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
                  Mỗi dữ kiện cần được đặt vào đúng một trong bốn dòng của tiến trình sự kiện.
                </div>
              </div>
              <button
                onClick={resetBoard}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/5"
              >
                <RefreshCcw size={16} />
                Làm Lại
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              {sentences.map((sentence) => (
                <div
                  key={sentence.id}
                  className={`rounded-[24px] border p-4 ${
                    incorrectIds.includes(sentence.id)
                      ? "border-rose-400/40 bg-rose-500/10"
                      : sentence.selectedGroup
                        ? "border-emerald-400/20 bg-emerald-500/10"
                        : "border-white/10 bg-slate-950/60"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-sm font-black text-amber-300">
                      {sentence.id}
                    </div>
                    <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                      {sentence.selectedGroup
                        ? `Đã xếp vào ${
                            lines.find((line) => line.id === sentence.selectedGroup)
                              ?.title
                          }`
                        : "Chưa xếp"}
                    </div>
                  </div>

                  <div className="mt-4 text-base font-semibold leading-7 text-white">
                    {sentence.text}
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {lines.map((line) => (
                      <button
                        key={`${sentence.id}-${line.id}`}
                        onClick={() => assignSentence(sentence.id, line.id)}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                          sentence.selectedGroup === line.id
                            ? lineColors[line.id]
                            : "border-white/10 bg-slate-800 text-slate-200 hover:border-white/20 hover:bg-slate-700"
                        }`}
                      >
                        <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                          {line.label}
                        </div>
                        <div className="mt-1">{line.title}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

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

            <button
              onClick={checkArrangement}
              className="mt-5 w-full rounded-2xl bg-amber-500 px-5 py-4 text-base font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-amber-400"
            >
              Kiểm Tra Kết Quả
            </button>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-xl">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                Bốn Dòng Lịch Sử
              </div>
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

                    <div className="mt-4 space-y-3">
                      {line.items.length > 0 ? (
                        line.items.map((item) => (
                          <div
                            key={`${line.id}-${item.id}`}
                            className="rounded-2xl border border-white/10 bg-slate-800/90 px-4 py-3 text-sm leading-6 text-slate-200"
                          >
                            <span className="mr-2 font-black text-amber-300">
                              {item.id}.
                            </span>
                            {item.text}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 px-4 py-4 text-sm text-slate-500">
                          Chưa có câu nào được xếp vào dòng này.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
              <h2 className="mt-5 text-3xl font-black uppercase tracking-[0.18em] text-emerald-300">
                Hoàn Thành Dòng Chảy Lịch Sử
              </h2>
              <p className="mt-4 text-slate-300">
                Bạn đã xếp đúng toàn bộ dữ kiện vào 4 dòng của tiến trình lịch sử.
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
