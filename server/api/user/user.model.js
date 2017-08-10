const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  uid: String,
  firstName: String,
  lastName: String,
  displayName: String,
  /**
   * Access granted to user
   *
   * One of:
   * - 'student'
   * - 'teaching-assistant'
   * - 'instructor'
   */
  role: {
    type: String,
    default: "student"
  },
  studentNumber: String,
  employeeNumber: String,
  section: String,
  term: Number,
  session: String,
  year: Number
});

/**
 * Virtuals
 */

// Public profile information
UserSchema.virtual("profile").get(function() {
  return {
    uid: this.uid,
    firstName: this.firstName,
    lastName: this.lastName,
    displayName: this.displayName,
    role: this.role
  };
});

// Non-sensitive info we'll be putting in the token
UserSchema.virtual("token").get(function() {
  return {
    uid: this.uid,
    role: this.role
  };
});

/**
 * Methods
 */
UserSchema.methods.toJSON = function() {
  var obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("User", UserSchema);
