// @flow

import type { $Request, $Response } from "express";

import _ from "lodash";
import Lesson from "./lesson.model";
import Question from "../question/question.model";

// Get list of questions in given lesson
export async function getQuestions(req: $Request, res: $Response) {

  try {
    let questions = await Question.find({lesson: req.params.id});

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      let returnQuestion = question.toObject();
      questions[i] = returnQuestion;
    }

    return res.status(200).json(questions);
  } catch (err) {
    return handleError(res, err);
  }
}

// Get list of lessons
export async function index(req: $Request, res: $Response) {
  try {
    const lessons = await Lesson.find({});
    return res.status(200).json(lessons);
  } catch (err) {
    return handleError(res, err);
  }
}

// Get a single lesson
// CGB - not currently using this function
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
