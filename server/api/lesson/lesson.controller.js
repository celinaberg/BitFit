// @flow

import type { $Request, $Response } from "express";

import _ from "lodash";
import Lesson from "./lesson.model";
import Question from "../question/question.model";

// Add a question to this lesson
export async function addQuestion(req: $Request, res: $Response) {
  console.log("in add question in server");
  console.log(req.body);
  // if question already exists, only add it to lesson
  try {
    let question = await Question.findById(req.body.id);
    if (question === null) {
      // if not, create the new question
      question = new Question(req.body);
      question = await question.save();
      console.log("in save question success func");
    }

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.sendStatus(404);
    }

    lesson.questions.push(question);

    lesson.save();
    return res.json(question);
  } catch (err) {
    return handleError(res, err);
  }
}

export function deleteQuestion(req: $Request, res: $Response) {
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
}

// Get list of lessons
export function index(req: $Request, res: $Response) {
  Lesson.find().populate("lesson.questions").exec(function(err, lessons) {
    if (err) {
      res.status(500);
      return;
    }
    res.status(200).json(lessons);
  });
}

// Get a single lesson
export function show(req: $Request, res: $Response) {
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
}

// Creates a new lesson in the DB.
export function create(req: $Request, res: $Response) {
  Lesson.create(req.body, (err, lesson) => {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(lesson);
  });
}

// Updates an existing lesson in the DB.
export function update(req: $Request, res: $Response) {
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
}

// Deletes a lesson from the DB.
export function destroy(req: $Request, res: $Response) {
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
}

function handleError(res, err) {
  return res.status(500).send(err);
}
