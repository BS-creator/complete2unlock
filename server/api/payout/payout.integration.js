'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newPayout;

describe('Payout API:', function() {
  describe('GET /api/payouts', function() {
    var payouts;

    beforeEach(function(done) {
      request(app)
        .get('/api/payouts')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          payouts = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(payouts).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/payouts', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/payouts')
        .send({
          name: 'New Payout',
          info: 'This is the brand new payout!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPayout = res.body;
          done();
        });
    });

    it('should respond with the newly created payout', function() {
      expect(newPayout.name).to.equal('New Payout');
      expect(newPayout.info).to.equal('This is the brand new payout!!!');
    });
  });

  describe('GET /api/payouts/:id', function() {
    var payout;

    beforeEach(function(done) {
      request(app)
        .get(`/api/payouts/${newPayout._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          payout = res.body;
          done();
        });
    });

    afterEach(function() {
      payout = {};
    });

    it('should respond with the requested payout', function() {
      expect(payout.name).to.equal('New Payout');
      expect(payout.info).to.equal('This is the brand new payout!!!');
    });
  });

  describe('PUT /api/payouts/:id', function() {
    var updatedPayout;

    beforeEach(function(done) {
      request(app)
        .put(`/api/payouts/${newPayout._id}`)
        .send({
          name: 'Updated Payout',
          info: 'This is the updated payout!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPayout = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPayout = {};
    });

    it('should respond with the updated payout', function() {
      expect(updatedPayout.name).to.equal('Updated Payout');
      expect(updatedPayout.info).to.equal('This is the updated payout!!!');
    });

    it('should respond with the updated payout on a subsequent GET', function(done) {
      request(app)
        .get(`/api/payouts/${newPayout._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let payout = res.body;

          expect(payout.name).to.equal('Updated Payout');
          expect(payout.info).to.equal('This is the updated payout!!!');

          done();
        });
    });
  });

  describe('PATCH /api/payouts/:id', function() {
    var patchedPayout;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/payouts/${newPayout._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Payout' },
          { op: 'replace', path: '/info', value: 'This is the patched payout!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPayout = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPayout = {};
    });

    it('should respond with the patched payout', function() {
      expect(patchedPayout.name).to.equal('Patched Payout');
      expect(patchedPayout.info).to.equal('This is the patched payout!!!');
    });
  });

  describe('DELETE /api/payouts/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/payouts/${newPayout._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when payout does not exist', function(done) {
      request(app)
        .delete(`/api/payouts/${newPayout._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
