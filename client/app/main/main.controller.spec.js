/* eslint-env mocha */
/* global inject */
describe('Controller: MainCtrl', () => {
  // load the controller's module
  beforeEach(module('its110App'))
  beforeEach(module('socketMock'))

  // Initialize the controller and a mock scope
  beforeEach(inject((_$httpBackend_, $controller, $rootScope) => {
    let scope = $rootScope.$new()
    $controller('MainCtrl', {
      $scope: scope
    })
  }))
})
