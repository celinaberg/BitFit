
const config = require('../config/environment')
const compose = require('composable-middleware')

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated () {
  return (req, res, next) => {
    if (req.hasOwnProperty('user')) {
      next()
    } else {
      return res.status(403).json({error: 'You are not allowed to access this page.'})
    }
  }
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

exports.isAuthenticated = isAuthenticated
exports.hasRole = hasRole
