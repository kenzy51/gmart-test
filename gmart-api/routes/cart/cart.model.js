//Load Packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({
	userId: { type: Schema.Types.ObjectId },
  products: [{ 
      productId: { type: Schema.ObjectId, ref: 'Product' },
      quantity: Number
  }]
}, {
  timestamps: true
});

//return the model
module.exports = mongoose.model('Cart', CartSchema);