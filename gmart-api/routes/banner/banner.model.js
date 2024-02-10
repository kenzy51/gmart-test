//Load Packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BannerSchema = new Schema({
  title: String,
	photo: String,
  visible: { type: Boolean, default: true }
}, {
  timestamps: true
});

//return the model
module.exports = mongoose.model('Banner', BannerSchema);