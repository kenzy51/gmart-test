//Load Packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
	name: String,
	photo: String
}, {
  timestamps: true
});

//return the model
module.exports = mongoose.model('Category', CategorySchema);