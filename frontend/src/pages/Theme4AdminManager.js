import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Database,
  ImagePlus,
  LoaderCircle,
  PencilLine,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import {
  createAdminTheme4ModeItem,
  deleteAdminTheme4ModeItem,
  fetchAdminTheme4Content,
  fetchAdminTheme4ModeItems,
  syncTheme4DefaultContent,
  updateAdminTheme4ModeItem,
  uploadAdminTheme4Image,
} from "../services/theme4ContentClient";
import { getActiveClassroomId, getActiveClassroomName } from "../utils/classroomContext";

const CFG = {
  "turning-page": {
    t: { imageUrl: "", answer: "", acceptedAnswers: [""], caption: "", questions: [{ q: "", a: "" }] },
    a: { acceptedAnswers: "", questions: { q: "", a: "" } },
    h: "Mỗi bộ gồm ảnh bí ẩn, đáp án, các cách viết chấp nhận và các câu gợi ý mở mảnh ghép.",
  },
  "understanding-teammates": {
    t: { id: "", title: "", keywords: [""] },
    a: { keywords: "" },
    h: "Mỗi gói gồm tiêu đề và danh sách từ khóa để đồng đội gợi ý cho nhau.",
  },
  "historical-recognition": {
    t: { id: "", type: "image", title: "", prompt: "", imageUrl: "", imageUrls: [""], imageToFind: "", acceptedAnswers: [""], explanation: "" },
    a: { imageUrls: "", acceptedAnswers: "" },
    h: "Có thể dùng một ảnh, nhiều ảnh tư liệu hoặc hệ từ khóa gợi ý tùy loại câu hỏi nhận diện.",
  },
  "connecting-history": {
    t: { id: "", title: "", instruction: "", pairs: [{ left: "", right: "", image: "" }], distractor: [""] },
    a: { pairs: { left: "", right: "", image: "" }, distractor: "", distractors: "" },
    h: "Mỗi câu gồm các cặp nối đúng và có thể thêm phương án gây nhiễu.",
  },
  "crossword-decoding": {
    t: { id: "", keyword: "", title: "", theme: "", clues: [{ question: "", options: ["", "", "", ""], correctAnswer: "" }], acceptedAnswers: [""] },
    a: { clues: { question: "", options: ["", "", "", ""], correctAnswer: "" }, "clues.options": "", acceptedAnswers: "" },
    h: "Mỗi ô chữ gồm từ khóa hàng dọc, chủ đề, các câu hỏi hàng ngang và đáp án chấp nhận.",
  },
  "historical-flow": {
    t: {
      id: "",
      title: "",
      instruction: "",
      sentences: [
        { id: "A", text: "", group: "context" },
        { id: "B", text: "", group: "developments" },
        { id: "C", text: "", group: "result" },
        { id: "D", text: "", group: "legacy" },
        { id: "E", text: "", group: "extra" },
      ],
    },
    a: { sentences: { id: "", text: "", group: "context" } },
    h: "Mỗi mục là một câu của Dòng chảy lịch sử. `group` nhận `context`, `developments`, `result`, `legacy` hoặc `extra` cho dữ kiện thừa.",
  },
  "lightning-fast": {
    t: { content: "", options: ["", "", "", ""], correctAnswer: "", explanation: "" },
    a: { options: "" },
    h: "Mỗi câu hỏi nhanh có 4 lựa chọn, 1 đáp án đúng và phần giải thích.",
  },
  "picture-puzzle": {
    t: { prompt: "", images: [""], answer: "", acceptedAnswers: [""], explanation: "" },
    a: { images: "", acceptedAnswers: "" },
    h: "Mỗi câu gồm prompt, các ảnh gợi ý, đáp án đúng và các cách viết được chấp nhận.",
  },
};

const FIELD_LABELS = {
  id: "Mã hiển thị",
  title: "Tiêu đề",
  theme: "Chủ đề",
  type: "Kiểu câu hỏi",
  prompt: "Đề bài",
  imageUrl: "Đường dẫn ảnh",
  imageUrls: "Các ảnh tư liệu",
  imageToFind: "Ảnh đáp án",
  answer: "Đáp án",
  acceptedAnswers: "Các đáp án chấp nhận",
  caption: "Chú thích",
  questions: "Các câu gợi ý",
  q: "Câu hỏi",
  a: "Đáp án ngắn",
  keywords: "Các từ khóa",
  instruction: "Yêu cầu",
  pairs: "Các cặp nối",
  left: "Vế trái",
  right: "Vế phải",
  image: "Ảnh minh họa",
  distractor: "Phương án gây nhiễu",
  distractors: "Các phương án gây nhiễu",
  keyword: "Từ khóa hàng dọc",
  clues: "Các câu hỏi hàng ngang",
  question: "Nội dung câu hỏi",
  options: "Các lựa chọn",
  correctAnswer: "Đáp án đúng",
  explanation: "Giải thích",
  sentences: "Các dữ kiện",
  text: "Nội dung dữ kiện",
  group: "Nhóm dữ kiện",
  content: "Nội dung",
  images: "Các ảnh gợi ý",
};

