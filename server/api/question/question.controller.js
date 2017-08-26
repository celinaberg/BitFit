// @flow

import type { $Request, $Response } from "express";

import _ from "lodash";
import Question from "./question.model";
import Lesson from "../lesson/lesson.model";

function handleError(res: $Response, err: Error) {
  console.trace();
  console.error(err);
  return res.status(500).send(err);
}

async function updateLesson(res: $Response, question: Question) {
  console.log("in updateLesson");
  if (question.lesson) {
    try {
      let lesson: Lesson = await Lesson.findById(question.lesson);
      console.log(lesson);
      if (!lesson.questions.includes(question.id)) {
        console.log("question id: ", question.id);
        console.log("lesson id: ", question.lesson);
        console.log("loaded lesson", lesson.id);
        lesson.questions.push(question.id);
        console.log(lesson);
        await lesson.save();
      }
    } catch (err) {
      handleError(res, err);
    }
  }
}

// Get list of questions
export async function index(req: $Request, res: $Response) {
  try {
    let questions = await Question.find();
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const lesson = await question.lesson();
      console.log("lesson", lesson);
      let returnQuestion = question.toObject();
      returnQuestion["lesson"] = lesson;
      console.log(returnQuestion);
      questions[i] = returnQuestion;
    }
    return res.status(200).json(questions);
  } catch (err) {
    return handleError(res, err);
  }
}

// Get list of questions for export
export async function exportQuestions(req: $Request, res: $Response) {
  try {
    const questions = await Question.find({}, { _id: 0, topic: 0 });
    return res.status(200).json(questions);
  } catch (err) {
    return handleError(res, err);
  }
}

// Get a single question
export async function show(req: $Request, res: $Response) {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.sendStatus(404);
    }
    return res.json(question);
  } catch (err) {
    return handleError(res, err);
  }
}

// Creates a new question in the DB.
export async function create(req: $Request, res: $Response) {
  try {
    const question = await Question.create(req.body);
    return res.status(201).json(question);
  } catch (err) {
    return handleError(res, err);
  }
}

// Import many questions to DB.
export function importQuestions(req: $Request, res: $Response) {
  Question.collection.insert(req.body, (err, questions) => {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(questions);
  });
}

// Updates an existing question in the DB.
export async function update(req: $Request, res: $Response) {
  console.log("in update");
  const newQuestion = req.body;
  try {
    let question: Question = await Question.findById(req.params.id);
    if (!question) {
      return res.sendStatus(404);
    }
    question.hints = newQuestion.hints; // manually copy as merge doesn't
    const updated = _.merge(question, newQuestion);
    await updateLesson(res, newQuestion);
    await updated.save();
    return res.status(200).json(question);
  } catch (err) {
    return handleError(res, err);
  }
}

// Deletes a question from the DB.
export function destroy(req: $Request, res: $Response) {
  Question.findById(req.params.id, (err, question) => {
    if (err) {
      return handleError(res, err);
    }
    if (!question) {
      return res.sendStatus(404);
    }
    question.remove(err => {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
}
