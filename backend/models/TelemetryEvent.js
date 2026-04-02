const mongoose = require("mongoose");

const telemetryEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    modeId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    sessionId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

telemetryEventSchema.index({ modeId: 1, eventType: 1, createdAt: -1 });

module.exports = mongoose.model("TelemetryEvent", telemetryEventSchema);

