'use strict';

describe('Component: RotatingactionComponent', function() {
  // load the controller's module
  beforeEach(module('complete2unlockApp.rotatingaction'));

  var RotatingactionComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    RotatingactionComponent = $componentController('rotatingaction', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
