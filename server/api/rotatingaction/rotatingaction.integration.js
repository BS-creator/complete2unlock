'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newRotatingaction;

describe('Rotatingaction API:', function() {
  describe('GET /api/rotatingactions', function() {
    var rotatingactions;

    beforeEach(function(done) {
      request(app)
        .get('/api/rotatingactions')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          rotatingactions = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(rotatingactions).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/rotatingactions', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/rotatingactions')
        .send({
          name: 'New Rotatingaction',
          info: 'This is the brand new rotatingaction!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newRotatingaction = res.body;
          done();
        });
    });

    it('should respond with the newly created rotatingaction', function() {
      expect(newRotatingaction.name).to.equal('New Rotatingaction');
      expect(newRotatingaction.info).to.equal('This is the brand new rotatingaction!!!');
    });
  });

  describe('GET /api/rotatingactions/:id', function() {
    var rotatingaction;

    beforeEach(function(done) {
      request(app)
        .get(`/api/rotatingactions/${newRotatingaction._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          rotatingaction = res.body;
          done();
        });
    });

    afterEach(function() {
      rotatingaction = {};
    });

    it('should respond with the requested rotatingaction', function() {
      expect(rotatingaction.name).to.equal('New Rotatingaction');
      expect(rotatingaction.info).to.equal('This is the brand new rotatingaction!!!');
    });
  });

  describe('PUT /api/rotatingactions/:id', function() {
    var updatedRotatingaction;

    beforeEach(function(done) {
      request(app)
        .put(`/api/rotatingactions/${newRotatingaction._id}`)
        .send({
          name: 'Updated Rotatingaction',
          info: 'This is the updated rotatingaction!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedRotatingaction = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedRotatingaction = {};
    });

    it('should respond with the updated rotatingaction', function() {
      expect(updatedRotatingaction.name).to.equal('Updated Rotatingaction');
      expect(updatedRotatingaction.info).to.equal('This is the updated rotatingaction!!!');
    });

    it('should respond with the updated rotatingaction on a subsequent GET', function(done) {
      request(app)
        .get(`/api/rotatingactions/${newRotatingaction._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let rotatingaction = res.body;

          expect(rotatingaction.name).to.equal('Updated Rotatingaction');
          expect(rotatingaction.info).to.equal('This is the updated rotatingaction!!!');

          done();
        });
    });
  });

  describe('PATCH /api/rotatingactions/:id', function() {
    var patchedRotatingaction;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/rotatingactions/${newRotatingaction._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Rotatingaction' },
          { op: 'replace', path: '/info', value: 'This is the patched rotatingaction!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedRotatingaction = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedRotatingaction = {};
    });

    it('should respond with the patched rotatingaction', function() {
      expect(patchedRotatingaction.name).to.equal('Patched Rotatingaction');
      expect(patchedRotatingaction.info).to.equal('This is the patched rotatingaction!!!');
    });
  });

  describe('DELETE /api/rotatingactions/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/rotatingactions/${newRotatingaction._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when rotatingaction does not exist', function(done) {
      request(app)
        .delete(`/api/rotatingactions/${newRotatingaction._id}`)
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
