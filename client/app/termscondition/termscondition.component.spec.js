'use strict';

describe('Component: TermsconditionComponent', function() {
  // load the controller's module
  beforeEach(module('complete2unlockApp.termscondition'));

  var TermsconditionComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    TermsconditionComponent = $componentController('termscondition', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
