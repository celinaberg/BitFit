/* eslint-env mocha */
describe('Controller: loggerCtrl', () => {
  // load the controller's module
  beforeEach(module('its110App'))

  let loggerCtrl,
    scope

  // Initialize the controller and a mock scope
  beforeEach(inject(($controller, $rootScope) => {
    scope = $rootScope.$new()
    loggerCtrl = $controller('loggerCtrl', {
      $scope: scope
    })
  }))

  it('should ...', () => {
    expect(1).toEqual(1)
  })
})
