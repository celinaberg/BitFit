// @flow

import type { $Request, $Response } from "express";

import _ from "lodash";
import Logger from "./logger.model";

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

// Creates a new logger in the DB.
export async function create(req: $Request, res: $Response) {
  try {
    const logger = await Logger.create(req.body);
    return res.status(201).json(logger);
  } catch (err) {
    return handleError(res, err);
  }
}

// Updates an existing logger in the DB.
export async function update(req: $Request, res: $Response) {
  try {
    const logger = await Logger.findById(req.params.id);
    if (!logger) {
      return res.sendStatus(404);
    }
    const updated = _.merge(logger, req.body);
    updated.save();
    return res.status(200).json(logger);
  } catch (err) {
    return handleError(res, err);
  }
}

// Deletes a logger from the DB.
export async function destroy(req: $Request, res: $Response) {
  try {
    const logger = await Logger.findById(req.params.id);
    if (!logger) {
      return res.sendStatus(404);
    }
    logger.remove();
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
