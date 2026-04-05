import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Database,
  FileJson,
  PencilLine,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import {
  fetchAdminTheme4Content,
  saveAdminTheme4Content,
  syncTheme4DefaultContent,
} from "../services/theme4ContentClient";

const FALLBACK_MODE_DATA_KEYS = {
  "turning-page": "revealPictureSets",
  "understanding-teammates": "teammatePackages",
  "historical-recognition": "historicalRecognitionItems",
  "connecting-history": "connectingHistoryRounds",
  "crossword-decoding": "crosswordSets",
  "historical-flow": "historicalFlowSets",
  "lightning-fast": "lightningFastQuestions",
  "picture-puzzle": "picturePuzzleItems",
};

const SINGLE_VALUE_MODE_IDS = new Set([]);

const MODE_EDITOR_CONFIG = {
  "turning-page": {
    helper:
      "Mỗi bộ gồm 1 ảnh, đáp án và 4 câu hỏi mở mảnh ghép. `acceptedAnswers` nên chứa các cách viết tương đương.",
    template: {
      imageUrl: "",
      answer: "",
      acceptedAnswers: [""],
      caption: "",
      questions: [
        { q: "", a: "" },
        { q: "", a: "" },
        { q: "", a: "" },
        { q: "", a: "" },
      ],
    },
  },
  "understanding-teammates": {
    helper:
      "Mỗi gói có `id`, `title` và `keywords` gồm 10 từ khóa để HS diễn đạt cho đồng đội đoán.",
    template: {
      id: "package-new",
      title: "Gói mới",
      keywords: ["", "", "", "", "", "", "", "", "", ""],
    },
  },
  "historical-recognition": {
    helper:
      "Dùng `type` như `image`, `diagram` hoặc `keyword_hint`. Có thể dùng `imageUrl` hoặc `imageToFind` tùy kiểu câu.",
    template: {
      id: "recognition-new",
      type: "image",
      title: "Nhận diện mới",
      prompt: "",
      imageUrl: "",
      acceptedAnswers: [""],
      explanation: "",
    },
  },
  "connecting-history": {
    helper:
      "Mỗi câu có `pairs` và có thể thêm `distractor` hoặc `distractors` để tạo phương án nhiễu.",
    template: {
      id: "round-new",
      title: "Câu mới",
      instruction: "",
      pairs: [{ left: "", right: "", image: "" }],
      distractor: [""],
    },
  },
  "crossword-decoding": {
    helper:
      "Một ô chữ gồm `keyword`, `clues` và `acceptedAnswers`. Mỗi clue cần 4 phương án và `correctAnswer`.",
    template: {
      id: "crossword-new",
      keyword: "",
      title: "Từ khóa mới",
      theme: "",
      clues: [
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
        },
      ],
      acceptedAnswers: [""],
    },
  },
  "historical-flow": {
    helper:
      "Mỗi câu gồm nhiều `sentences`. `group` có thể là `context`, `developments`, `result`, `legacy` hoặc `extra` cho dữ kiện thừa gây nhiễu.",
    template: {
      id: "flow-new",
      title: "Tiến trình mới",
      instruction: "",
      sentences: [
        { id: "A", text: "", group: "context" },
        { id: "B", text: "", group: "developments" },
        { id: "C", text: "", group: "result" },
        { id: "D", text: "", group: "legacy" },
        { id: "E", text: "", group: "extra" },
      ],
    },
  },
  "lightning-fast": {
    helper:
      "Mỗi câu hỏi nhanh cần `content`, `options`, `correctAnswer` và `explanation`.",
    template: {
      content: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
    },
  },
  "picture-puzzle": {
    helper:
      "Mỗi câu ghép hình cần `prompt`, mảng `images`, `answer`, `acceptedAnswers` và `explanation`.",
    template: {
      prompt: "",
      images: [""],
      answer: "",
      acceptedAnswers: [""],
      explanation: "",
    },
  },
};

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function formatJson(value) {
  return JSON.stringify(value, null, 2);
}

function getDataKey(content, modeId) {
  return (
    content?.modeDataKeys?.[modeId] ||
    FALLBACK_MODE_DATA_KEYS[modeId] ||
    null
  );
}

