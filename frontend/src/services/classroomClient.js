import { buildApiHeaders, buildApiUrl } from "../utils/classroomContext";

async function ensureJson(response, fallbackMessage) {
  if (response.ok) {
    return response.json();
  }

  const payload = await response.json().catch(() => ({}));
  throw new Error(payload.message || payload.error || fallbackMessage);
}

export async function fetchMyClassrooms() {
  const response = await fetch(buildApiUrl("/api/classrooms/my", { includeClassroom: false }), {
    method: "GET",
    headers: buildApiHeaders({ includeJson: false, includeClassroom: false }),
  });

  return ensureJson(response, "Không tải được danh sách lớp học.");
}

export async function createClassroom(payload) {
  const response = await fetch(buildApiUrl("/api/classrooms", { includeClassroom: false }), {
    method: "POST",
    headers: buildApiHeaders({ includeClassroom: false }),
    body: JSON.stringify(payload),
  });

  return ensureJson(response, "Không tạo được lớp học.");
}

export async function joinClassroom(payload) {
  const response = await fetch(buildApiUrl("/api/classrooms/join", { includeClassroom: false }), {
    method: "POST",
    headers: buildApiHeaders({ includeClassroom: false }),
    body: JSON.stringify(payload),
  });

  return ensureJson(response, "Không thể tham gia lớp học.");
}

export async function fetchClassroomJoinPreview(joinToken) {
  const response = await fetch(
    buildApiUrl(`/api/classrooms/join/${joinToken}`, { includeClassroom: false }),
    { method: "GET" }
  );

  return ensureJson(response, "Không tải được thông tin lớp học.");
}

export async function fetchClassroomDetail(classroomId) {
  const response = await fetch(
    buildApiUrl(`/api/classrooms/${classroomId}`, {
      includeClassroom: false,
    }),
    {
      method: "GET",
      headers: buildApiHeaders({ includeJson: false, includeClassroom: false }),
    }
  );

  return ensureJson(response, "Không tải được chi tiết lớp học.");
}

export async function fetchClassroomLeaderboard(classroomId) {
  const response = await fetch(
    buildApiUrl(`/api/classrooms/${classroomId}/leaderboard`, {
      includeClassroom: false,
    }),
    {
      method: "GET",
      headers: buildApiHeaders({ includeJson: false, includeClassroom: false }),
    }
  );

  return ensureJson(response, "Không tải được bảng phong thần của lớp.");
}
