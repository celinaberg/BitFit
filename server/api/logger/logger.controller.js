// @flow

import type { $Request, $Response } from "express";

// eslint-disable-next-line no-unused-vars
import _ from "lodash";
import Logger from "./logger.model";
import Question from "../question/question.model";

// Get list of loggers
export async function index(req: $Request, res: $Response) {
  try {
    const loggers = await Logger.find();
    return res.status(200).json(loggers);
  } catch (err) {
    return handleError(res, err);
  }
}

// Get a single logger
export async function show(req: $Request, res: $Response) {
  try {
    const logger = await Logger.findById(req.params.id);
    if (!logger) {
      return res.sendStatus(404);
    }
    return res.json(logger);
  } catch (err) {
    return handleError(res, err);
  }
}

async function createNewLogger(userId: string, questionId: string): Logger {
  const question = await Question.findById(questionId);
  const logger = await Logger.create({
    user: userId,
    question: questionId,
    startTime: new Date().getTime(),
    className: question.className,
    code: question.code
  });
  return logger;
}

// Get a logger for current user and requested question
export async function getForQuestion(req: $Request, res: $Response) {
  try {
    let logger = await Logger.findOne({
      user: req.user.id,
      question: req.params.id
    });
    if (!logger) {
      logger = await createNewLogger(req.user.id, req.params.id);
    }
    return res.json(logger);
  } catch (err) {
    return handleError(res, err);
  }
}

// Updates an existing logger in the DB.
export async function update(req: $Request, res: $Response) {
  try {
    let logger = await Logger.findById(req.params.id);
    if (!logger) {
      return res.sendStatus(404);
    }

    Object.assign(logger, req.body);
    logger = await logger.save();
    return res.status(200).json(logger);
  } catch (err) {
    return handleError(res, err);
  }
}

function handleError(res, err) {
  console.trace();
  console.error(err);
  return res.status(500).send(err);
}