const TYPE_OPTION_LABELS = {
  image: "Hình ảnh",
  diagram: "Lược đồ",
  keyword_hint: "Gợi ý từ khóa",
};

const GROUP_OPTION_LABELS = {
  context: "Bối cảnh",
  developments: "Diễn biến",
  result: "Kết quả - ý nghĩa",
  legacy: "Di sản",
  extra: "Dữ kiện thừa",
};

const isPrimitive = (v) => v == null || ["string", "number", "boolean"].includes(typeof v);
const clone = (v) => JSON.parse(JSON.stringify(v));
const labelize = (v) => FIELD_LABELS[v] || String(v).replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b\w/g, (c) => c.toUpperCase());
const pathKey = (path) => path.filter((x) => typeof x !== "number").join(".");
const getAt = (obj, path) => path.reduce((cur, key) => cur?.[key], obj);
const setAt = (obj, path, value) => {
  if (!path.length) return value;
  const [head, ...tail] = path;
  const next = Array.isArray(obj) ? [...obj] : { ...(obj || {}) };
  next[head] = setAt(next[head], tail, value);
  return next;
};
const emptyLike = (v) => {
  if (Array.isArray(v)) return v.length ? [emptyLike(v[0])] : [];
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, val]) => [k, k === "group" ? "context" : k === "type" ? "image" : emptyLike(val)]));
  if (typeof v === "number") return 0;
  if (typeof v === "boolean") return false;
  return "";
};

const itemLabel = (modeId, item, idx) => {
  if (!item || typeof item !== "object") return `Mục ${idx + 1}`;
  if (modeId === "turning-page") return item.answer || item.caption || `Ảnh ${idx + 1}`;
  if (modeId === "understanding-teammates") return item.title || `Gói ${idx + 1}`;
  if (modeId === "historical-recognition") return item.title || item.prompt || `Nhận diện ${idx + 1}`;
  if (modeId === "connecting-history") return item.title || `Câu ${idx + 1}`;
  if (modeId === "crossword-decoding") return item.title || item.keyword || `Ô chữ ${idx + 1}`;
  if (modeId === "historical-flow") return item.title || "Bộ dữ kiện";
  if (modeId === "lightning-fast") return item.content || `Câu ${idx + 1}`;
  if (modeId === "picture-puzzle") return item.answer || `Câu ${idx + 1}`;
  return item.title || item.id || `Mục ${idx + 1}`;
};

