// @flow

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const LessonSchema = new Schema({
  title: { type: String, unique: true, required: true },
  background: String,
});

LessonSchema.methods.toJSON = function() {
  var obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

export default mongoose.model("Lesson", LessonSchema);
