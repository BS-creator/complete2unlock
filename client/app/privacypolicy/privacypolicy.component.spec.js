'use strict';

describe('Component: PrivacypolicyComponent', function() {
  // load the controller's module
  beforeEach(module('complete2unlockApp.privacypolicy'));

  var PrivacypolicyComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    PrivacypolicyComponent = $componentController('privacypolicy', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
