const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    times: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Checklist", schema);
