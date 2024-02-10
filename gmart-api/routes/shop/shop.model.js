var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ShopSchema = new Schema(
  {
    container: String,
    longitude: Number,
    latitude: Number,
    description: String,
    //no photos for now
    photos: [],
    keywords: [],
    our: Boolean,
    //checkbox working with us
  },
  {
    timestamp: true,
  },
);

module.exports = mongoose.model("Shop", ShopSchema);
