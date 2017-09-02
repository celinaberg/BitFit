// @flow

import type { $Request, $Response } from "express";

import User from "./user.model";

/**
 * Get list of users
 * restriction: 'admin'
 */
export async function index(req: $Request, res: $Response) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    return res.status(500).send(err);
  }
}

/**
 * Get a single user
 */
export async function show(req: $Request, res: $Response) {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.send(401);
    res.json(user.profile);
  } catch (err) {
    res.status(500).send(err);
  }
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export async function destroy(req: $Request, res: $Response) {
  try {
    await User.findByIdAndRemove(req.params.id);
    return res.send(204);
  } catch (err) {
    return res.status(500).send(err);
  }
}

/**
 * Get my info
 */
export async function me(req: $Request, res: $Response) {
  const uid = req.user.uid;
  try {
    const user = await User.findOne({
      uid: uid
    });
    if (!user) return res.json(401);
    res.json(user);
  } catch (err) {
    return res.status(500).send(err);
  }
}
