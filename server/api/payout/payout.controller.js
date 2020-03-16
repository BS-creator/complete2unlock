/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/payouts              ->  index
 * POST    /api/payouts              ->  create
 * GET     /api/payouts/:id          ->  show
 * PUT     /api/payouts/:id          ->  upsert
 * PATCH   /api/payouts/:id          ->  patch
 * DELETE  /api/payouts/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Payout from './payout.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

export function completeAdmin(req, res) {
  return Payout.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then((entity) => {
      entity.status = 'COMPLETED';
      entity.save();
      return entity;
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function indexAdmin(req, res) {
  let q = {};
  if(req.query.status)
    q.status = req.query.status;
  return Payout.find(q)
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Payouts
export function index(req, res) {
  return Payout.find({
      user: req.user.id
    }).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Payout from the DB
export function show(req, res) {
  return Payout.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Payout in the DB
export function create(req, res) {
  if (req.user.creditPending < 500000)
    return res.status(400).end();
  let amount = Math.floor(req.user.creditPending / 1000) * 1000;
  req.user.creditPending -= amount;
  req.user.creditPaid += amount;
  req.user.save();
  return Payout.create({
      user: req.user.id,
      paypalEmail: req.body.paypalEmail,
      amount: amount
    })
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Payout in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Payout.findOneAndUpdate({
      _id: req.params.id
    }, req.body, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true
    }).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Payout in the DB
export function patch(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Payout.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Payout from the DB
export function destroy(req, res) {
  return Payout.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
