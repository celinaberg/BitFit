const express = require('express')
const passport = require('passport')
const strategy = require('./passport')
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
  passport.authenticate('saml', { successRedirect: '/lessons', failureRedirect: '/login/failed' }))

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

router.get('/logout',
  (req, res) => {
    req.logout()
    res.redirect('/')
  }
)

module.exports = router
