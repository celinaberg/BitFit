// @flow

import type { $Request, $Response } from "express";

import _ from "lodash";
import Question from "./question.model";

function handleError(res: $Response, err: Error) {
  console.trace();
  console.error(err);
  return res.status(500).send(err);
}

export const x = 10;

// Get list of questions
export async function index(req: $Request, res: $Response) {
  try {
    let questions = await Question.find({});

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
export async function importQuestions(req: $Request, res: $Response) {
  try {
    const questions = await Question.collection.insert(req.body);
    return res.status(201).json(questions);
  } catch (err) {
    return handleError(res, err);
  }
}

// Updates an existing question in the DB.
export async function update(req: $Request, res: $Response) {
  const newQuestion = req.body;
  try {
    let question: Question = await Question.findById(req.params.id);
    if (!question) {
      return res.sendStatus(404);
    }
    question.hints = newQuestion.hints; // manually copy as merge doesn't

    const updated = _.merge(question, newQuestion);
    await updated.save();
    return res.status(200).json(question);
  } catch (err) {
    return handleError(res, err);
  }
}

// Deletes a question from the DB.
export async function destroy(req: $Request, res: $Response) {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.sendStatus(404);
    }
    question.remove();
    return res.send(204);
  } catch (err) {
    return handleError(res, err);
  }
}
