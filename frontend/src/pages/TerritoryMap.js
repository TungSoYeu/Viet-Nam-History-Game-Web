import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ImageIcon, Lightbulb, Trophy } from "lucide-react";
import { picturePuzzleItems } from "../data/theme4GameData";
import {
  logGameTelemetry,
  resetModeSessionId,
  saveXp,
  shuffleArray,
} from "../utils/gameHelpers";
import ModeGuidePanel from "../components/game/ModeGuidePanel";
import { theme4ModeGuides } from "../data/theme4ModeGuides";

const MODE_ID = "picture-puzzle";

export default function TerritoryMap() {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => shuffleArray(picturePuzzleItems));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [xpSaved, setXpSaved] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const startedAtRef = useRef(Date.now());

  const currentItem = items[currentIndex];
  const computedHints = useMemo(() => {
    if (!currentItem) return [];
    const normalized = currentItem.answer.trim();
    const words = normalized.split(/\s+/).filter(Boolean);
    const compact = normalized.replace(/\s+/g, "");
    return [
      `Tên đáp án có ${words.length} từ.`,
      `Đáp án bắt đầu bằng chữ "${normalized.charAt(0)}".`,
      `Đáp án có ${compact.length} ký tự (không tính khoảng trắng).`,
    ];
  }, [currentItem]);

  useEffect(() => {
    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    logGameTelemetry(MODE_ID, "session_start", { totalQuestions: picturePuzzleItems.length });
  }, []);

  useEffect(() => {
    if (finished && !xpSaved) {
      logGameTelemetry(MODE_ID, "session_end", {
        solved: true,
        score,
        correctCount,
        durationMs: Date.now() - startedAtRef.current,
      });
      saveXp(score);
      setXpSaved(true);
    }
  }, [correctCount, finished, score, xpSaved]);

  const handleExit = async () => {
    logGameTelemetry(MODE_ID, "session_end", {
      solved: false,
      score,
      correctCount,
      durationMs: Date.now() - startedAtRef.current,
    });
    if (!finished && score > 0) await saveXp(score);
    navigate("/modes");
  };

  const handleAnswer = (option) => {
    if (!currentItem || feedback) return;
    const correct = option === currentItem.answer;
    setSelectedOption(option);
    setFeedback({
      correct,
      answer: currentItem.answer,
      explanation: currentItem.explanation,
    });
    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct,
      index: currentIndex,
      hintLevel,
      scoreAfter: correct ? score + 10 : score,
    });

    if (correct) {
      setScore((prev) => prev + 10);
      setCorrectCount((prev) => prev + 1);
    }
  };

  const nextPuzzle = () => {
    if (currentIndex === items.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedOption("");
    setFeedback(null);
    setHintLevel(0);
  };

  const restartMode = () => {
    logGameTelemetry(MODE_ID, "session_end", {
      solved: false,
      score,
      correctCount,
      durationMs: Date.now() - startedAtRef.current,
      reason: "restart",
    });
    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    logGameTelemetry(MODE_ID, "session_start", { totalQuestions: picturePuzzleItems.length, replay: true });
    setItems(shuffleArray(picturePuzzleItems));
    setCurrentIndex(0);
    setSelectedOption("");
    setFeedback(null);
    setScore(0);
    setCorrectCount(0);
    setFinished(false);
    setXpSaved(false);
    setHintLevel(0);
  };

  if (!currentItem && !finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-300">
        Đang chuẩn bị phần đuổi hình bắt chữ...
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1d4ed8_0%,#020617_72%)] px-4 py-8 text-white flex items-center justify-center">
        <div className="w-full max-w-3xl rounded-[32px] border border-sky-400/20 bg-slate-900/90 p-6 sm:p-8 shadow-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
            <Trophy size={40} />
          </div>
          <h1 className="mt-5 text-3xl sm:text-4xl font-black uppercase tracking-[0.18em] text-sky-200">
            Đuổi Hình Bắt Chữ
          </h1>
          <p className="mt-4 text-slate-300">
            Bạn đã hoàn thành 10 câu hỏi bằng hình ảnh lịch sử chính thống.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Đúng
              </div>
              <div className="mt-2 text-3xl font-black text-white">
                {correctCount}/{items.length}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Số Câu
              </div>
              <div className="mt-2 text-3xl font-black text-white">{items.length}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Điểm
              </div>
              <div className="mt-2 text-3xl font-black text-amber-300">{score}</div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={restartMode}
              className="flex-1 rounded-2xl bg-sky-400 px-5 py-4 font-black text-slate-950 transition hover:bg-sky-300"
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0f766e_0%,#020617_72%)] px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
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
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-sky-200">
              <ImageIcon size={16} />
              Đuổi Hình Bắt Chữ
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-black uppercase tracking-[0.18em] text-white">
              Nhìn Hình Và Tìm Đáp Án
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Cấu trúc cố định: 10 câu hỏi hình ảnh với tư liệu lịch sử chính thống.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 md:justify-end">
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3 text-center">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Tiến Độ
              </div>
              <div className="text-lg font-black text-white">
                {currentIndex + 1}/{items.length}
              </div>
            </div>
            <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-center">
              <div className="text-[11px] uppercase tracking-[0.2em] text-sky-200/80">
                Điểm
              </div>
              <div className="text-lg font-black text-sky-200">{score}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-xl">
            <ModeGuidePanel
              objective={theme4ModeGuides.picturePuzzle.objective}
              rules={theme4ModeGuides.picturePuzzle.rules}
              scoring={theme4ModeGuides.picturePuzzle.scoring}
              sample={theme4ModeGuides.picturePuzzle.sample}
              statusText={`Câu ${currentIndex + 1}/${items.length} | Gợi ý tầng ${hintLevel}`}
            />

            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70">
              <img
                src={currentItem.imageUrl}
                alt={`Đuổi hình bắt chữ ${currentIndex + 1}`}
                className="h-[300px] w-full object-contain bg-slate-950 p-4 sm:h-[420px]"
              />
            </div>

            <div className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/60 p-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-amber-300">
                <Lightbulb size={16} />
                Gợi Ý
              </div>
              <p className="mt-4 text-base leading-7 text-slate-200">
                Hãy xác định nhân vật hoặc hình tượng lịch sử trong bức ảnh.
              </p>
              <div className="mt-4 space-y-2">
                {hintLevel > 0 ? (
                  computedHints.slice(0, hintLevel).map((hint, index) => (
                    <div
                      key={hint}
                      className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-100"
                    >
                      Gợi ý tầng {index + 1}: {hint}
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-400">
                    Chưa mở gợi ý.
                  </div>
                )}
              </div>
              {!feedback && hintLevel < computedHints.length ? (
                <button
                  onClick={() => {
                    const nextLevel = Math.min(computedHints.length, hintLevel + 1);
                    setHintLevel(nextLevel);
                    logGameTelemetry(MODE_ID, "hint_used", {
                      index: currentIndex,
                      level: nextLevel,
                    });
                  }}
                  className="mt-4 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-amber-200 transition hover:bg-amber-500/20"
                >
                  Mở Gợi Ý Tầng {hintLevel + 1}
                </button>
              ) : null}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-xl">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
              Bảng Đáp Án
            </div>
            <div className="mt-5 grid gap-3">
              {currentItem.options.map((option, index) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentItem.answer;

                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={Boolean(feedback)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      feedback
                        ? isCorrect
                          ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
                          : isSelected
                            ? "border-rose-400/30 bg-rose-500/15 text-rose-100"
                            : "border-white/10 bg-slate-800 text-slate-400"
                        : "border-white/10 bg-slate-800 text-white hover:border-sky-300/30 hover:bg-slate-700"
                    }`}
                  >
                    <div className="text-xs font-black uppercase tracking-[0.24em] text-sky-200/80">
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
                <div className="text-lg font-black text-white">
                  {feedback.correct ? "Chọn đúng hình ảnh." : "Chọn chưa đúng."}
                </div>
                <div className="mt-2 text-sm text-slate-300">
                  Đáp án đúng:{" "}
                  <span className="font-bold text-amber-300">
                    {feedback.answer}
                  </span>
                </div>
                <div className="mt-2 text-sm text-slate-300">
                  {feedback.explanation}
                </div>
                <button
                  onClick={nextPuzzle}
                  className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-black uppercase tracking-[0.18em] text-slate-900 transition hover:bg-sky-200"
                >
                  {currentIndex === items.length - 1 ? "Kết Thúc Chế Độ" : "Hình Kế Tiếp"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
