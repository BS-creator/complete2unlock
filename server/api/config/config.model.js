'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './config.events';

var ConfigSchema = new mongoose.Schema({
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

registerEvents(ConfigSchema);
const model = mongoose.model('Config', ConfigSchema);

model.findOne().exec()
  .then(config => {
    if (config)
      return;
    new model().save();
  });

export default model;
