import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, History, ScanSearch, Search, Trophy, XCircle, ZoomIn } from "lucide-react";
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
const MODE_ID = "historical-recognition";

export default function GuessCharacterMode() {
  const navigate = useNavigate();
  const { data: activeRecognitionItems, loading } = useTheme4ModeData(
    MODE_ID,
    historicalRecognitionItems
  );
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const startedAtRef = useRef(Date.now());

  const currentItem = items[currentIndex];
  const progressLabel = useMemo(() => `${currentIndex + 1}/${items.length}`, [currentIndex, items.length]);

  useEffect(() => {
    if (!Array.isArray(activeRecognitionItems)) return;

    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    logGameTelemetry(MODE_ID, "session_start", {
      totalQuestions: activeRecognitionItems.length,
    });
    setItems(shuffleArray(activeRecognitionItems));
    setCurrentIndex(0);
    setGuess("");
    setFeedback(null);
    setScore(0);
    setFinished(false);
    setZoomOpen(false);
  }, [activeRecognitionItems]);

  const replay = () => {
    if (!Array.isArray(activeRecognitionItems)) return;

    logGameTelemetry(MODE_ID, "session_end", {
      score,
      solved: finished,
      durationMs: Date.now() - startedAtRef.current,
    });
    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    logGameTelemetry(MODE_ID, "session_start", {
      totalQuestions: activeRecognitionItems.length,
      replay: true,
    });
    setItems(shuffleArray(activeRecognitionItems));
    setCurrentIndex(0);
    setGuess("");
    setFeedback(null);
    setScore(0);
    setFinished(false);
  };

  const handleSubmit = async () => {
    if (!guess.trim() || !currentItem) return;

    const isCorrect = matchesAnswer(guess, currentItem.acceptedAnswers);
    const nextScore = isCorrect ? score + 10 : score;
    setFeedback({ isCorrect });
    setScore(nextScore);
    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct: isCorrect,
      index: currentIndex,
      type: currentItem.type,
      scoreAfter: nextScore,
    });

    if (currentIndex === items.length - 1) {
      logGameTelemetry(MODE_ID, "session_end", {
        score: nextScore,
        solved: true,
        durationMs: Date.now() - startedAtRef.current,
      });
      setFinished(true);
      if (nextScore > 0) await saveXp(nextScore);
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    setGuess("");
    setCurrentIndex((prev) => prev + 1);
  };

  const handleExit = async () => {
    logGameTelemetry(MODE_ID, "session_end", {
      score,
      solved: finished,
      durationMs: Date.now() - startedAtRef.current,
      answered: currentIndex + (feedback ? 1 : 0),
    });
    if (!finished && score > 0) await saveXp(score);
    navigate("/modes");
  };

  if (loading && items.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-2xl font-bold text-amber-400"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      >
        Đang tải dữ liệu nhận diện...
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-center px-6 text-2xl font-bold text-amber-400"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      >
        Chưa có dữ liệu nhận diện hợp lệ cho chế độ chơi này.
      </div>
    );
  }

  return (
    <div
      className="p-4 md:p-6 min-h-screen max-w-5xl mx-auto flex flex-col items-center"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
    >
      <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center mb-6 p-4 rounded-xl shadow gap-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex justify-start">
          <button onClick={handleExit} className="font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft size={20} /> <span className="hidden sm:inline">Thoát</span>
          </button>
        </div>
        <h2
          className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-widest text-center flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #f0d48a, #d4a053)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          <ScanSearch size={24} className="text-amber-500" /> Nhận Diện Lịch Sử
        </h2>
        <div className="flex justify-end">
          <span className="text-xs sm:text-sm font-black px-3 py-2 rounded-full" style={{ color: "#f0d48a", background: "rgba(212,160,83,0.12)", border: "1px solid rgba(212,160,83,0.2)" }}>
            {progressLabel}
          </span>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: "#16213e", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: "rgba(212,160,83,0.8)" }}>
              {recognitionTypeLabels[currentItem.type] || "Tư liệu"}
            </p>
            <h3 className="text-white text-xl font-black">{currentItem.title}</h3>
          </div>
          <div className="p-5">
            <div
              className="rounded-2xl overflow-hidden mb-5 bg-slate-900 relative min-h-[300px] flex items-center justify-center p-6"
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
              ) : (
                <>
                  <img
                    src={currentItem.imageUrl}
                    alt={currentItem.title}
                    className="w-full aspect-square object-contain p-2 md:p-3"
                  />
                  <button
                    onClick={() => {
                      setZoomOpen(true);
                      logGameTelemetry(MODE_ID, "hint_used", { index: currentIndex, action: "zoom" });
                    }}
                    className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-900/80 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-white"
                  >
                    <ZoomIn size={14} />
                    Phóng To
                  </button>
                </>
              )}
            </div>
            {currentItem.type !== "keyword_hint" && <p className="text-lg font-bold text-white leading-relaxed">{currentItem.prompt}</p>}

          </div>
        </div>

        <div className="rounded-3xl p-6 shadow-2xl flex flex-col" style={{ background: "#16213e", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="mb-5">
            <div className="mt-3 rounded-xl border border-white/10 bg-slate-900/50 p-3">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Đáp án chấp nhận</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {currentItem.acceptedAnswers.map((answer) => (
                  <span
                    key={answer}
                    className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-200"
                  >
                    {answer}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {!finished && !feedback && (
            <>
              <input
                type="text"
                value={guess}
                onChange={(event) => setGuess(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
                placeholder="Nhập đáp án..."
                className="w-full p-4 rounded-xl outline-none text-lg font-bold text-white transition-all mb-4"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,160,83,0.3)" }}
              />
              <button onClick={handleSubmit} className="btn-primary py-4 rounded-xl font-black">
                Kiểm Tra Đáp Án
              </button>
            </>
          )}

          {feedback && !finished && (
            <div className="mt-2 rounded-2xl p-5 animate-fade-in" style={{ background: feedback.isCorrect ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${feedback.isCorrect ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}` }}>
              <div className="flex items-center gap-3 mb-3">
                {feedback.isCorrect ? <CheckCircle size={28} className="text-green-400" /> : <XCircle size={28} className="text-red-400" />}
                <h4 className={`text-xl font-black ${feedback.isCorrect ? "text-green-400" : "text-red-400"}`}>
                  {feedback.isCorrect ? "Chính xác" : "Chưa đúng"}
                </h4>
              </div>
              <p className="text-white font-bold mb-2">Đáp án chấp nhận: {currentItem.acceptedAnswers[0]}</p>
              {feedback.isCorrect && currentItem.type === "keyword_hint" && (
                <div className="mb-4 rounded-xl overflow-hidden border border-emerald-400/30">
                  <img src={currentItem.imageToFind} alt="Answer" className="w-full h-auto object-cover max-h-48" />
                </div>
              )}
              <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.6)" }}>
                {currentItem.explanation}
              </p>
              <button onClick={nextQuestion} className="w-full py-3 rounded-xl font-black text-white" style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}>
                Câu Tiếp Theo
              </button>
            </div>
          )}

          {finished && (
            <div className="mt-auto text-center animate-bounce-in">
              <Trophy size={72} className="text-amber-400 mx-auto mb-4" />
              <h3 className="text-3xl font-black text-amber-400 mb-2 uppercase">Hoàn Thành Nhận Diện</h3>
              <p className="text-white font-bold text-xl mb-3">Điểm: {score} / {items.length * 10}</p>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
                Phần chơi kết hợp nhận diện nhân vật, hình ảnh và lược đồ của Chủ đề 4.
              </p>
              <div className="flex gap-3">
                <button onClick={replay} className="flex-1 py-3 rounded-xl font-black text-white" style={{ background: "rgba(255,255,255,0.08)" }}>
                  Chơi Lại
                </button>
                <button onClick={handleExit} className="flex-1 py-3 rounded-xl font-black text-white" style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)" }}>
                  Quay Lại
                </button>
              </div>
            </div>
          )}

          {!finished && (
            <div className="mt-auto pt-6">
              <div className="rounded-2xl px-4 py-3 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="text-xs uppercase tracking-[0.2em] font-black" style={{ color: "rgba(212,160,83,0.8)" }}>
                  Điểm hiện tại
                </span>
                <div className="text-3xl font-black text-green-400 mt-1">{score} XP</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {zoomOpen ? (
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setZoomOpen(false)}
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
                onClick={() => setZoomOpen(false)}
                className="rounded-full border border-white/15 bg-slate-900 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-200"
              >
                Đóng
              </button>
            </div>
            <img
              src={currentItem.imageUrl}
              alt={currentItem.title}
              className="h-[80vh] w-full rounded-xl object-contain bg-slate-900 p-2"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
