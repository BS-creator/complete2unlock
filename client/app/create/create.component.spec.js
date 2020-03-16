'use strict';

describe('Component: CreateComponent', function() {
  // load the controller's module
  beforeEach(module('complete2unlockApp.create'));

  var CreateComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    CreateComponent = $componentController('create', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
