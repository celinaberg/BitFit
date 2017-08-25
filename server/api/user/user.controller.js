// @flow

import User from "./user.model";

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  User.find({}, (err, users) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(users);
  });
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  const userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err) return res.status(500).send(err);
    return res.send(204);
  });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  const uid = req.user.uid;
  User.findOne(
    {
      uid: uid
    },
    (err, user) => {
      if (err) return next(err);
      if (!user) return res.json(401);
      res.json(user);
    }
  );
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect("/");
}
