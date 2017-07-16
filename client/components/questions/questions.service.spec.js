/* eslint-env mocha */
describe('Service: questions', () => {
  // load the service's module
  beforeEach(module('its110App'))

  // instantiate service
  let questions
  beforeEach(inject((_questions_) => {
    questions = _questions_
  }))

  it('should do something', () => {
    expect(!!questions).toBe(true)
  })
})
