

describe('Controller: EditContentCtrl', () => {
  // load the controller's module
  beforeEach(module('its110App'));

  let EditContentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(($controller, $rootScope) => {
    scope = $rootScope.$new();
    EditContentCtrl = $controller('EditContentCtrl', {
      $scope: scope,
    });
  }));

  it('should ...', () => {
    expect(1).toEqual(1);
  });
});
