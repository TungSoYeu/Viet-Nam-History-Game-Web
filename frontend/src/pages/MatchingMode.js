import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lightbulb, Package, Target, Trophy } from "lucide-react";
import { connectingHistoryRounds } from "../data/theme4GameData";
import useTheme4ModeData from "../hooks/useTheme4ModeData";
import {
  logGameTelemetry,
  resetModeSessionId,
  saveXp,
  shuffleArray,
} from "../utils/gameHelpers";

const MODE_ID = "connecting-history";

const buildRoundState = (round) => {
  if (!round) {
    return {
      round: null,
      leftItems: [],
      rightItems: [],
      results: {},
    };
  }

  const sampledPairs = shuffleArray(round.pairs).slice(0, 5);
  const leftItems = shuffleArray(sampledPairs.map((pair, index) => ({
    id: `left-${index}`,
    content: pair.left,
    match: pair.right,
    image: pair.image,
  })));

  // Add distractor if present (hỗ trợ cả `distractor` và `distractors` trong dữ liệu)
  let rightItems = sampledPairs.map((pair, index) => ({
    id: `right-${index}`,
    content: pair.right,
  }));

  const extraDistractors = round.distractors?.length
    ? round.distractors
    : Array.isArray(round.distractor)
      ? round.distractor
      : round.distractor
        ? [round.distractor]
        : [];

  extraDistractors.forEach((dist, idx) => {
    rightItems.push({
      id: `dist-${idx}`,
      content: dist,
      isDistractor: true,
    });
  });

  return {
    round,
    leftItems: leftItems,
    rightItems: shuffleArray(rightItems),
    results: {},
  };
};