export default function Theme4AdminManager() {
  const navigate = useNavigate();
  const activeClassroomId = getActiveClassroomId();
  const activeClassroomName = getActiveClassroomName();
  const [content, setContent] = useState(null);
  const [selectedModeId, setSelectedModeId] = useState("");
  const [items, setItems] = useState([]);
  const [formState, setFormState] = useState(null);
  const [editingItemId, setEditingItemId] = useState("");
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [uploading, setUploading] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const modes = useMemo(() => content?.modes || [], [content]);
  const mode = useMemo(() => modes.find((m) => m.id === selectedModeId) || null, [modes, selectedModeId]);
  const config = CFG[selectedModeId] || { t: {}, a: {}, h: "Chỉnh sửa dữ liệu và lưu trực tiếp vào MongoDB." };
  const singleMode = false;

  const loadContent = async () => {
    setLoadingPage(true);
    setError("");
    try {
      const data = await fetchAdminTheme4Content();
      setContent(data);
      if (!selectedModeId && data?.modes?.length) setSelectedModeId(data.modes[0].id);
    } catch (e) {
      setError(e.message || "Không tải được dữ liệu quản trị.");
    } finally {
      setLoadingPage(false);
    }
  };

  const loadItems = async (modeId, preferredItemId = "") => {
    if (!modeId) return;
    setLoadingItems(true);
    setError("");
    try {
      const data = await fetchAdminTheme4ModeItems(modeId);
      const nextItems = Array.isArray(data?.items) ? data.items : [];
      setItems(nextItems);
      if (preferredItemId) {
        const found = nextItems.find((item) => item?._adminId === preferredItemId);
        if (found) {
          setEditingItemId(preferredItemId);
          setFormState(clone(found));
          return;
        }
      }
      setEditingItemId("");
      setFormState(null);
    } catch (e) {
      setError(e.message || "Không tải được dữ liệu trò chơi.");
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    if (activeClassroomId) {
      loadContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClassroomId]);

  useEffect(() => {
    if (selectedModeId) {
      setNotice("");
      loadItems(selectedModeId);
    }
  }, [selectedModeId, activeClassroomId]);

  const startCreate = () => {
    setEditingItemId("");
    setFormState(clone(config.t || {}));
    setError("");
    setNotice("Đang tạo mục dữ liệu mới.");
  };

  const startEdit = (item) => {
    setEditingItemId(item?._adminId || "");
    setFormState(clone(item));
    setError("");
    setNotice("Đang chỉnh sửa dữ liệu đã lưu.");
  };

  const updateField = (path, value) => setFormState((current) => setAt(current, path, value));
  const addArrayItem = (path) => {
    const current = getAt(formState, path) || [];
    const template = config.a?.[pathKey(path)] !== undefined ? clone(config.a[pathKey(path)]) : current.length ? emptyLike(current[0]) : "";
    updateField(path, [...current, template]);
  };
  const removeArrayItem = (path, index) => {
    const current = getAt(formState, path) || [];
    updateField(path, current.filter((_, i) => i !== index));
  };

  const uploadImage = async (path, file) => {
    if (!file) return;
    const currentPath = path.join(".");
    setUploading(currentPath);
    setError("");
    try {
      const data = await uploadAdminTheme4Image(file);
      updateField(path, data.imageUrl || "");
      setNotice("Đã tải ảnh lên máy chủ.");
    } catch (e) {
      setError(e.message || "Không tải được ảnh.");
    } finally {
      setUploading("");
    }
  };

  const saveItem = async () => {
    if (!selectedModeId || !formState) return;
    setSaving(true);
    setError("");
    try {
      const res = editingItemId
        ? await updateAdminTheme4ModeItem(selectedModeId, editingItemId, formState)
        : await createAdminTheme4ModeItem(selectedModeId, formState);
      const savedId = res?.item?._adminId || editingItemId;
      await loadItems(selectedModeId, savedId);
      await loadContent();
      setNotice(editingItemId ? "Đã cập nhật dữ liệu trong MongoDB." : "Đã thêm dữ liệu mới vào MongoDB.");
    } catch (e) {
      setError(e.message || "Không lưu được dữ liệu.");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (itemId) => {
    if (!itemId) return;
    if (!window.confirm("Bạn có chắc muốn xóa mục dữ liệu này?")) return;
    setSaving(true);
    setError("");
    try {
      await deleteAdminTheme4ModeItem(selectedModeId, itemId);
      await loadItems(selectedModeId);
      await loadContent();
      setNotice("Đã xóa dữ liệu khỏi MongoDB.");
    } catch (e) {
      setError(e.message || "Không xóa được dữ liệu.");
    } finally {
      setSaving(false);
    }
  };

  const syncDefault = async () => {
    if (!window.confirm("Khôi phục dữ liệu mặc định Chủ đề 4 trong MongoDB?")) return;
    setSyncing(true);
    setError("");
    try {
      await syncTheme4DefaultContent();
      await loadContent();
      if (selectedModeId) await loadItems(selectedModeId);
      setNotice("Đã khôi phục dữ liệu mặc định.");
    } catch (e) {
      setError(e.message || "Không khôi phục được dữ liệu mặc định.");
    } finally {
      setSyncing(false);
    }
  };

  const renderPrimitive = (value, path, field) => {
    const key = String(field).toLowerCase();
    const imageField = key.includes("image");
    const longField = ["prompt", "explanation", "instruction", "content", "question", "text", "caption"].includes(field);
    const typeField = selectedModeId === "historical-recognition" && field === "type";
    const groupField = field === "group";

    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <label className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400">{labelize(field)}</label>
        {typeField ? (
          <select value={value || "image"} onChange={(e) => updateField(path, e.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm font-semibold text-white outline-none">
            <option value="image">{TYPE_OPTION_LABELS.image}</option>
            <option value="diagram">{TYPE_OPTION_LABELS.diagram}</option>
            <option value="keyword_hint">{TYPE_OPTION_LABELS.keyword_hint}</option>
          </select>
        ) : groupField ? (
          <select value={value || "context"} onChange={(e) => updateField(path, e.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm font-semibold text-white outline-none">
            <option value="context">{GROUP_OPTION_LABELS.context}</option>
            <option value="developments">{GROUP_OPTION_LABELS.developments}</option>
            <option value="result">{GROUP_OPTION_LABELS.result}</option>
            <option value="legacy">{GROUP_OPTION_LABELS.legacy}</option>
            <option value="extra">{GROUP_OPTION_LABELS.extra}</option>
          </select>
        ) : longField ? (
          <textarea value={value || ""} onChange={(e) => updateField(path, e.target.value)} rows={3} className="mt-3 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm font-semibold text-white outline-none" />
        ) : (
          <input value={value || ""} onChange={(e) => updateField(path, e.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm font-semibold text-white outline-none" />
        )}
        {imageField && (
          <div className="mt-4 space-y-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-sky-200">
              {uploading === path.join(".") ? <LoaderCircle size={14} className="animate-spin" /> : <ImagePlus size={14} />}
              {uploading === path.join(".") ? "Đang tải..." : "Tải ảnh từ máy"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(path, e.target.files?.[0] || null)} />
            </label>
            {value ? <img src={value} alt={field} className="max-h-56 w-full rounded-xl border border-white/10 bg-slate-900/80 object-contain p-3" /> : <div className="rounded-xl border border-dashed border-white/10 px-4 py-3 text-sm text-slate-500">Chưa có ảnh.</div>}
          </div>
        )}
      </div>
    );
  };

  const renderField = (value, path, field) => {
    if (Array.isArray(value)) {
      const primitiveList = value.length === 0 ? isPrimitive(config.a?.[pathKey(path)]) : isPrimitive(value[0]);
      return (
        <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{labelize(field)}</div>
            <button type="button" onClick={() => addArrayItem(path)} className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-200">
              <Plus size={14} /> Thêm
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {value.length === 0 ? <div className="rounded-xl border border-dashed border-white/10 px-4 py-3 text-sm text-slate-500">Danh sách đang trống.</div> : null}
            {value.map((child, index) => {
              const childPath = [...path, index];
              if (primitiveList) {
                const primitiveField = String(field).toLowerCase().includes("images") ? "imageUrl" : field;
                return (
                  <div key={childPath.join(".")} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{labelize(field)} {index + 1}</div>
                      <button type="button" onClick={() => removeArrayItem(path, index)} className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-rose-200">
                        <Trash2 size={14} /> Xóa
                      </button>
                    </div>
                    {renderPrimitive(child, childPath, primitiveField)}
                  </div>
                );
              }
              return (
                <div key={childPath.join(".")} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{labelize(field)} {index + 1}</div>
                    <button type="button" onClick={() => removeArrayItem(path, index)} className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-rose-200">
                      <Trash2 size={14} /> Xóa
                    </button>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    {Object.entries(child).filter(([k]) => k !== "_adminId").map(([k, v]) => <div key={`${childPath.join(".")}.${k}`} className={Array.isArray(v) || (v && typeof v === "object") ? "lg:col-span-2" : ""}>{renderField(v, [...childPath, k], k)}</div>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    if (value && typeof value === "object") {
      return (
        <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
          {field ? <div className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">{labelize(field)}</div> : null}
          <div className="grid gap-4 lg:grid-cols-2">
            {Object.entries(value).filter(([k]) => k !== "_adminId").map(([k, v]) => <div key={`${path.join(".")}.${k}`} className={Array.isArray(v) || (v && typeof v === "object") ? "lg:col-span-2" : ""}>{renderField(v, [...path, k], k)}</div>)}
          </div>
        </div>
      );
    }
    return renderPrimitive(value, path, field);
  };

  if (!activeClassroomId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 text-center text-amber-300">
        <div>
          <div className="text-3xl font-black uppercase text-white">Chọn Lớp Trước Khi Soạn</div>
          <p className="mt-4 text-sm text-slate-300">Hãy chọn một lớp đang hoạt động trong mục Quản Lý Khoá Học để chỉnh bộ câu hỏi Chủ đề 4 cho riêng lớp đó.</p>
          <Link to="/courses" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-black uppercase text-slate-950">Đến Quản Lý Khoá Học</Link>
        </div>
      </div>
    );
  }
  if (loadingPage) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-300">Đang tải bảng soạn Chủ đề 4...</div>;
  if (!content) return <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 text-center text-amber-300">{error || "Không tải được dữ liệu quản trị."}</div>;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1f2937_0%,#020617_72%)] px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="grid gap-4 rounded-[28px] border border-white/10 bg-slate-900/85 p-5 shadow-2xl lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-300"><ShieldCheck size={16} /> Chủ Đề 4 Theo Lớp</div>
            <h1 className="mt-4 text-3xl font-black uppercase tracking-[0.14em] text-white">Soạn Bộ Câu Hỏi Chủ Đề 4</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">Lớp đang chỉnh sửa: <span className="font-bold text-amber-300">{activeClassroomName || 'Chưa đặt tên'}</span>. Dữ liệu bạn lưu chỉ hiển thị cho thành viên của lớp này.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={() => navigate("/modes")} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-800 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white"><ArrowLeft size={16} /> Về Chọn Chế Độ</button>
            <button onClick={syncDefault} disabled={syncing} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-950 disabled:opacity-60">{syncing ? <LoaderCircle size={16} className="animate-spin" /> : <RotateCcw size={16} />}{syncing ? "Đang khôi phục..." : "Khôi phục mặc định"}</button>
          </div>
        </div>
        {(notice || error) ? <div className={`rounded-2xl border px-5 py-4 text-sm font-semibold ${error ? "border-rose-400/30 bg-rose-500/10 text-rose-100" : "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"}`}>{error || notice}</div> : null}
        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <aside className="rounded-[28px] border border-white/10 bg-slate-900/85 p-5 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-slate-400"><Database size={16} /> Chọn Trò Chơi</div>
            <div className="mt-4 space-y-3">
              {modes.map((m) => {
                const active = m.id === selectedModeId;
                return (
                  <button key={m.id} onClick={() => { setSelectedModeId(m.id); setEditingItemId(""); setFormState(null); setNotice(""); setError(""); }} className={`w-full rounded-2xl border p-4 text-left ${active ? "border-amber-400/30 bg-amber-500/10" : "border-white/10 bg-slate-800/70"}`}>
                    <div className="text-lg font-bold text-white">{m.name}</div>
                    <div className="mt-2 text-sm text-slate-300">{m.desc}</div>
                  </button>
                );
              })}
            </div>
          </aside>
          <section className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/85 p-5 shadow-xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Trò Chơi Đang Quản Trị</div>
                  <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.12em] text-white">{mode?.name}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{mode?.longDesc || mode?.desc}</p>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-300">{config.h}</div>
                </div>
                <button type="button" onClick={startCreate} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-950"><Plus size={16} /> {singleMode ? "Tạo / thay dữ liệu" : "Thêm mục mới"}</button>
              </div>
            </div>
            <div className="grid gap-6 2xl:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[28px] border border-white/10 bg-slate-900/85 p-5 shadow-xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Danh Sách Đang Lưu</div>
                  <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{loadingItems ? "Đang tải..." : `${items.length} mục`}</div>
                </div>
                <div className="mt-5 space-y-3">
                  {!loadingItems && items.length === 0 ? <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/50 px-4 py-6 text-center text-sm text-slate-500">Trò chơi này chưa có dữ liệu trong MongoDB.</div> : null}
                  {items.map((item, index) => {
                    const active = item?._adminId === editingItemId;
                    return (
                      <div key={item?._adminId || `${selectedModeId}-${index}`} className={`rounded-2xl border p-4 ${active ? "border-amber-400/30 bg-amber-500/10" : "border-white/10 bg-slate-800/80"}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Mục {index + 1}</div>
                            <div className="mt-2 text-base font-bold text-white">{itemLabel(selectedModeId, item, index)}</div>
                          </div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => startEdit(item)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-200"><PencilLine size={14} /> Sửa</button>
                            <button type="button" onClick={() => deleteItem(item?._adminId)} className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-rose-200"><Trash2 size={14} /> Xóa</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-slate-900/85 p-5 shadow-xl">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Biểu Mẫu Dữ Liệu</div>
                  <div className="mt-2 text-sm text-slate-300">{editingItemId ? "Đang sửa dữ liệu đã có trong MongoDB." : "Tạo mới một mục dữ liệu cho chế độ hiện tại."}</div>
                </div>
                {formState ? (
                  <>
                    <div className="mt-5 space-y-4">{renderField(formState, [], "")}</div>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <button type="button" onClick={saveItem} disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-black uppercase tracking-[0.16em] text-slate-950 disabled:opacity-60">{saving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}{saving ? "Đang lưu..." : "Lưu vào MongoDB"}</button>
                      <button type="button" onClick={() => { setEditingItemId(""); setFormState(null); setNotice(""); setError(""); }} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-800 px-5 py-4 text-sm font-black uppercase tracking-[0.16em] text-white"><Trash2 size={16} /> Hủy chỉnh sửa</button>
                    </div>
                  </>
                ) : <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-slate-950/50 px-5 py-10 text-center text-sm text-slate-500">Chọn một mục để sửa hoặc bấm <span className="font-bold text-sky-300">Thêm mục mới</span> để bắt đầu.</div>}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
