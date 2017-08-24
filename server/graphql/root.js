// @flow
import Question from "../api/question/question.model";
import User from "../api/user/user.model";
import Lesson from "../api/lesson/lesson.model";

export default {
  hello: () => {
    return "Hello world!";
  },
  lessons: () => {
    return Lesson.find({}, (err, lessons) => {
      if (err) {
        return null;
      }
      console.log(lessons[0].questions);
      return lessons;
    });
  },
  question: ({ id }) => {
    return Question.findById(id, (err, question) => {
      if (err) {
        return null;
      }
      return question;
    });
  },
  questions: () => {
    return Question.find({}, (err, questions) => {
      if (err) {
        return null;
      }
      return questions;
    });
  },
  user: ({ id }) => {
    return User.findById(id, (err, user) => {
      if (err) {
        return null;
      }
      return user;
    });
  }
};
