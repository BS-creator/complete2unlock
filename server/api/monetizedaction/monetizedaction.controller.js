/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/monetizedactions              ->  index
 * POST    /api/monetizedactions              ->  create
 * GET     /api/monetizedactions/:id          ->  show
 * PUT     /api/monetizedactions/:id          ->  upsert
 * PATCH   /api/monetizedactions/:id          ->  patch
 * DELETE  /api/monetizedactions/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Monetizedaction from './monetizedaction.model';
const url = require('url');
const paypal = require('paypal-rest-sdk');
const config = require('../../config/environment');
paypal.configure(config.paypal);

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

// Gets a list of Monetizedactions
export function index(req, res) {
  let q = {
    user: req.user._id.toString()
  };
  if (req.query.admin) {
    if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf('admin')) {
      q = {
        status: 'ACTIVE'
      };
    } else {
      return res.status(403).send('Forbidden');
    }
  }

  return Monetizedaction.find(q).sort({
      completionsPercentage: 1
    })
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Monetizedaction from the DB
export function show(req, res) {
  return Monetizedaction.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function completePayment(req, res) {
  return Monetizedaction.findById(req.params.id).exec()
    .then((action) => {
      var paymentId = req.query.paymentId;
      if (action.paymentId !== paymentId)
        return res.status(400).send('paymentid missmatch');

      paypal.payment.execute(paymentId, {
        payer_id: req.query.PayerID,
        transactions: [{
          amount: {
            currency: 'USD',
            total: String(action.completionsTotal / 500 * 2)
          }
        }]
      }, config.paypal, function(err, payment) {
        if (err) {
          console.log(err);
          res.status(500).send('error while completing payment');
        }
        action.status = 'ACTIVE';
        action.save();
        res.redirect(307, config.baseUrl);
      });
    });
}

// Creates a new Monetizedaction in the DB
export function create(req, res) {
  if (req.body.amount % 500 !== 0 || req.body.amount < 500)
    return res.status(400).end();
  let amount = req.body.amount;
  return Monetizedaction.create({
      user: req.user.id,
      status: 'PENDING-PAYMENT',
      completionsTotal: amount,
      action: {
        channel: req.body.channel,
        action: req.body.action,
        actionUrl: req.body.url
      }
    })
    .then((action) => {
      try {
      let freeActions = Math.floor((req.user.affiliateStats.completions - req.user.affiliateStats.completionsPayout) * 0.05 / 500) * 500;
      freeActions = freeActions > amount ? amount : freeActions;
      amount -= freeActions;
      let price = amount / 500 * 2;
      if(price === 0) {
        action.status = 'ACTIVE';
        action.save();
        req.user.affiliateStats.completionsPayout += (freeActions / 0.1);
        req.user.save();
        return res.status(200).json({
          paymentId: 'FREE',
          url: `${config.baseUrl}/premiumactions`
        })
          .end();
      }
      paypal.payment.create({
        intent: 'sale',
        payer: {
          payment_method: 'paypal'
        },
        redirect_urls: {
          return_url: `${config.baseUrl}/api/monetizedactions/complete/${action.id}`,
          cancel_url: `${config.baseUrl}`
        },
        transactions: [{
          item_list: {
            items: [{
              name: `${req.body.amount} premium actions`,
              sku: 'pa-${amount}',
              price: String(price),
              currency: 'USD',
              quantity: 1
            }]
          },
          amount: {
            currency: 'USD',
            total: String(price)
          },
          description: `${req.body.amount} premium actions`
        }]
      }, config.paypal, (error, payment) => {
        if (error) {
          console.log(error);
          res.status(500).send('error while createing payment');
        } else {
          let url;
          for (var index = 0; index < payment.links.length; index++)
            if (payment.links[index].rel === 'approval_url')
              url = payment.links[index].href;
          action.paymentId = payment.id;

          if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf('admin')) {
            if (req.body.user)
              action.user = req.body.user;
            action.status = 'ACTIVE';
            action.save();
            return res.status(200).json({
                paymentId: action.paymentId,
                url: `${config.baseUrl}/admin`
              })
              .end();
          }

          action.save();
          res.status(200).json({
              paymentId: action.paymentId,
              url
            })
            .end();
        }
      });

    }catch (err) {
      console.log(err);
    }
    })
    .catch(handleError(res));
}

// Upserts the given Monetizedaction in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Monetizedaction.findOneAndUpdate({
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

// Updates an existing Monetizedaction in the DB
export function patch(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Monetizedaction.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Monetizedaction from the DB
export function destroy(req, res) {
  return Monetizedaction.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
