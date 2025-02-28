const mongoose = require("mongoose");

const Shift = require("../../models/audit/shift.model");
const User = require("../../models/user.model");

const logger = require("../../controllers/log.controller");
const flashAndRedirect = require("../../utils/flashAndRedirect");
const handleError = require("../../utils/handleError");

// Render all shifts
const renderShifts = async (req, res) => {
  try {
    const shifts = await Shift.find().sort({ createdAt: -1 });
    res.render("audit/shifts/index", { title: "شیفت‌ها", shifts });
  } catch (error) {
    handleError(error, req, res, "/shifts");
  }
};

// Render the page for creating a new shift
const renderNewShift = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.render("audit/shifts/new", { title: "ایجاد شیفت جدید", users });
  } catch (error) {
    handleError(error, req, res, "/shifts");
  }
};

// Create a new shift
const newShift = async (req, res) => {
  const { name, startTime, endTime, daysOfWeek, users } = req.body;

  try {
    const shift = new Shift({ name, startTime, endTime, daysOfWeek, users });
    await shift.save();
    flashAndRedirect(
      req,
      res,
      "success",
      "شیفت جدید با موفقیت اضافه شد!",
      "/shifts"
    );
  } catch (error) {
    handleError(error, req, res, "/shifts/new");
  }
};

// Render the page for editing an existing shift
const renderEditShift = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id).populate("users"); // Populate users to show in the form
    if (!shift) return res.redirect("/shifts");

    const users = await User.find(); // Fetch all users to display in the selection list
    res.render("audit/shifts/edit", { title: "ویرایش شیفت", shift, users });
  } catch (error) {
    handleError(error, req, res, "/shifts");
  }
};

// Edit an existing shift
const editShift = async (req, res) => {
  const { name, startTime, endTime, daysOfWeek, users } = req.body;

  try {
    const shift = await Shift.findByIdAndUpdate(
      req.params.id,
      { name, startTime, endTime, daysOfWeek, users },
      { new: true }
    );
    if (!shift) return res.redirect("/shifts");
    flashAndRedirect(
      req,
      res,
      "success",
      "شیفت با موفقیت ویرایش شد!",
      "/shifts"
    );
  } catch (error) {
    handleError(error, req, res, `/shifts/${req.params.id}/edit`);
  }
};

// Delete a shift
const deleteShift = async (req, res) => {
  try {
    await Shift.findByIdAndDelete(req.params.id);
    flashAndRedirect(req, res, "success", "شیفت با موفقیت حذف شد!", "/shifts");
  } catch (error) {
    handleError(error, req, res, "/shifts");
  }
};

module.exports = {
  renderShifts,
  renderNewShift,
  newShift,
  renderEditShift,
  editShift,
  deleteShift,
};
