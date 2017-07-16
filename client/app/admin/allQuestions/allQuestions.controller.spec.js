/* eslint-env mocha */

describe('Controller: AllQuestionsCtrl', () => {
  // load the controller's module
  beforeEach(module('its110App'))

  let allQuestionsCtrl
  let scope

  // Initialize the controller and a mock scope
  beforeEach(inject(($controller, $rootScope) => {
    scope = $rootScope.$new()
    allQuestionsCtrl = $controller('AllQuestionsCtrl', {
      $scope: scope
    })
  }))

  it('should ...', () => {
    expect(1).toEqual(1)
  })
})
