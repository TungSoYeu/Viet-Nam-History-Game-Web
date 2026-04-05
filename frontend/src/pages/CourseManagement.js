import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  BookOpenCheck,
  Copy,
  QrCode,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import {
  createClassroom,
  fetchClassroomJoinPreview,
  fetchMyClassrooms,
  joinClassroom,
} from "../services/classroomClient";
import {
  buildJoinUrl,
  buildQrImageUrl,
  clearActiveClassroom,
  getActiveClassroomId,
  setActiveClassroom,
} from "../utils/classroomContext";
import { getRoleLabel, isTeacherRole, normalizeRole } from "../utils/roleUtils";
import { useToast } from "../components/Toast";

function SectionCard({ title, subtitle, children }) {
  return (
    <div
      className="rounded-3xl p-5 sm:p-6"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-black text-white">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export default function CourseManagement() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [data, setData] = useState({ owned: [], joined: [], all: [] });
  const [selectedClassId, setSelectedClassId] = useState("");
  const [joinPreview, setJoinPreview] = useState(null);
  const [joinCode, setJoinCode] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [newClassDescription, setNewClassDescription] = useState("");
  const [activeClassIdState, setActiveClassIdState] = useState(getActiveClassroomId());

  const role = normalizeRole(localStorage.getItem("role"));
  const joinToken = searchParams.get("joinToken") || "";
  const isTeacher = isTeacherRole(role);

  const allClasses = data?.all || [];
  const selectedClass =
    allClasses.find((classroom) => classroom._id === selectedClassId) ||
    allClasses.find((classroom) => classroom._id === activeClassIdState) ||
    allClasses[0] ||
    null;

  const headerText = useMemo(() => {
    if (isTeacher) {
      return "Tạo lớp, chọn lớp đang dạy và quản lý danh sách học sinh tham gia.";
    }
    return "Tham gia nhiều lớp học, chọn lớp đang học và theo dõi nội dung riêng của lớp.";
  }, [isTeacher]);

  const loadClassrooms = async () => {
    setLoading(true);
    try {
      const response = await fetchMyClassrooms();
      setData(response);
      if (!response?.all?.some((classroom) => classroom._id === activeClassIdState)) {
        clearActiveClassroom();
        setActiveClassIdState("");
      }
    } catch (error) {
      toast.error(error.message || "Không tải được lớp học.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClassrooms();
  }, []);

  useEffect(() => {
    if (!joinToken) {
      setJoinPreview(null);
      return;
    }

    let cancelled = false;
    fetchClassroomJoinPreview(joinToken)
      .then((response) => {
        if (!cancelled) {
          setJoinPreview(response.classroom || null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setJoinPreview(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [joinToken]);

  useEffect(() => {
    if (!selectedClassId && selectedClass?._id) {
      setSelectedClassId(selectedClass._id);
    }
  }, [selectedClass, selectedClassId]);

  const handleCreateClassroom = async (event) => {
    event.preventDefault();
    if (!newClassName.trim()) {
      toast.warning("Nhập tên lớp trước khi tạo.");
      return;
    }

    setCreating(true);
    try {
      const response = await createClassroom({
        name: newClassName.trim(),
        description: newClassDescription.trim(),
      });
      setActiveClassroom(response.classroom);
      setActiveClassIdState(response.classroom?._id || "");
      setNewClassName("");
      setNewClassDescription("");
      toast.success("Đã tạo lớp học mới.");
      await loadClassrooms();
      setSelectedClassId(response.classroom?._id || "");
    } catch (error) {
      toast.error(error.message || "Không tạo được lớp học.");
    } finally {
      setCreating(false);
    }
  };

  const handleJoinClassroom = async (payload) => {
    setSubmitting(true);
    try {
      const response = await joinClassroom(payload);
      setActiveClassroom(response.classroom);
      setActiveClassIdState(response.classroom?._id || "");
      setJoinCode("");
      toast.success("Đã tham gia lớp học.");
      await loadClassrooms();
      setSelectedClassId(response.classroom?._id || "");
      if (joinToken) {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("joinToken");
        setSearchParams(nextParams, { replace: true });
      }
    } catch (error) {
      toast.error(error.message || "Không thể tham gia lớp học.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = async (value, successMessage) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(successMessage);
    } catch (error) {
      toast.error("Không sao chép được.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-amber-300" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%)" }}>
        Đang tải khoá học...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%)" }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div
          className="rounded-[32px] p-6 sm:p-8"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-amber-300">
            <Users size={15} />
            {getRoleLabel(role)}
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black text-white">
            Quản Lý Khoá Học
          </h1>
          <p className="mt-3 max-w-3xl text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.58)" }}>
            {headerText}
          </p>
        </div>

        {joinToken && joinPreview ? (
          <SectionCard
            title="Tham Gia Qua Đường Link"
            subtitle={`Bạn đang mở lời mời vào lớp ${joinPreview.name}.`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-white font-bold">{joinPreview.name}</div>
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Giáo viên: {joinPreview.teacher?.fullName || joinPreview.teacher?.username || "Ẩn danh"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleJoinClassroom({ joinToken })}
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black uppercase text-slate-950 disabled:opacity-60"
              >
                <UserPlus size={16} />
                {submitting ? "Đang tham gia..." : "Tham Gia Lớp"}
              </button>
            </div>
          </SectionCard>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {isTeacher ? (
              <SectionCard
                title="Tạo Lớp Học"
                subtitle="Mỗi lớp có mã lớp, đường link và QR riêng để học sinh tham gia."
              >
                <form onSubmit={handleCreateClassroom} className="space-y-4">
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(event) => setNewClassName(event.target.value)}
                    placeholder="Ví dụ: 12A1 - Ôn tập Bài 7"
                    className="w-full rounded-2xl px-4 py-3 text-white placeholder:text-slate-400 outline-none bg-slate-900/60 shadow-inner"
                    style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                  />
                  <textarea
                    value={newClassDescription}
                    onChange={(event) => setNewClassDescription(event.target.value)}
                    placeholder="Mô tả ngắn về lớp hoặc tiết học"
                    className="w-full rounded-2xl px-4 py-3 text-white placeholder:text-slate-400 outline-none bg-slate-900/60 shadow-inner resize-none"
                    rows={2}
                    style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                  />
                  <button
                    type="submit"
                    disabled={creating}
                    className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-black uppercase text-slate-950 disabled:opacity-60"
                  >
                    <Shield size={16} />
                    {creating ? "Đang tạo..." : "Tạo Lớp"}
                  </button>
                </form>
              </SectionCard>
            ) : null}

            <SectionCard
              title="Tham Gia Lớp Học"
              subtitle="Nhập mã lớp hoặc mở đường link/QR giáo viên gửi."
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
                  placeholder="Nhập mã lớp"
                  className="w-full rounded-2xl px-4 py-3 text-white placeholder:text-slate-400 outline-none bg-slate-900/60 shadow-inner"
                  style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                />
                <button
                  type="button"
                  onClick={() => handleJoinClassroom({ joinCode })}
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black uppercase text-slate-950 disabled:opacity-60"
                >
                  <UserPlus size={16} />
                  {submitting ? "Đang vào..." : "Vào Lớp"}
                </button>
              </div>
            </SectionCard>

            <SectionCard
              title={isTeacher ? "Danh Sách Lớp Đã Tạo" : "Các Lớp Đang Tham Gia"}
              subtitle="Chọn một lớp làm lớp đang hoạt động để học thuật, trò chơi và dữ liệu được lọc đúng theo lớp."
            >
              {allClasses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {isTeacher ? "Bạn chưa tạo lớp nào." : "Bạn chưa tham gia lớp nào."}
                </div>
              ) : (
                <div className="space-y-3">
                  {allClasses.map((classroom) => {
                    const active = classroom._id === activeClassIdState;
                    const selected = classroom._id === selectedClass?._id;
                    return (
                      <button
                        key={classroom._id}
                        type="button"
                        onClick={() => setSelectedClassId(classroom._id)}
                        className="w-full rounded-2xl p-4 text-left transition"
                        style={{
                          background: selected ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.03)",
                          border: active
                            ? "1px solid rgba(245,158,11,0.45)"
                            : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="font-black text-white">{classroom.name}</div>
                            <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                              {classroom.description || "Không có mô tả"}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {active ? (
                              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black uppercase text-emerald-300">
                                Đang hoạt động
                              </span>
                            ) : null}
                            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-black uppercase text-slate-200">
                              {classroom.studentsCount} học sinh
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard
              title="Lớp Đang Chọn"
              subtitle={selectedClass ? "Đây là lớp dùng để lọc nội dung học thuật và trò chơi." : "Chọn một lớp ở bên trái để xem chi tiết."}
            >
              {!selectedClass ? (
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Chưa có lớp nào được chọn.
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="text-xl font-black text-white">{selectedClass.name}</div>
                    <div className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {selectedClass.description || "Không có mô tả"}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveClassroom(selectedClass);
                        setActiveClassIdState(selectedClass._id);
                        toast.success("Đã chuyển lớp đang hoạt động.");
                      }}
                      className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-xs font-black uppercase text-slate-950"
                    >
                      <BookOpenCheck size={16} />
                      Dùng Lớp Này
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        clearActiveClassroom();
                        setActiveClassIdState("");
                        toast.success("Đã bỏ chọn lớp đang hoạt động.");
                      }}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase text-white"
                    >
                      Bỏ Chọn
                    </button>
                  </div>

                  {isTeacher ? (
                    <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                      <div className="space-y-3">
                        <div className="rounded-2xl bg-slate-900/60 px-4 py-3">
                          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Mã lớp</div>
                          <div className="mt-1 flex items-center justify-between gap-3">
                            <div className="text-lg font-black text-amber-300">{selectedClass.joinCode}</div>
                            <button
                              type="button"
                              onClick={() => handleCopy(selectedClass.joinCode, "Đã sao chép mã lớp.")}
                              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-black uppercase text-white"
                            >
                              <Copy size={14} />
                              Sao chép
                            </button>
                          </div>
                        </div>

                        <div className="rounded-2xl bg-slate-900/60 px-4 py-3">
                          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Đường link tham gia</div>
                          <div className="mt-1 break-all text-sm text-white">{buildJoinUrl(selectedClass.joinToken)}</div>
                          <button
                            type="button"
                            onClick={() => handleCopy(buildJoinUrl(selectedClass.joinToken), "Đã sao chép đường link tham gia.")}
                            className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-black uppercase text-white"
                          >
                            <Copy size={14} />
                            Sao chép link
                          </button>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white p-3">
                        <img
                          src={buildQrImageUrl(selectedClass.joinToken)}
                          alt={`QR tham gia lớp ${selectedClass.name}`}
                          className="h-40 w-40 rounded-xl object-cover"
                        />
                        <div className="mt-2 flex items-center justify-center gap-2 text-xs font-black uppercase text-slate-700">
                          <QrCode size={14} />
                          QR tham gia
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {isTeacher ? (
                    <div className="rounded-2xl bg-slate-900/60 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase text-amber-300">
                        <Users size={16} />
                        Danh Sách Học Sinh
                      </div>
                      {(selectedClass.students || []).length === 0 ? (
                        <div className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                          Chưa có học sinh nào tham gia lớp này.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {selectedClass.students.map((student) => (
                            <div
                              key={student._id}
                              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                            >
                              <div>
                                <div className="font-bold text-white">
                                  {student.fullName || student.username}
                                </div>
                                <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                                  @{student.username}
                                </div>
                              </div>
                              <div className="text-sm font-black text-amber-300">
                                {student.experience || 0} XP
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/leaderboard"
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase text-white"
                    >
                      <Users size={16} />
                      Bảng Phong Thần
                    </Link>
                    {isTeacher ? (
                      <>
                        <Link
                          to="/teacher/content"
                          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase text-white"
                        >
                          <BookOpenCheck size={16} />
                          Soạn Học Thuật
                        </Link>
                        <Link
                          to="/teacher/theme4"
                          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase text-white"
                        >
                          <Shield size={16} />
                          Soạn Chủ Đề 4
                        </Link>
                      </>
                    ) : null}
                  </div>
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