function getModeItems(content, modeId) {
  const dataKey = getDataKey(content, modeId);
  const modeValue = dataKey ? content?.gameData?.[dataKey] : null;

  if (Array.isArray(modeValue)) {
    return modeValue;
  }

  if (modeValue && typeof modeValue === "object") {
    return [modeValue];
  }

  return [];
}

function getModeItemLabel(modeId, item, index) {
  if (!item || typeof item !== "object") {
    return `Mục ${index + 1}`;
  }

  switch (modeId) {
    case "turning-page":
      return item.answer || item.caption || `Ảnh bí ẩn ${index + 1}`;
    case "understanding-teammates":
      return item.title || `Gói ${index + 1}`;
    case "historical-recognition":
      return item.title || item.prompt || `Nhận diện ${index + 1}`;
    case "connecting-history":
      return item.title || `Câu nối ${index + 1}`;
    case "crossword-decoding":
      return item.title || item.keyword || `Ô chữ ${index + 1}`;
    case "historical-flow":
      return item.title || `Câu dòng chảy ${index + 1}`;
    case "lightning-fast":
      return item.content || `Câu nhanh ${index + 1}`;
    case "picture-puzzle":
      return item.answer || `Câu hình ${index + 1}`;
    default:
      return item.title || item.name || item.id || `Mục ${index + 1}`;
  }
}

