const _ = require("lodash");
const Lesson = require("./lesson.model");
const Question = require("../question/question.model");

// Add a question to this lesson
exports.addQuestion = function(req, res) {
  console.log("in add question in server");
  console.log(req.body);
  req.body.lesson = req.params.id; // is this necessary?

  // express's body parser middleware populates body for me

  // if question already exists, only add it to lesson
  Question.findById(req.body._id, (err, question) => {
    if (err) {
      return handleError(res, err);
    }
    if (question) {
      Lesson.findById(req.params.id, (err, lesson) => {
        if (err) {
          return handleError(res, err);
        }
        if (!lesson) {
          return res.sendStatus(404);
        }

        lesson.questions.push(question);

        lesson.save((err, lesson) => {
          if (err) {
            return handleError(err);
          }
          return res.json(question);
        });
      });
    } else {
      // if not, create the new question
      question = new Question(req.body);
      question.save((err, question) => {
        if (err) {
          return handleError(res, err);
        }
        console.log("in save question success func");
        Lesson.findById(req.params.id, (err, lesson) => {
          if (err) {
            return handleError(res, err);
          }
          if (!lesson) {
            return res.sendStatus(404);
          }

          lesson.questions.push(question);

          lesson.save((err, lesson) => {
            if (err) {
              return handleError(err);
            }
            return res.json(question);
          });
        });
      });
    }
  });
};

exports.deleteQuestion = function(req, res) {
  console.log("in delete q server");
  const question = req.body;
  console.log(question);
  Lesson.findById(req.params.id, (err, lesson) => {
    if (err) {
      return handleError(res, err);
    }
    if (!lesson) {
      return res.sendStatus(404);
    }

    lesson.questions.pull(question._id);
    lesson.save(err => {
      if (err) return handleError(err);
      console.log("the sub-doc was removed");
    });
  });
};

// Get list of lessons
exports.index = function(req, res) {
  Lesson.find().populate("lesson.questions").exec(function(err, lessons) {
    if (err) {
      res.status(500);
      return;
    }
    res.status(200).json(lessons);
  });
};

// Get a single lesson
exports.show = function(req, res) {
  Lesson.findById(req.params.id, (err, lesson) => {
    if (err) {
      return handleError(res, err);
    }
    if (!lesson) {
      return res.sendStatus(404);
    }

    lesson.populate("questions", (err, lesson) => {
      if (err) {
        return handleError(res, err);
      }
      return res.json(lesson);
    });
  });
};

// Creates a new lesson in the DB.
exports.create = function(req, res) {
  Lesson.create(req.body, (err, lesson) => {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(lesson);
  });
};

// Updates an existing lesson in the DB.
exports.update = function(req, res) {
  console.log("in update");
  if (req.body._id) {
    delete req.body._id;
  }
  Lesson.findById(req.params.id, (err, lesson) => {
    console.log("in update found lesson by id");
    if (err) {
      return handleError(res, err);
    }
    if (!lesson) {
      return res.sendStatus(404);
    }

    lesson.questions = req.body.questions; // without this, reordering doesn't work (found in question.controller)

    const updated = _.merge(lesson, req.body);
    updated.save(err => {
      // console.log(updated);
      if (err) {
        return handleError(res, err);
      }
      console.log("updated lesson now about to populate qs");
      lesson.populate("questions", (err, lesson) => {
        if (err) {
          console.log("error populating questions of updated lesson");
          return handleError(res, err);
        }
        console.log("looks like populate was successful?");
        console.log(lesson);
        return res.status(200).json(lesson);
      });
    });
  });
};

// Deletes a lesson from the DB.
exports.destroy = function(req, res) {
  Lesson.findById(req.params.id, (err, lesson) => {
    if (err) {
      return handleError(res, err);
    }
    if (!lesson) {
      return res.sendStatus(404);
    }
    lesson.remove(err => {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
