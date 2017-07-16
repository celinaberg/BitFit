/* eslint-env mocha */
const should = require('should')
const User = require('./user.model')

const user = new User({
  provider: 'local',
  name: 'Fake User',
  email: 'test@test.com',
  password: 'password'
})

describe('User Model', () => {
  before((done) => {
    // Clear users before testing
    User.remove().exec().then(() => {
      done()
    })
  })

  afterEach((done) => {
    User.remove().exec().then(() => {
      done()
    })
  })

  it('should begin with no users', (done) => {
    User.find({}, (err, users) => {
      if (err) {
        throw new Error()
      }
      users.should.have.length(0)
      done()
    })
  })

  it('should fail when saving a duplicate user', (done) => {
    user.save(() => {
      const userDup = new User(user)
      userDup.save((err) => {
        should.exist(err)
        done()
      })
    })
  })

  it('should fail when saving without an email', (done) => {
    user.email = ''
    user.save((err) => {
      should.exist(err)
      done()
    })
  })

  it('should authenticate user if password is valid', () => user.authenticate('password').should.be.true)

  it('should not authenticate user if password is invalid', () => user.authenticate('blah').should.not.be.true)
})
