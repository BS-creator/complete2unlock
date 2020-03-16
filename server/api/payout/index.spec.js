'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var payoutCtrlStub = {
  index: 'payoutCtrl.index',
  show: 'payoutCtrl.show',
  create: 'payoutCtrl.create',
  upsert: 'payoutCtrl.upsert',
  patch: 'payoutCtrl.patch',
  destroy: 'payoutCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var payoutIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './payout.controller': payoutCtrlStub
});

describe('Payout API Router:', function() {
  it('should return an express router instance', function() {
    expect(payoutIndex).to.equal(routerStub);
  });

  describe('GET /api/payouts', function() {
    it('should route to payout.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'payoutCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/payouts/:id', function() {
    it('should route to payout.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'payoutCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/payouts', function() {
    it('should route to payout.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'payoutCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/payouts/:id', function() {
    it('should route to payout.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'payoutCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/payouts/:id', function() {
    it('should route to payout.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'payoutCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/payouts/:id', function() {
    it('should route to payout.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'payoutCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
