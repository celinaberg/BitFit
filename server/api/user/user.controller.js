

const User = require('./user.model');
const config = require('../../config/environment');
const jwt = require('jsonwebtoken');

const validationError = function (res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function (req, res) {
  User.find({}, '-salt -hashedPassword', (err, users) => {
    if (err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  const newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save((err, user) => {
    if (err) return validationError(res, err);
    const token = jwt.sign({ _id: user._id }, config.secrets.session, { expiresInMinutes: 60 * 5 });
    res.json({ token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  const userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function (req, res) {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a user's password
 */
exports.changePassword = function (req, res, next) {
  const userId = req.user._id;
  const oldPass = String(req.body.oldPassword);
  const newPass = String(req.body.newPassword);

  User.findById(userId, (err, user) => {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      user.save((err) => {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function (req, res, next) {
  const userId = req.user._id;
  User.findOne({
    _id: userId,
  }, '-salt -hashedPassword', (err, user) => { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
  res.redirect('/');
};
