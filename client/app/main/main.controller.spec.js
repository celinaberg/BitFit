
describe('Controller: MainCtrl', () => {
  // load the controller's module
  beforeEach(module('its110App'))
  beforeEach(module('socketMock'))

  let MainCtrl,
    scope,
    $httpBackend

  // Initialize the controller and a mock scope
  beforeEach(inject((_$httpBackend_, $controller, $rootScope) => {
    $httpBackend = _$httpBackend_

    scope = $rootScope.$new()
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    })
  }))
})