export default function Theme4AdminDashboard() {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [selectedModeId, setSelectedModeId] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [editorText, setEditorText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [editorError, setEditorError] = useState("");
  const [notice, setNotice] = useState("");

  const modes = content?.modes || [];
  const selectedMode = modes.find((mode) => mode.id === selectedModeId) || null;
  const selectedModeDataKey = getDataKey(content, selectedModeId);
  const selectedItems = useMemo(
    () => getModeItems(content, selectedModeId),
    [content, selectedModeId]
  );
  const isSingleValueMode = SINGLE_VALUE_MODE_IDS.has(selectedModeId);
  const editorConfig = MODE_EDITOR_CONFIG[selectedModeId] || {
    helper: "Chỉnh JSON đúng cấu trúc dữ liệu của mode rồi lưu.",
    template: {},
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const nextContent = await fetchAdminTheme4Content();
        if (cancelled) return;

        setContent(nextContent);
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError.message || "Không tải được dữ liệu quản trị Chủ đề 4."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedModeId && modes.length > 0) {
      setSelectedModeId(modes[0].id);
    }
  }, [modes, selectedModeId]);

  const resetEditor = () => {
    setSelectedIndex(null);
    setEditorText("");
    setEditorError("");
    setNotice("");
  };

  const openCreateForm = () => {
    setSelectedIndex(null);
    setEditorText(formatJson(cloneValue(editorConfig.template)));
    setEditorError("");
    setNotice("Đang tạo bộ dữ liệu mới theo mẫu của mode.");
  };

  const openEditForm = (index) => {
    setSelectedIndex(index);
    setEditorText(formatJson(selectedItems[index]));
    setEditorError("");
    setNotice(`Đang chỉnh sửa mục ${index + 1}.`);
  };

  const persistContent = async (nextContent, successMessage) => {
    setSaving(true);
    setError("");
    setEditorError("");

    try {
      const response = await saveAdminTheme4Content(nextContent);
      const savedContent = response?.content || nextContent;
      setContent(savedContent);
      setNotice(successMessage);
      return savedContent;
    } catch (saveError) {
      const message = saveError.message || "Không lưu được dữ liệu Theme 4.";
      setError(message);
      throw saveError;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveItem = async () => {
    if (!content || !selectedModeId || !selectedModeDataKey) return;

    let parsed;
    try {
      parsed = JSON.parse(editorText);
    } catch (parseError) {
      setEditorError(`JSON không hợp lệ: ${parseError.message}`);
      return;
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      setEditorError("Mỗi mục phải là một object JSON hợp lệ.");
      return;
    }

    const nextContent = cloneValue(content);
    const currentValue = nextContent.gameData?.[selectedModeDataKey];

    if (isSingleValueMode) {
      nextContent.gameData[selectedModeDataKey] = parsed;
    } else {
      const nextItems = Array.isArray(currentValue) ? [...currentValue] : [];
      if (selectedIndex === null) {
        nextItems.push(parsed);
      } else {
        nextItems[selectedIndex] = parsed;
      }
      nextContent.gameData[selectedModeDataKey] = nextItems;
    }

    const savedContent = await persistContent(
      nextContent,
      selectedIndex === null
        ? "Đã thêm bộ câu hỏi mới."
        : "Đã cập nhật bộ câu hỏi."
    );

    const savedItems = getModeItems(savedContent, selectedModeId);
    const nextIndex =
      isSingleValueMode || selectedIndex === null
        ? Math.max(0, savedItems.length - 1)
        : selectedIndex;
    setSelectedIndex(savedItems.length > 0 ? nextIndex : null);
    setEditorText(savedItems[nextIndex] ? formatJson(savedItems[nextIndex]) : "");
  };

  const handleDeleteItem = async (index) => {
    if (!content || !selectedModeId || !selectedModeDataKey) return;

    const confirmed = window.confirm("Xóa bộ dữ liệu này khỏi mode hiện tại?");
    if (!confirmed) return;

    const nextContent = cloneValue(content);
    const currentValue = nextContent.gameData?.[selectedModeDataKey];

    if (isSingleValueMode) {
      nextContent.gameData[selectedModeDataKey] = null;
    } else {
      nextContent.gameData[selectedModeDataKey] = Array.isArray(currentValue)
        ? currentValue.filter((_, itemIndex) => itemIndex !== index)
        : [];
    }

    await persistContent(nextContent, "Đã xóa bộ dữ liệu.");
    resetEditor();
  };

  const handleSyncDefault = async () => {
    const confirmed = window.confirm(
      "Đồng bộ lại toàn bộ dữ liệu Theme 4 mặc định? Các chỉnh sửa hiện tại sẽ bị ghi đè."
    );
    if (!confirmed) return;

    setSyncing(true);
    setError("");

    try {
      const response = await syncTheme4DefaultContent();
      setContent(response?.content || null);
      resetEditor();
      setNotice("Đã đồng bộ dữ liệu mặc định Chủ đề 4.");
    } catch (syncError) {
      setError(syncError.message || "Không đồng bộ được dữ liệu mặc định.");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-300">
        Đang tải bảng quản trị Chủ đề 4...
      </div>
    );
  }

  if (!content || modes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-300 px-6 text-center">
        {error || "Chưa có dữ liệu Theme 4 để quản trị."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1f2937_0%,#020617_72%)] px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="grid gap-4 rounded-[28px] border border-white/10 bg-slate-900/85 p-5 shadow-2xl lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
              <ShieldCheck size={16} />
              Quản Trị Chủ Đề 4
            </div>
            <h1 className="mt-4 text-3xl font-black uppercase tracking-[0.14em] text-white">
              Dữ Liệu 8 Mode Chơi
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Admin thêm, xóa và chỉnh sửa trực tiếp bộ câu hỏi của từng mode
              Theme 4. Sau khi lưu, các mode đang chơi sẽ lấy dữ liệu mới từ
              backend.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              <span className="rounded-full border border-white/10 px-3 py-1">
                Nguồn: {content.meta?.source || "database"}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                Version: {content.meta?.version || "theme4"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate("/modes")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-800 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-slate-700"
            >
              <ArrowLeft size={16} />
              Về Chọn Mode
            </button>
            <button
              onClick={handleSyncDefault}
              disabled={syncing}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RotateCcw size={16} />
              {syncing ? "Đang đồng bộ..." : "Khôi phục mặc định"}
            </button>
          </div>
        </div>

        {(error || notice) && (
          <div
            className={`rounded-2xl border px-5 py-4 text-sm font-semibold ${
              error
                ? "border-rose-400/30 bg-rose-500/10 text-rose-100"
                : "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
            }`}
          >
            {error || notice}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <aside className="rounded-[28px] border border-white/10 bg-slate-900/85 p-5 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-slate-400">
              <Database size={16} />
              Danh Sách Mode
            </div>
            <div className="mt-4 space-y-3">
              {modes.map((mode) => {
                const itemCount = getModeItems(content, mode.id).length;
                const active = mode.id === selectedModeId;

                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setSelectedModeId(mode.id);
                      resetEditor();
                    }}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-amber-400/30 bg-amber-500/10"
                        : "border-white/10 bg-slate-800/70 hover:bg-slate-800"
                    }`}
                  >
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                      {mode.id}
                    </div>
                    <div className="mt-2 text-lg font-bold text-white">
                      {mode.name}
                    </div>
                    <div className="mt-2 text-sm text-slate-300">{mode.desc}</div>
                    <div className="mt-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-amber-200">
                      {isSingleValueMode && mode.id === selectedModeId
                        ? `${itemCount} bộ dữ kiện`
                        : `${itemCount} mục dữ liệu`}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/85 p-5 shadow-xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                    Mode Đang Chỉnh
                  </div>
                  <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.12em] text-white">
                    {selectedMode?.name}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                    {selectedMode?.longDesc || selectedMode?.desc}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    <span className="rounded-full border border-white/10 px-3 py-1">
                      Data key: {selectedModeDataKey || "không xác định"}
                    </span>
                    <span className="rounded-full border border-white/10 px-3 py-1">
                      {selectedItems.length} mục
                    </span>
                    <span className="rounded-full border border-white/10 px-3 py-1">
                      {isSingleValueMode ? "Dạng đơn" : "Dạng danh sách"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={openCreateForm}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-950 transition hover:bg-sky-400"
                  >
                    <Plus size={16} />
                    {isSingleValueMode ? "Tạo bộ dữ kiện" : "Thêm mục mới"}
                  </button>
                  <button
                    onClick={resetEditor}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-800 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-slate-700"
                  >
                    <FileJson size={16} />
                    Xóa vùng soạn
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-6 2xl:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[28px] border border-white/10 bg-slate-900/85 p-5 shadow-xl">
                <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                  Danh Sách Dữ Liệu
                </div>

                {selectedItems.length === 0 ? (
                  <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-slate-950/50 px-5 py-8 text-center text-sm text-slate-400">
                    Mode này hiện chưa có dữ liệu. Dùng nút{" "}
                    <span className="font-bold text-sky-300">Thêm mục mới</span>{" "}
                    để tạo bộ câu hỏi đầu tiên.
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    {selectedItems.map((item, index) => {
                      const active = index === selectedIndex;

                      return (
                        <div
                          key={`${selectedModeId}-${index}`}
                          className={`rounded-2xl border p-4 ${
                            active
                              ? "border-amber-400/30 bg-amber-500/10"
                              : "border-white/10 bg-slate-800/80"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                                Mục {index + 1}
                              </div>
                              <div className="mt-2 text-base font-bold text-white">
                                {getModeItemLabel(selectedModeId, item, index)}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditForm(index)}
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-200 transition hover:bg-white/5"
                              >
                                <PencilLine size={14} />
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteItem(index)}
                                className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-rose-200 transition hover:bg-rose-500/10"
                              >
                                <Trash2 size={14} />
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-[28px] border border-white/10 bg-slate-900/85 p-5 shadow-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                      Trình Soạn JSON
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-300">
                      {editorConfig.helper}
                    </div>
                  </div>
                </div>

                {editorError && (
                  <div className="mt-5 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100">
                    {editorError}
                  </div>
                )}

                <textarea
                  value={editorText}
                  onChange={(event) => {
                    setEditorText(event.target.value);
                    if (editorError) setEditorError("");
                  }}
                  placeholder="Chọn một mục để sửa hoặc bấm Thêm mục mới để chèn mẫu JSON."
                  className="mt-5 min-h-[560px] w-full rounded-[24px] border border-white/10 bg-slate-950/80 px-4 py-4 font-mono text-sm leading-6 text-slate-100 outline-none transition focus:border-sky-400/40"
                  spellCheck={false}
                />

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleSaveItem}
                    disabled={!editorText.trim() || saving}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-black uppercase tracking-[0.16em] text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={16} />
                    {saving ? "Đang lưu..." : "Lưu vào Theme 4"}
                  </button>
                  <button
                    onClick={openCreateForm}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-800 px-5 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-slate-700"
                  >
                    <Plus size={16} />
                    Chèn mẫu mới
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
