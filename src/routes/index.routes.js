const express = require("express");
const router = express.Router();

const { isAuthenticated, isGuest } = require("../middlewares/auth.middleware");
const { logout } = require("../controllers/auth.controller");

// Home Route
router.get("/", isAuthenticated, (req, res) => {
  res.render("home", { title: "صفحه اصلی" });
});

// Authentication Router
router.use("/auth", isGuest, require("./auth.routes"));

// Org Router
router.use("/orgs", isAuthenticated, require("./org.routes"));

// Module Router
router.use("/modules", isAuthenticated, require("./module.routes"));

// Role Router
router.use("/roles", isAuthenticated, require("./role.routes"));

// Checklist Router
router.use("/checklists", isAuthenticated, require("./audit/checklist.routes"));

// Question Router
router.use("/questions", isAuthenticated, require("./audit/question.routes"));

// Audit Course Router
router.use(
  "/audit-courses",
  isAuthenticated,
  require("./audit/auditCourse.routes")
);

// Response Router
router.use("/responses", isAuthenticated, require("./audit/response.routes"));

// Shift Router
router.use("/shifts", isAuthenticated, require("./audit/shift.routes"));

// Logout Route
router.get("/logout", isAuthenticated, logout);

// 404 Route
router.use((req, res) => {
  res.render("./errors/404", { title: "صفحه پیدا نشد" });
});

module.exports = router;
