
describe('Service: topics', () => {
  // load the service's module
  beforeEach(module('its110App'))

  // instantiate service
  let topics
  beforeEach(inject((_topics_) => {
    topics = _topics_
  }))

  it('should do something', () => {
    expect(!!topics).toBe(true)
  })
})
