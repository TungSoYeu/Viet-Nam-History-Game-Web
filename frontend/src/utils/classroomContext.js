import API_BASE_URL from "../config/api";

const ACTIVE_CLASSROOM_ID_KEY = "activeClassroomId";
const ACTIVE_CLASSROOM_NAME_KEY = "activeClassroomName";

export function getActiveClassroomId() {
  return localStorage.getItem(ACTIVE_CLASSROOM_ID_KEY) || "";
}

export function getActiveClassroomName() {
  return localStorage.getItem(ACTIVE_CLASSROOM_NAME_KEY) || "";
}

export function setActiveClassroom(classroom) {
  if (!classroom?._id) return;
  localStorage.setItem(ACTIVE_CLASSROOM_ID_KEY, classroom._id);
  localStorage.setItem(ACTIVE_CLASSROOM_NAME_KEY, classroom.name || "");
}

export function clearActiveClassroom() {
  localStorage.removeItem(ACTIVE_CLASSROOM_ID_KEY);
  localStorage.removeItem(ACTIVE_CLASSROOM_NAME_KEY);
}

export function buildApiHeaders(options = {}) {
  const { includeJson = true, includeClassroom = true } = options;
  const headers = {};
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const classroomId = getActiveClassroomId();

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (userId) {
    headers["user-id"] = userId;
  }

  if (includeClassroom && classroomId) {
    headers["x-classroom-id"] = classroomId;
  }

  return headers;
}

export function buildApiUrl(path, options = {}) {
  const {
    classroomId = getActiveClassroomId(),
    includeClassroom = true,
  } = options;
  const absolute = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  if (!includeClassroom || !classroomId) {
    return absolute;
  }

  try {
    const url = new URL(
      absolute,
      typeof window !== "undefined" ? window.location.origin : "http://localhost"
    );
    if (!url.searchParams.has("classroomId")) {
      url.searchParams.set("classroomId", classroomId);
    }
    return url.toString();
  } catch (error) {
    return `${absolute}${absolute.includes("?") ? "&" : "?"}classroomId=${encodeURIComponent(classroomId)}`;
  }
}

export function buildJoinUrl(joinToken) {
  if (!joinToken || typeof window === "undefined") return "";
  return `${window.location.origin}/courses?joinToken=${joinToken}`;
}

export function buildQrImageUrl(joinToken) {
  const joinUrl = buildJoinUrl(joinToken);
  return joinUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(joinUrl)}`
    : "";
}
