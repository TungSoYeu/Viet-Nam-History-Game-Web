const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { normalizeRole } = require("../utils/roleUtils");

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return "";
}

async function resolveRequestUser(req, { required = true } = {}) {
  const token = getTokenFromRequest(req);
  const legacyUserId = req.headers["user-id"];
  let userId = null;
  let decodedRole = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
      decodedRole = normalizeRole(decoded.role);
    } catch (error) {
      if (required) {
        throw Object.assign(new Error("Token không hợp lệ hoặc đã hết hạn!"), {
          statusCode: 401,
        });
      }
      return null;
    }
  } else if (legacyUserId) {
    userId = legacyUserId;
  }

  if (!userId) {
    if (required) {
      throw Object.assign(new Error("Không tìm thấy thông tin xác thực!"), {
        statusCode: 401,
      });
    }
    return null;
  }

  const user = await User.findById(userId);
  if (!user) {
    if (required) {
      throw Object.assign(new Error("Người dùng không tồn tại!"), {
        statusCode: 401,
      });
    }
    return null;
  }

  const normalizedRole = normalizeRole(user.role || decodedRole);
  if (user.role !== normalizedRole) {
    user.role = normalizedRole;
    await user.save();
  }

  req.user = user;
  req.userId = user._id.toString();
  req.userRole = normalizedRole;
  return user;
}

function verifyToken(req, res, next) {
  resolveRequestUser(req)
    .then(() => next())
    .catch((error) => {
      res.status(error.statusCode || 500).json({ message: error.message });
    });
}

function requireRole(...allowedRoles) {
  const normalizedAllowedRoles = allowedRoles.map((role) => normalizeRole(role));

  return async (req, res, next) => {
    try {
      const user = await resolveRequestUser(req);
      if (!normalizedAllowedRoles.includes(normalizeRole(user.role))) {
        return res.status(403).json({
          message: "Quyền truy cập bị từ chối.",
        });
      }
      return next();
    } catch (error) {
      return res.status(error.statusCode || 500).json({ message: error.message });
    }
  };
}

async function resolveOptionalUser(req) {
  return resolveRequestUser(req, { required: false });
}

module.exports = {
  getTokenFromRequest,
  isAdmin: requireRole("teacher"),
  isTeacher: requireRole("teacher"),
  requireRole,
  resolveOptionalUser,
  resolveRequestUser,
  verifyToken,
};
