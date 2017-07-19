
const config = require('../config/environment')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const compose = require('composable-middleware')
const User = require('../api/user/user.model')

const validateJwt = expressJwt({ secret: config.secrets.session })

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated () {
  return compose()
    // Attach user to request
    .use((req, res, next) => {
      if (req.hasOwnProperty('user')) {
        next()
      } else {
        console.log(req)
        return res.status(403).json({error: 'You are not allowed to access this page.'})
      }
    })
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole (roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set')

  return compose()
    .use(isAuthenticated())
    .use((req, res, next) => {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next()
      } else {
        res.send(403)
      }
    })
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken (id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60 * 5 })
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie (req, res) {
  if (!req.user) return res.json(404, { message: 'Something went wrong, please try again.' })
  const token = signToken(req.user._id, req.user.role)
  res.cookie('token', JSON.stringify(token))
  res.redirect('/')
}

exports.isAuthenticated = isAuthenticated
exports.hasRole = hasRole
exports.signToken = signToken
exports.setTokenCookie = setTokenCookie
