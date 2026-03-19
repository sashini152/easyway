const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  updateUserRole,
  updateNoShowCount,
  updatePenaltyStatus,
} = require("../controllers/UserController");

const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

// Admin-only role update
router.patch("/role/:id", authMiddleware, adminMiddleware, updateUserRole);

// Admin-only no-show / penalty updates
router.patch("/no-show/:id", authMiddleware, adminMiddleware, updateNoShowCount);
router.patch("/penalty/:id", authMiddleware, adminMiddleware, updatePenaltyStatus);

module.exports = router;