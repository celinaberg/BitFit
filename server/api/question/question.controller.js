// @flow

import type { $Request, $Response } from "express";

import _ from "lodash";
import Question from "./question.model";

function handleError(res, err) {
  return res.status(500).send(err);
}

// Get list of questions
export async function index(req: $Request, res: $Response) {
  try {
    const questions = await Question.find();
    return res.status(200).json(questions);
  } catch (err) {
    return handleError(res, err);
  }
}

// Get list of questions for export
export function exportQuestions(req: $Request, res: $Response) {
  Question.find({}, { _id: 0, topic: 0 }, (err, questions) => {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(questions);
  });
}

// Get a single question
export function show(req: $Request, res: $Response) {
  Question.findById(req.params.id, (err, question) => {
    if (err) {
      return handleError(res, err);
    }
    if (!question) {
      return res.sendStatus(404);
    }
    return res.json(question);
  });
}

// Creates a new question in the DB.
export function create(req: $Request, res: $Response) {
  Question.create(req.body, (err, question) => {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(question);
  });
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
export function update(req: $Request, res: $Response) {
  if (req.body._id) {
    delete req.body._id;
  }
  Question.findById(req.params.id, (err, question) => {
    if (err) {
      return handleError(res, err);
    }
    if (!question) {
      return res.sendStatus(404);
    }
    question.hints = req.body.hints; // manually copy as merge doesn't
    const updated = _.merge(question, req.body);
    updated.save(err => {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(question);
    });
  });
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
