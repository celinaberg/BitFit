import mongoose from "mongoose";

const Schema = mongoose.Schema;

const LoggerSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  startTime: Date,
  endTime: { type: Date, default: Date.now },
  numCompiles: Number,
  numErrorFreeCompiles: Number,
  numRuns: Number,
  numHints: Number,
  totalAttempts: Number,
  correctAttempts: Number,
  className: String,
  code: String
});

export default mongoose.model("Logger", LoggerSchema);
