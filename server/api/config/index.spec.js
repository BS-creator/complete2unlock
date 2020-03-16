'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var configCtrlStub = {
  index: 'configCtrl.index',
  show: 'configCtrl.show',
  create: 'configCtrl.create',
  upsert: 'configCtrl.upsert',
  patch: 'configCtrl.patch',
  destroy: 'configCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var configIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './config.controller': configCtrlStub
});

describe('Config API Router:', function() {
  it('should return an express router instance', function() {
    expect(configIndex).to.equal(routerStub);
  });

  describe('GET /api/configs', function() {
    it('should route to config.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'configCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/configs/:id', function() {
    it('should route to config.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'configCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/configs', function() {
    it('should route to config.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'configCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/configs/:id', function() {
    it('should route to config.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'configCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/configs/:id', function() {
    it('should route to config.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'configCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/configs/:id', function() {
    it('should route to config.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'configCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
