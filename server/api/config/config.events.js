/**
 * Config model events
 */

'use strict';

import {EventEmitter} from 'events';
var ConfigEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ConfigEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Config) {
  for(var e in events) {
    let event = events[e];
    Config.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    ConfigEvents.emit(event + ':' + doc._id, doc);
    ConfigEvents.emit(event, doc);
  };
}

export {registerEvents};
export default ConfigEvents;
