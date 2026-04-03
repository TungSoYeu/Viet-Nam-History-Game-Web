const mongoose = require("mongoose");

const theme4ContentSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: "theme4",
      unique: true,
      index: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

module.exports = mongoose.model("Theme4Content", theme4ContentSchema);
