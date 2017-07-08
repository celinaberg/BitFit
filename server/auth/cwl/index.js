'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router.get('/login',
  passport.authenticate('saml', { failureRedirect: '/login/fail' }),
  function(req, res) {
    res.redirect('/lessons');
  }
);

router.get('/login/failed',
  function(req, res) {
    res.status(401).end('Login failed');
  }
);

router.post('/login',
  passport.authenticate('saml', { failureRedirect: '/auth/cwl/login/fail' }),
  function(req, res) {
    res.redirect('/lessons');
  }
);

router.post('/login/callback',
  passport.authenticate('saml', { failureRedirect: '/auth/cwl/login/fail' }),
  function(req, res) {
    res.redirect('/lessons');
  }
);

/*router.post('/', function (req, res, next) {
  passport.authenticate('saml', function (err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!user) return res.json(404, { message: 'Something went wrong, please try again.' });

    var token = auth.signToken(user._id, user.role);
    res.json({ token: token });
  })(req, res, next);
});*/

module.exports = router;
