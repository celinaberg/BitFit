// @flow

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const LoggerSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  startTime: Date,
  endTime: { type: Date, default: Date.now },
  numCompiles: { type: Number, default: 0 },
  numErrorFreeCompiles: { type: Number, default: 0 },
  numRuns: { type: Number, default: 0 },
  numHints: { type: Number, default: 0 },
  totalAttempts: { type: Number, default: 0 },
  correctAttempts: { type: Number, default: 0 },
  className: String,
  code: String,
  expectedOutput: String
});

/**
 * Methods
 */
LoggerSchema.methods.toJSON = function() {
  var obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

export default mongoose.model("Logger", LoggerSchema);
