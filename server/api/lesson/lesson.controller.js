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

export async function deleteQuestion(req: $Request, res: $Response) {
  try {
    const question = req.body;
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.sendStatus(404);
    }
    lesson.questions.pull(question._id);
    lesson.save();
    return res.sendStatus(200);
  } catch (err) {
    return handleError(res, err);
  }
}

// Get list of lessons
export async function index(req: $Request, res: $Response) {
  try {
    const lessons = await Lesson.find().populate("questions").exec();
    return res.status(200).json(lessons);
  } catch (err) {
    return handleError(res, err);
  }
}

// Get a single lesson
export async function show(req: $Request, res: $Response) {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate("questions")
      .exec();
    if (!lesson) {
      return res.sendStatus(404);
    }
    return res.json(lesson);
  } catch (err) {
    return handleError(res, err);
  }
}

// Creates a new lesson in the DB.
export async function create(req: $Request, res: $Response) {
  try {
    const lesson = await Lesson.create(req.body);
    return res.status(201).json(lesson);
  } catch (err) {
    return handleError(res, err);
  }
}

// Updates an existing lesson in the DB.
export async function update(req: $Request, res: $Response) {
  try {
    let lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.sendStatus(404);
    }

    const updated = _.merge(lesson, req.body);
    updated.save();
    lesson = lesson.populate("questions");
    return res.status(200).json(lesson);
  } catch (err) {
    return handleError(res, err);
  }
}

// Deletes a lesson from the DB.
export async function destroy(req: $Request, res: $Response) {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.sendStatus(404);
    }
    lesson.remove();
    return res.send(204);
  } catch (err) {
    return handleError(res, err);
  }
}

function handleError(res, err) {
  console.trace();
  console.error(err);
  return res.status(500).send(err);
}
