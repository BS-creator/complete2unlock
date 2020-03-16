/**
 * Monetizedaction model events
 */

'use strict';

import {EventEmitter} from 'events';
var MonetizedactionEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
MonetizedactionEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Monetizedaction) {
  for(var e in events) {
    let event = events[e];
    Monetizedaction.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    MonetizedactionEvents.emit(event + ':' + doc._id, doc);
    MonetizedactionEvents.emit(event, doc);
  };
}

export {registerEvents};
export default MonetizedactionEvents;
