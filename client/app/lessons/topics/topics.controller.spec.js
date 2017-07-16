/* eslint-env mocha */
/* global inject expect */
describe('Controller: TopicsCtrl', () => {
  // load the controller's module
  beforeEach(module('its110App'))

  // Initialize the controller and a mock scope
  beforeEach(inject(($controller, $rootScope) => {
    let scope = $rootScope.$new()
    $controller('TopicsCtrl', {
      $scope: scope
    })
  }))

  it('should ...', () => {
    expect(1).toEqual(1)
  })
})
