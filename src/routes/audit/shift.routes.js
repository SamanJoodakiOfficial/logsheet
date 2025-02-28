const express = require("express");
const router = express.Router();

const {
  renderShifts,
  renderNewShift,
  renderEditShift,
  newShift,
  editShift,
  deleteShift,
} = require("../../controllers/audit/shift.controller");

router.get("/", renderShifts);

router.get("/new", renderNewShift);
router.post("/new", newShift);

router.get("/:id/edit", renderEditShift);
router.post("/:id/edit", editShift);

router.get("/:id/delete", deleteShift);

module.exports = router;
