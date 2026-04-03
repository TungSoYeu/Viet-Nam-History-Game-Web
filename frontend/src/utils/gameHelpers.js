import API_BASE_URL from "../config/api";

export function shuffleArray(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

export function matchesAnswer(userAnswer, acceptedAnswers = []) {
  const cleanUser = normalizeText(userAnswer);
  if (!cleanUser) return false;

  return acceptedAnswers.some((answer) => {
    const cleanAnswer = normalizeText(answer);
    return (
      cleanUser === cleanAnswer ||
      cleanUser.includes(cleanAnswer) ||
      cleanAnswer.includes(cleanUser)
    );
  });
}

export async function saveXp(xp) {
  const userId = localStorage.getItem("userId");
  if (!userId || !xp || xp <= 0) return;

  try {
    await fetch(`${API_BASE_URL}/api/user/add-xp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, xp }),
    });
  } catch (error) {
    console.error("Unable to save XP:", error);
  }
}

export function getModeSessionId(modeId) {
  const key = `theme4-session-${modeId}`;
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;

  const nextId = `${modeId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  sessionStorage.setItem(key, nextId);
  return nextId;
}

export function resetModeSessionId(modeId) {
  const key = `theme4-session-${modeId}`;
  sessionStorage.removeItem(key);
}

export async function logGameTelemetry(modeId, eventType, payload = {}) {
  if (!modeId || !eventType) return;
  const userId = localStorage.getItem("userId");
  const sessionId = getModeSessionId(modeId);

  try {
    await fetch(`${API_BASE_URL}/api/telemetry/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId || null,
        modeId,
        eventType,
        sessionId,
        payload,
      }),
      keepalive: true,
    });
  } catch (error) {
    console.error("Unable to log telemetry:", error);
  }
}
