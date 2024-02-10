//Load Package
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SettingsSchema = new Schema({
  type: String,
  value: String
});

//return the model
module.exports = mongoose.model('Settings', SettingsSchema);
