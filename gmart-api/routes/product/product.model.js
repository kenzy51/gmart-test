//Load Packages
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductSchema = new Schema(
  {
    name: String,
    description: String,
    location: String,
    photos: [String],
  },
  {
    timestamps: true,
  },
);

ProductSchema.index({ locationPoints: "2dsphere" });

//return the model
module.exports = mongoose.model("Product", ProductSchema);
