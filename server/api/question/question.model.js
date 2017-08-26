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
  expectedOutput: String
});

QuestionSchema.methods.lesson = async function() {
  console.log("get virtual lesson");
  console.log(this);
  console.log(this._id);
  try {
    const lesson = await Lesson.findOne({
      questions: {
        $in: [mongoose.Types.ObjectId(this._id)]
      }
    });
    console.log("found", lesson);
    return lesson.id;
  } catch (err) {
    console.log("not found");
    return null;
  }
};

QuestionSchema.options.toObject = {};
QuestionSchema.options.toObject.transform = function(doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
  return ret;
};

export default mongoose.model("Question", QuestionSchema);
