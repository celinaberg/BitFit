
const express = require('express')
const passport = require('passport')
const strategy = require('./passport')
const auth = require('../auth.service')
const fs = require('fs')
const path = require('path')

const router = express.Router()

router.get('/metadata',
  (req, res) => {
    res.set('Content-Type', 'text/xml')
    const cert = fs.readFileSync(path.join(__dirname, '/../../cert/cert.pem'), 'utf8')
    res.send(strategy.generateServiceProviderMetadata(cert))
  }
)

router.get('/login',
  passport.authenticate('saml', { failureRedirect: '/login/failed' }),
  (req, res) => {
    res.redirect('/lessons')
  }
)

router.get('/login/failed',
  (req, res) => {
    res.status(401).send('You are not authorized to use BitFit. If you think this is an error, please contact the course instructor.')
  }
)

router.post('/login',
  passport.authenticate('saml', { failureRedirect: '/auth/cwl/login/failed' }),
  (req, res) => {
    res.redirect('/lessons')
  }
)

router.post('/login/callback',
  passport.authenticate('saml', { successRedirect: '/lessons', failureRedirect: '/auth/cwl/login/failed' }))

/*router.post('/login/callback',
  passport.authenticate('saml', { failureRedirect: '/auth/cwl/login/failed' }),
  (req, res) => {
    req.login(req.user, (err) => {
      if (err) {
        res.status(500).send('There was an issue with your login. Please try again later.')
      } else {
        res.redirect('/auth/cwl/session')
      }
    })
  }
)*/

/* router.post('/', function (req, res, next) {
  passport.authenticate('saml', function (err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!user) return res.json(404, { message: 'Something went wrong, please try again.' });

    var token = auth.signToken(user._id, user.role);
    res.json({ token: token });
  })(req, res, next);
}); */

module.exports = router
