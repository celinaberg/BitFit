

describe('Controller: TopicsCtrl', () => {
  // load the controller's module
  beforeEach(module('its110App'));

  let TopicsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(($controller, $rootScope) => {
    scope = $rootScope.$new();
    TopicsCtrl = $controller('TopicsCtrl', {
      $scope: scope,
    });
  }));

  it('should ...', () => {
    expect(1).toEqual(1);
  });
});
