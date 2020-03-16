'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newMonetizedaction;

describe('Monetizedaction API:', function() {
  describe('GET /api/monetizedactions', function() {
    var monetizedactions;

    beforeEach(function(done) {
      request(app)
        .get('/api/monetizedactions')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          monetizedactions = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(monetizedactions).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/monetizedactions', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/monetizedactions')
        .send({
          name: 'New Monetizedaction',
          info: 'This is the brand new monetizedaction!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newMonetizedaction = res.body;
          done();
        });
    });

    it('should respond with the newly created monetizedaction', function() {
      expect(newMonetizedaction.name).to.equal('New Monetizedaction');
      expect(newMonetizedaction.info).to.equal('This is the brand new monetizedaction!!!');
    });
  });

  describe('GET /api/monetizedactions/:id', function() {
    var monetizedaction;

    beforeEach(function(done) {
      request(app)
        .get(`/api/monetizedactions/${newMonetizedaction._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          monetizedaction = res.body;
          done();
        });
    });

    afterEach(function() {
      monetizedaction = {};
    });

    it('should respond with the requested monetizedaction', function() {
      expect(monetizedaction.name).to.equal('New Monetizedaction');
      expect(monetizedaction.info).to.equal('This is the brand new monetizedaction!!!');
    });
  });

  describe('PUT /api/monetizedactions/:id', function() {
    var updatedMonetizedaction;

    beforeEach(function(done) {
      request(app)
        .put(`/api/monetizedactions/${newMonetizedaction._id}`)
        .send({
          name: 'Updated Monetizedaction',
          info: 'This is the updated monetizedaction!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedMonetizedaction = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedMonetizedaction = {};
    });

    it('should respond with the updated monetizedaction', function() {
      expect(updatedMonetizedaction.name).to.equal('Updated Monetizedaction');
      expect(updatedMonetizedaction.info).to.equal('This is the updated monetizedaction!!!');
    });

    it('should respond with the updated monetizedaction on a subsequent GET', function(done) {
      request(app)
        .get(`/api/monetizedactions/${newMonetizedaction._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let monetizedaction = res.body;

          expect(monetizedaction.name).to.equal('Updated Monetizedaction');
          expect(monetizedaction.info).to.equal('This is the updated monetizedaction!!!');

          done();
        });
    });
  });

  describe('PATCH /api/monetizedactions/:id', function() {
    var patchedMonetizedaction;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/monetizedactions/${newMonetizedaction._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Monetizedaction' },
          { op: 'replace', path: '/info', value: 'This is the patched monetizedaction!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedMonetizedaction = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedMonetizedaction = {};
    });

    it('should respond with the patched monetizedaction', function() {
      expect(patchedMonetizedaction.name).to.equal('Patched Monetizedaction');
      expect(patchedMonetizedaction.info).to.equal('This is the patched monetizedaction!!!');
    });
  });

  describe('DELETE /api/monetizedactions/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/monetizedactions/${newMonetizedaction._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when monetizedaction does not exist', function(done) {
      request(app)
        .delete(`/api/monetizedactions/${newMonetizedaction._id}`)
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
