import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Image as ImageIcon,
  Search,
  Trophy,
  X,
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

const GRID_COLUMNS = 2;
const GRID_ROWS = 2;
const GRID_SIZE = GRID_COLUMNS * GRID_ROWS;
const MODE_ID = "turning-page";

export default function RevealPictureMode() {
  const navigate = useNavigate();
  const { data: remoteRevealPictureSets, loading } = useTheme4ModeData(
    MODE_ID,
    revealPictureSets
  );
  const [pictureData, setPictureData] = useState(null);
  const [tileQuestions, setTileQuestions] = useState([]);
  const [revealedTiles, setRevealedTiles] = useState([]);
  const [selectedTile, setSelectedTile] = useState(null);
  const [answerInput, setAnswerInput] = useState("");
  const [guessFullImage, setGuessFullImage] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(100);
  const [tileFeedback, setTileFeedback] = useState(null);
  const [guessFeedback, setGuessFeedback] = useState(null);
  const startedAtRef = useRef(Date.now());

  const answerLengthHint = pictureData ? pictureData.answer.replace(/\s/g, "").length : 0;
  const wordCount = pictureData ? pictureData.answer.split(" ").length : 0;
  const activeRevealPictureSets =
    Array.isArray(remoteRevealPictureSets) && remoteRevealPictureSets.length > 0
      ? remoteRevealPictureSets
      : revealPictureSets;


  const loadRound = (sourceSets = activeRevealPictureSets) => {
    if (!Array.isArray(sourceSets) || sourceSets.length === 0) {
      setPictureData(null);
      setTileQuestions([]);
      return;
    }

    const selected = shuffleArray(sourceSets)[0];
    setPictureData(selected);
    setTileQuestions(selected.questions.slice(0, GRID_SIZE));
    setRevealedTiles([]);
    setSelectedTile(null);
    setAnswerInput("");
    setGuessFullImage("");
    setScore(100);
    setIsFinished(false);
    setTileFeedback(null);
    setGuessFeedback(null);
    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    logGameTelemetry(MODE_ID, "session_start", {
      totalTiles: GRID_SIZE,
      acceptedAnswers: selected.acceptedAnswers?.length || 0,
    });
  };

  useEffect(() => {
    if (!loading) {
      loadRound(activeRevealPictureSets);
    }
  }, [activeRevealPictureSets, loading]);

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

  if (!pictureData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-center px-6 text-2xl font-bold text-amber-500"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      >
        Chưa có bộ câu hỏi hợp lệ cho chế độ chơi này.
      </div>
    );
  }

  const handleTileClick = (index) => {
    if (revealedTiles.includes(index)) return;
    setSelectedTile(index);
    setAnswerInput("");
    setTileFeedback(null);
  };

  const handleAnswerSubmit = () => {
    if (selectedTile === null) return;
    const prompt = tileQuestions[selectedTile];
    const isCorrect = matchesAnswer(answerInput, [prompt.a]);

    setRevealedTiles((prev) => [...prev, selectedTile]);
    const delta = isCorrect ? -5 : -15;
    const nextScore = Math.max(10, score + delta);
    setScore(nextScore);
    setTileFeedback({
      correct: isCorrect,
      answer: prompt.a,
      question: prompt.q,
    });
    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct: isCorrect,
      questionType: "tile",
      tileIndex: selectedTile,
      scoreAfter: nextScore,
    });
  };

  const handleGuessImage = async () => {
    const isCorrect = matchesAnswer(guessFullImage, pictureData.acceptedAnswers);

    if (!isCorrect) {
      const nextScore = Math.max(10, score - 10);
      setScore(nextScore);
      setGuessFeedback({
        correct: false,
        answer: pictureData.answer,
        explanation: "Đáp án chưa chính xác. Bạn có thể mở thêm ô để tăng độ chắc chắn.",
      });
      logGameTelemetry(MODE_ID, "answer_submitted", {
        correct: false,
        questionType: "final_guess",
        scoreAfter: nextScore,
      });
      return;
    }

    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct: true,
      questionType: "final_guess",
      scoreAfter: score,
    });
    logGameTelemetry(MODE_ID, "session_end", {
      score,
      solved: true,
      revealedTiles: revealedTiles.length,
      durationMs: Date.now() - startedAtRef.current,
    });
    setIsFinished(true);
    await saveXp(score);
  };

  const handleExit = async () => {
    logGameTelemetry(MODE_ID, "session_end", {
      score,
      solved: false,
      revealedTiles: revealedTiles.length,
      durationMs: Date.now() - startedAtRef.current,
    });
    if (!isFinished && score > 0) await saveXp(score);
    navigate("/modes");
  };

  if (isFinished) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      >
        <div
          className="p-8 rounded-3xl shadow-2xl max-w-xl w-full text-center animate-bounce-in"
          style={{
            background: "#16213e",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          }}
        >
          <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-black text-amber-400 mb-4 uppercase">
            Lật Mở Trang Sử Thành Công
          </h2>
          <p className="text-xl font-bold text-white mb-6">
            Đáp án là <span className="text-amber-500 uppercase">{pictureData.answer}</span>
          </p>
          <img
            src={pictureData.imageUrl}
            alt={pictureData.answer}
            className="w-full h-auto max-h-72 object-contain rounded-xl mb-4 shadow-2xl bg-slate-900"
            style={{ border: "2px solid rgba(255,255,255,0.1)" }}
          />
          <p className="text-sm italic mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
            {pictureData.caption}
          </p>
          <p className="text-2xl font-black text-green-400 mb-8">Thưởng: {score} XP</p>
          <div className="flex gap-4">
            <button
              onClick={loadRound}
              className="btn-primary flex-1 py-4 text-sm font-bold bg-white/10 hover:bg-white/20 text-white transition rounded-xl"
            >
              Chơi Hình Khác
            </button>
            <button
              onClick={handleExit}
              className="btn-primary flex-1 py-4 text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white transition rounded-xl"
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
      className="min-h-screen p-4 md:p-8 flex flex-col items-center"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
    >
      <div className="w-full max-w-5xl grid grid-cols-[1fr_auto_1fr] items-center mb-6 gap-2">
        <div className="flex justify-start">
          <button
            onClick={handleExit}
            className="btn-primary px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
          >
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Thoát</span>
          </button>
        </div>
        <h1
          className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-widest text-center flex items-center justify-center gap-2 drop-shadow-md text-white"
          style={{
            background: "linear-gradient(135deg, #f0d48a 0%, #d4a053 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <ImageIcon size={24} className="text-amber-500 hidden sm:block" /> Lật Mở Trang Sử
        </h1>
        <div className="flex justify-end">
          <div
            className="text-xs sm:text-sm md:text-lg font-bold text-amber-400 px-3 py-1.5 md:px-4 md:py-2 rounded-lg"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {tileQuestions.length} câu hỏi
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mb-6">
        <div className="h-3 w-full rounded-full bg-slate-900/80 border border-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 transition-all duration-500"
            style={{ width: `${(revealedTiles.length / GRID_SIZE) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
        <div
          className="flex-1 relative w-full rounded-3xl overflow-hidden shadow-2xl"
          style={{
            border: "4px solid rgba(212,160,83,0.3)",
            background: "#0f3460",
            aspectRatio: "1 / 1",
          }}
        >
          <div
            className="absolute inset-0 w-full h-full transition-all duration-1000"
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
            {tileQuestions.map((_, index) => (
              <div
                key={index}
                onClick={() => handleTileClick(index)}
                className={`border origin-center flex items-center justify-center transition-all duration-700 cursor-pointer shadow-lg backdrop-blur-md ${
                  revealedTiles.includes(index)
                    ? "opacity-0 pointer-events-none scale-0 rotate-[360deg]"
                    : "hover:scale-[1.02] hover:z-10 hover:shadow-2xl"
                }`}
                style={
                  !revealedTiles.includes(index)
                    ? {
                        background: "linear-gradient(135deg, rgba(30,58,138,0.95) 0%, rgba(15,23,42,0.98) 100%)",
                        borderColor: "rgba(212,160,83,0.5)",
                        boxShadow: "inset 0 0 30px rgba(0,0,0,0.8)",
                      }
                    : {}
                }
              >
                {!revealedTiles.includes(index) && (
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200/70">
                      Ô {index + 1}
                    </span>
                    <span className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-200 to-amber-600">
                      ?
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-80 flex flex-col justify-center p-6 rounded-2xl shadow-xl border" style={{ background: "#16213e", borderColor: "rgba(255,255,255,0.08)" }}>
          <h3
            className="text-xl font-black text-white uppercase mb-4 text-center border-b pb-4 flex items-center justify-center gap-2"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            <Search size={20} className="text-amber-500" /> Đoán Đáp Án
          </h3>
          <p className="text-sm mb-3 text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
            Khi đã đủ dữ kiện, hãy đoán chính xác nhân vật, di tích hoặc địa danh lịch sử.
          </p>
          <p className="text-xs mb-2 text-center" style={{ color: "#f0d48a" }}>
            Đáp án gồm {answerLengthHint} chữ cái ({wordCount} từ)
          </p>
          <p className="text-xs mb-6 text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
            Điểm hiện tại: {score} XP
          </p>
          <input
            type="text"
            placeholder="Nhập đáp án lịch sử..."
            value={guessFullImage}
            onChange={(e) => setGuessFullImage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGuessImage()}
            className="w-full p-4 rounded-xl outline-none font-bold text-lg text-center text-white mb-6 transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
          <button onClick={handleGuessImage} className="btn-primary py-4 w-full text-lg font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition">
            Xác Nhận Đáp Án
          </button>
          {guessFeedback && !guessFeedback.correct ? (
            <div
              className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-left"
            >
              <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-300">Phản hồi</p>
              <p className="mt-2 text-sm text-white">{guessFeedback.explanation}</p>
              <p className="mt-2 text-sm text-slate-300">
                Đáp án chuẩn: <span className="font-black text-amber-300">{guessFeedback.answer}</span>
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {selectedTile !== null && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[200] p-4 animate-fade-in"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full relative border"
            style={{
              background: "#16213e",
              borderColor: "rgba(212,160,83,0.3)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <h3 className="text-xl font-black text-amber-500 uppercase flex items-center gap-2">
                <HelpCircle size={24} /> Câu Hỏi Ẩn
              </h3>
              <button onClick={() => setSelectedTile(null)} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            <p className="text-xl font-bold text-white mb-8 leading-relaxed text-center">{tileQuestions[selectedTile].q}</p>
            {!tileFeedback ? (
              <>
                <input
                  type="text"
                  placeholder="Nhập câu trả lời ngắn..."
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnswerSubmit()}
                  autoFocus
                  className="w-full p-4 rounded-xl outline-none font-bold text-lg mb-6 text-center text-white transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,160,83,0.3)" }}
                />
                <button onClick={handleAnswerSubmit} className="btn-primary py-4 w-full text-lg font-bold bg-green-600 hover:bg-green-500 text-white rounded-xl transition">
                  Trả Lời Và Lật Mở
                </button>
              </>
            ) : (
              <div
                className={`rounded-xl border p-4 ${
                  tileFeedback.correct
                    ? "border-emerald-400/30 bg-emerald-500/10"
                    : "border-rose-400/30 bg-rose-500/10"
                }`}
              >
                <p className="text-sm font-black uppercase tracking-[0.2em] text-white">
                  {tileFeedback.correct ? "Phản hồi: Chính xác" : "Phản hồi: Chưa đúng"}
                </p>
                <p className="mt-2 text-sm text-slate-200">
                  Đáp án chuẩn: <span className="font-black text-amber-300">{tileFeedback.answer}</span>
                </p>
                <button
                  onClick={() => {
                    setSelectedTile(null);
                    setTileFeedback(null);
                  }}
                  className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-900 transition hover:bg-amber-300"
                >
                  Đóng Câu Này
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
