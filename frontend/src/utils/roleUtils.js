export function normalizeRole(role) {
  if (role === "admin") return "teacher";
  if (role === "user") return "student";
  if (role === "teacher" || role === "student") return role;
  return "student";
}

export function isTeacherRole(role) {
  return normalizeRole(role) === "teacher";
}

export function isStudentRole(role) {
  return normalizeRole(role) === "student";
}

export function getRoleLabel(role) {
  return isTeacherRole(role) ? "Giáo viên" : "Học sinh";
}
