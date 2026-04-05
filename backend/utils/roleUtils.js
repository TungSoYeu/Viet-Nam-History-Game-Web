function normalizeRole(role) {
  if (role === "admin") return "teacher";
  if (role === "user") return "student";
  if (role === "teacher" || role === "student") return role;
  return "student";
}

function isTeacherRole(role) {
  return normalizeRole(role) === "teacher";
}

function isStudentRole(role) {
  return normalizeRole(role) === "student";
}

module.exports = {
  isStudentRole,
  isTeacherRole,
  normalizeRole,
};
