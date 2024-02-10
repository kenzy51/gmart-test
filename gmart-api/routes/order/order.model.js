//Load Packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    userId: { type: Schema.ObjectId, ref: 'User' }, 
	code: { type: String },
    products: [{
        productId: { type: Schema.ObjectId, ref: 'Product' },
        name: String,
        categories: [String],
        quantity: Number,
        price: Number,
        sellPrice: Number,
        discount: Number
    }],
    subTotal: Number,
	deliveryCharge: Number,
	deliveryAddress: {
        name: String,
        addressId: { type: Schema.ObjectId, ref: 'Address' },
        phone: String,
        address: String,
        city: String,
        state: String,
        zipCode: String
    },
    totalPrice: Number,
    totalDiscount: Number,
    status: { type: 'string', enum: ['placed', 'cancelled', 'delivered'] },
    paymentId: String,
    paymentType: String,
    paymentStatus: { type: 'string', enum: ['pending', 'complete', 'refund'] },
}, {
  timestamps: true
});

OrderSchema.pre('save', async function (next) {
    const generateOrderCode = async (length) => {
        if (!length) length = 6;
    
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var result = "";
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))]
    
        const order = await mongoose.model('Order').findOne({'code': result})
        if (order && order._id) generateOrderCode(length)
    
        return result
    }

	if (this.isNew) {
        this.code = await generateOrderCode();
        next()
    } else {
        next()
    }
})

//return the model
module.exports = mongoose.model('Order', OrderSchema);
