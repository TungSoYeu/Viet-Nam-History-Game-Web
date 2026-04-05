import { buildApiHeaders, buildApiUrl } from "../utils/classroomContext";

function ensureJsonResponse(response, fallbackMessage) {
  if (response.ok) {
    return response.json();
  }

  return response
    .json()
    .catch(() => ({}))
    .then((payload) => {
      throw new Error(payload.message || payload.error || fallbackMessage);
    });
}

export function buildTeacherHeaders(includeJson = true) {
  return buildApiHeaders({ includeJson, includeClassroom: true });
}

export async function fetchTheme4ModePayload(modeId, signal) {
  const response = await fetch(buildApiUrl(`/api/theme4/modes/${modeId}`), {
    method: "GET",
    headers: buildApiHeaders({ includeJson: false, includeClassroom: true }),
    signal,
  });

  return ensureJsonResponse(response, "Không tải được dữ liệu mode Chủ đề 4.");
}

export async function fetchAdminTheme4Content() {
  const response = await fetch(buildApiUrl("/api/teacher/theme4/content"), {
    method: "GET",
    headers: buildTeacherHeaders(false),
  });

  return ensureJsonResponse(response, "Không tải được dữ liệu quản trị Chủ đề 4.");
}

export async function saveAdminTheme4Content(content) {
  const response = await fetch(buildApiUrl("/api/teacher/theme4/content"), {
    method: "PUT",
    headers: buildTeacherHeaders(true),
    body: JSON.stringify({ content }),
  });

  return ensureJsonResponse(response, "Không lưu được dữ liệu Chủ đề 4.");
}

export async function syncTheme4DefaultContent() {
  const response = await fetch(buildApiUrl("/api/teacher/theme4/sync-default"), {
    method: "POST",
    headers: buildTeacherHeaders(false),
  });

  return ensureJsonResponse(response, "Không đồng bộ được dữ liệu mặc định Chủ đề 4.");
}

export async function fetchAdminTheme4ModeItems(modeId) {
  const response = await fetch(buildApiUrl(`/api/teacher/theme4/modes/${modeId}/items`), {
    method: "GET",
    headers: buildTeacherHeaders(false),
  });

  return ensureJsonResponse(response, "Không tải được danh sách câu hỏi của mode.");
}

export async function createAdminTheme4ModeItem(modeId, item) {
  const response = await fetch(buildApiUrl(`/api/teacher/theme4/modes/${modeId}/items`), {
    method: "POST",
    headers: buildTeacherHeaders(true),
    body: JSON.stringify({ item }),
  });

  return ensureJsonResponse(response, "Không thêm được câu hỏi cho mode.");
}

export async function updateAdminTheme4ModeItem(modeId, itemId, item) {
  const response = await fetch(
    buildApiUrl(`/api/teacher/theme4/modes/${modeId}/items/${itemId}`),
    {
      method: "PUT",
      headers: buildTeacherHeaders(true),
      body: JSON.stringify({ item }),
    }
  );

  return ensureJsonResponse(response, "Không cập nhật được câu hỏi của mode.");
}

export async function deleteAdminTheme4ModeItem(modeId, itemId) {
  const response = await fetch(
    buildApiUrl(`/api/teacher/theme4/modes/${modeId}/items/${itemId}`),
    {
      method: "DELETE",
      headers: buildTeacherHeaders(false),
    }
  );

  return ensureJsonResponse(response, "Không xóa được câu hỏi của mode.");
}

export async function uploadAdminTheme4Image(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(buildApiUrl("/api/teacher/theme4/uploads/image"), {
    method: "POST",
    headers: buildTeacherHeaders(false),
    body: formData,
  });

  return ensureJsonResponse(response, "Không tải được ảnh lên.");
}

export const buildAdminHeaders = buildTeacherHeaders;
