'use strict';

describe('Component: LinksComponent', function() {
  // load the controller's module
  beforeEach(module('complete2unlockApp.links'));

  var LinksComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    LinksComponent = $componentController('links', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
