//Load Packages
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AddressSchema = new Schema(
  {
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
  },
  {
    timestamps: true,
  },
);

//return the model
module.exports = mongoose.model("Address", AddressSchema);
