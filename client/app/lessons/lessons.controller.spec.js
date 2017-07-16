
describe('Controller: LessonsCtrl', () => {
  // load the controller's module
  beforeEach(module('its110App'))

  let LessonsCtrl,
    scope

  // Initialize the controller and a mock scope
  beforeEach(inject(($controller, $rootScope) => {
    scope = $rootScope.$new()
    LessonsCtrl = $controller('LessonsCtrl', {
      $scope: scope
    })
  }))

  it('should ...', () => {
    expect(1).toEqual(1)
  })
})
