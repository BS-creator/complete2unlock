/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
var RateLimit = require('express-rate-limit');

var limiter = new RateLimit({
  windowMs: 5*60*1000, // 15 minutes
  max: 20, // limit each IP to 100 requests per windowMs
  delayMs: 500 // disable delaying - full speed until the max limit is reached
});


export default function(app) {
  // Insert routes below
  app.use('/api/rotatingactions', require('./api/rotatingaction'));
  app.use('/api/configs', require('./api/config'));
  app.use('/api/payouts', require('./api/payout'));
  app.use('/api/monetizedactions', require('./api/monetizedaction'));
  app.use('/api/links', require('./api/link'));
  //app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', limiter);
  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  app.route('/redirect')
   .get((req, res) => {
     res.header('X-Frame-Options', 'SAMEORIGIN');
     res.sendFile(path.resolve(`${app.get('appPath')}/redirect.html`));
   });

  // All other routes should redirect to the app.html
  app.route('/embed/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/app.html`));
    });
  app.route('/*')
    .get((req, res) => {
      res.header('X-Frame-Options', 'SAMEORIGIN');
      res.sendFile(path.resolve(`${app.get('appPath')}/app.html`));
    });
}
