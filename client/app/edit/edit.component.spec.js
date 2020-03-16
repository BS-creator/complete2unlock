'use strict';

describe('Component: EditComponent', function() {
  // load the controller's module
  beforeEach(module('complete2unlockApp.edit'));

  var EditComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    EditComponent = $componentController('edit', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
