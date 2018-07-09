// @flow

import mongoose from "mongoose";
import Lesson from "../lesson/lesson.model";

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  title: String,
  instructions: String,
  code: String,
  className: String,
  readOnly: Boolean,
  hints: [String],
  tags: String,
  expectedOutput: String,
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  dueDate: Date
});

QuestionSchema.options.toObject = {};
QuestionSchema.options.toObject.transform = function(doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
  return ret;
};

export default mongoose.model("Question", QuestionSchema);