export default function MatchingMode() {
  const navigate = useNavigate();
  const { data: activeConnectingRounds, loading } = useTheme4ModeData(
    MODE_ID,
    connectingHistoryRounds
  );
  const [roundIndex, setRoundIndex] = useState(0);
  const [roundState, setRoundState] = useState(() => buildRoundState(null));
  const [selectedLeftItem, setSelectedLeftItem] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [notice, setNotice] = useState(null);
  const startedAtRef = useRef(Date.now());

  useEffect(() => {
    if (!Array.isArray(activeConnectingRounds) || activeConnectingRounds.length === 0) return;

    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    logGameTelemetry(MODE_ID, "session_start", {
      totalRounds: activeConnectingRounds.length,
    });
    setRoundIndex(0);
    setRoundState(buildRoundState(activeConnectingRounds[0]));
    setSelectedLeftItem(null);
    setScore(0);
    setIsFinished(false);
    setNotice(null);
  }, [activeConnectingRounds]);

  useEffect(() => {
    if (!Array.isArray(activeConnectingRounds) || activeConnectingRounds.length === 0) return;

    setRoundState(buildRoundState(activeConnectingRounds[roundIndex]));
    setSelectedLeftItem(null);
    setNotice(null);
  }, [activeConnectingRounds, roundIndex]);

  const handleRightItemClick = async (rightBox) => {
    if (roundState.results[rightBox.id]) return;
    if (!selectedLeftItem) {
      setNotice({ type: "warning", text: "Hãy chọn một thẻ dữ kiện ở cột trái trước khi nối." });
      return;
    }

    if (selectedLeftItem.match !== rightBox.content) {
      setNotice({
        type: "error",
        text: "Nối chưa đúng. Hãy đọc lại hai vế rồi chọn lại.",
      });
      logGameTelemetry(MODE_ID, "answer_submitted", {
        correct: false,
        roundId: roundState.round.id,
      });
      setSelectedLeftItem(null);
      return;
    }

    const newResults = { ...roundState.results, [rightBox.id]: selectedLeftItem };
    const newLeftItems = roundState.leftItems.filter((item) => item.id !== selectedLeftItem.id);
    const nextScore = score + 10;

    setRoundState((prev) => ({
      ...prev,
      results: newResults,
      leftItems: newLeftItems,
    }));
    setScore(nextScore);
    setSelectedLeftItem(null);
    setNotice({
      type: "success",
      text: `Nối đúng: ${selectedLeftItem.content} -> ${rightBox.content}`,
    });
    logGameTelemetry(MODE_ID, "answer_submitted", {
      correct: true,
      roundId: roundState.round.id,
      scoreAfter: nextScore,
    });

    // Chỉ cần nối hết các cặp đúng (cột trái hết thẻ); ô nhiễu không cần nối
    if (newLeftItems.length > 0) return;

    if (roundIndex + 1 < activeConnectingRounds.length) {
      setTimeout(() => {
        setRoundIndex((prev) => prev + 1);
      }, 500);
      return;
    }

    logGameTelemetry(MODE_ID, "session_end", {
      solved: true,
      score: nextScore,
      durationMs: Date.now() - startedAtRef.current,
    });
    setIsFinished(true);
    await saveXp(nextScore);
  };

  const restart = () => {
    if (!Array.isArray(activeConnectingRounds) || activeConnectingRounds.length === 0) return;

    logGameTelemetry(MODE_ID, "session_end", {
      solved: false,
      score,
      durationMs: Date.now() - startedAtRef.current,
      reason: "restart",
    });
    resetModeSessionId(MODE_ID);
    startedAtRef.current = Date.now();
    logGameTelemetry(MODE_ID, "session_start", {
      totalRounds: activeConnectingRounds.length,
      replay: true,
    });
    setRoundIndex(0);
    setRoundState(buildRoundState(activeConnectingRounds[0]));
    setSelectedLeftItem(null);
    setScore(0);
    setIsFinished(false);
    setNotice(null);
  };

  const handleExit = async () => {
    logGameTelemetry(MODE_ID, "session_end", {
      solved: isFinished,
      score,
      durationMs: Date.now() - startedAtRef.current,
    });
    if (!isFinished && score > 0) await saveXp(score);
    navigate("/modes");
  };

  if (loading && !roundState.round) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-amber-400" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
        Đang tải dữ liệu kết nối...
      </div>
    );
  }

  if (!roundState.round) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6 text-2xl font-bold text-amber-400" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
        Chưa có vòng nối hợp lệ cho chế độ chơi này.
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
        <div className="max-w-md w-full p-8 rounded-3xl text-center" style={{ background: "#16213e", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
          <Trophy size={72} className="text-amber-400 mx-auto mb-5" />
          <h2 className="text-3xl font-black text-green-400 mb-3 uppercase">Hoàn Thành Kết Nối</h2>
          <p className="text-white font-bold text-xl mb-3">Điểm: {score} XP</p>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
            Bạn đã hoàn thành toàn bộ {activeConnectingRounds.length} lượt nối của chế độ chơi này.
          </p>
          <div className="flex gap-3">
            <button onClick={restart} className="flex-1 py-3 rounded-xl font-black text-white" style={{ background: "rgba(255,255,255,0.08)" }}>
              Chơi Lại
            </button>
            <button onClick={handleExit} className="flex-1 py-3 rounded-xl font-black text-white" style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)" }}>
              Quay Lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center mb-8 p-4 rounded-2xl shadow-xl border gap-2" style={{ background: "#16213e", borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex justify-start">
            <button onClick={handleExit} className="btn-primary px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm flex items-center gap-1 md:gap-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition">
              <ArrowLeft size={18} /> <span className="hidden sm:inline">Thoát</span>
            </button>
          </div>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-widest text-center text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f0d48a 0%, #d4a053 100%)" }}>
            Kết Nối Lịch Sử
          </h2>
          <div className="flex justify-end">
            <div className="text-sm md:text-xl font-black text-amber-400 px-3 py-1.5 md:px-4 md:py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              Điểm: {score}
            </div>
          </div>
        </div>

        <div className="mb-8 text-center font-bold p-4 rounded-xl border w-full animate-fade-in flex flex-col sm:flex-row items-center justify-center gap-3 backdrop-blur-md shadow-lg" style={{ background: "rgba(212,160,83,0.1)", borderColor: "rgba(212,160,83,0.3)", color: "#f0d48a" }}>
          <Lightbulb size={24} className="text-amber-400 drop-shadow-md" />
          <span>
            {roundState.round.title}. {roundState.round.instruction}
          </span>
        </div>

        <div className="mb-6 h-3 w-full rounded-full bg-slate-900/80 border border-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 transition-all duration-500"
            style={{ width: `${((roundIndex + Object.keys(roundState.results).length / Math.max(1, roundState.rightItems.length)) / activeConnectingRounds.length) * 100}%` }}
          />
        </div>

        {selectedLeftItem ? (
          <div className="mb-4 w-full rounded-xl border border-indigo-300/30 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-100">
            Đang chọn dữ kiện: <span className="font-black">{selectedLeftItem.content}</span>. Hãy chọn một đích nối ở cột phải.
          </div>
        ) : null}

        {notice ? (
          <div
            className={`mb-4 w-full rounded-xl border px-4 py-3 text-sm font-bold ${
              notice.type === "success"
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                : notice.type === "warning"
                  ? "border-amber-400/30 bg-amber-500/10 text-amber-200"
                  : "border-rose-400/30 bg-rose-500/10 text-rose-200"
            }`}
          >
            {notice.text}
          </div>
        ) : null}

        <div className="grid grid-cols-1 xl:grid-cols-2 w-full gap-4 md:gap-8 items-start">
          <div className="w-full p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-xl border" style={{ background: "#0f3460", borderColor: "rgba(255,255,255,0.08)" }}>
            <h3 className="text-center font-black mb-4 md:mb-6 text-amber-400 uppercase tracking-widest border-b pb-2 md:pb-4 flex items-center justify-center gap-2 text-sm md:text-base" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <Package size={24} /> Dữ Kiện
            </h3>
            <div className="flex flex-col gap-4">
              {roundState.leftItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedLeftItem(item)}
                  className={`flex flex-col xl:flex-row items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg font-bold text-center xl:text-left transition-all duration-300 border ${
                    selectedLeftItem?.id === item.id ? "bg-amber-600 text-white scale-[1.02]" : "bg-[#16213e] text-white hover:bg-white/10"
                  }`}
                  style={{ borderColor: selectedLeftItem?.id === item.id ? "transparent" : "rgba(255,255,255,0.1)" }}
                >
                  {item.image && (
                    <div className="w-16 h-16 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden border border-white/20 shadow-md">
                      <img src={item.image} alt={item.content} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <span className="flex-1 text-sm md:text-base leading-snug md:leading-relaxed">{item.content}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col gap-4 md:gap-5">
            <h3 className="text-center font-black mb-1 text-green-400 uppercase tracking-widest border-b pb-2 md:pb-4 flex items-center justify-center gap-2 text-sm md:text-base" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <Target size={24} className="hidden md:block" /> Đích Nối
            </h3>

            {roundState.rightItems.map((rightBox) => {
              const isMatched = roundState.results[rightBox.id];
              return (
                <button
                  key={rightBox.id}
                  onClick={() => handleRightItemClick(rightBox)}
                  disabled={!!isMatched}
                  className={`relative p-4 md:p-6 rounded-xl md:rounded-2xl transition-all flex flex-col items-center justify-center min-h-[92px] md:min-h-[120px] w-full text-center border-2 shadow-lg ${
                    isMatched
                      ? "bg-green-900/40 border-green-500 cursor-default"
                      : selectedLeftItem
                      ? "bg-indigo-900/40 border-indigo-400 border-dashed hover:bg-indigo-800/60 hover:scale-[1.01]"
                      : "bg-[#16213e] border-gray-500 border-dashed hover:bg-white/5"
                  }`}
                >
                  {isMatched ? (
                    <div className="animate-bounce-in w-full flex flex-col items-center gap-2">
                      {isMatched.image && (
                        <img src={isMatched.image} alt={isMatched.content} className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover border border-white/20 shadow-md" />
                      )}
                      <span className="font-bold text-white text-sm md:text-base">{isMatched.content}</span>
                      <div className="w-full h-[1px] bg-white/20"></div>
                      <span className="font-bold text-amber-200 text-xs md:text-sm">{rightBox.content}</span>
                    </div>
                  ) : (
                    <span className="font-bold text-white/85 text-sm md:text-lg">{rightBox.content}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
