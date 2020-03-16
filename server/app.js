/**
 * Main application file
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/environment';
import http from 'http';
import https from 'https';
import fs from 'fs';
//import seedDatabaseIfNeeded from './config/seed';

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exit
});

// Setup server
var app = express();
var server = http.createServer(app);
require('./config/express').default(app);
require('./routes').default(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });

  try {
    let tlsOptions = {
      key: fs.readFileSync('/tls_key'),
      cert: fs.readFileSync('/tls_crt')
    };


    if (!tlsOptions.key || !tlsOptions.cert)
      return console.log('no tls config found');

    https.createServer(tlsOptions, app).listen(8443, function() {
      console.log('Your server is listening on port %d (https://localhost:%d)', 8443, 8443);
      console.log('Swagger-ui is available on https://localhost:%d/docs', 8443);
    });
  } catch (e) {
    console.log(e);
  }

}

//seedDatabaseIfNeeded();
setImmediate(startServer);

// Expose app
exports = module.exports = app;
