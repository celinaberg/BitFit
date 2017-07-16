
describe('Service: logging', () => {
  // load the service's module
  beforeEach(module('its110App'))

  // instantiate service
  let logging
  beforeEach(inject((_logging_) => {
    logging = _logging_
  }))

  it('should do something', () => {
    expect(!!logging).toBe(true)
  })
})
