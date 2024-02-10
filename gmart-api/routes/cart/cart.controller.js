var _ = require('underscore');
var Cart = require('./cart.model');
var Product = require('../product/product.model');
var Setting = require('../setting/setting.model');

exports.updateCart = async function (req, res) {
    if (req.params.userId && req.body.productId && !_.isUndefined(req.body.quantity)) {
        const product = await Product.findOne({ _id: req.body.productId })
        if(product && product._id) {
            if(req.body.quantity > product.quantity) {
                return res.status(401).send({ success: false, error: `${product.quantity} quantities available for ${product.name}` })
            } else {
                const cart = await Cart.findOne({ userId: req.params.userId })
                if (cart) {
                    const cartProduct = _.find(cart.products, (item) => item?.productId?.toString() === product?._id?.toString())
                    if(cartProduct && cartProduct.productId) {
                        if(req.body.quantity > 0) {
                            await Cart.updateOne({ '_id': cart._id, 'products.productId': product._id }, {'$set': { 'products.$.quantity': req.body.quantity }})
                        } else {
                            await Cart.updateOne({ '_id': cart._id }, {'$pull': { 'products': { productId: req.body.productId }}})
                        }
                    } else {
                        if(req.body.quantity > 0) {
                            await Cart.updateOne({ '_id': cart._id }, { '$push': { 'products': { productId: req.body.productId, quantity: req.body.quantity }}})
                        } else {
                            return res.status(500).send({ success: false, error: 'quantity must be greater than 0' })
                        }
                    }
                    return res.status(200).send({ success: true, message: 'cart updated' });
                } else {
                    if(req.body.quantity > 0) {
                        var cartData = new Cart();
                        cartData.userId = req.params.userId
                        cartData.products = [{ productId: req.body.productId, quantity: req.body.quantity }]

                        await cartData.save()
                        .then(async () => {
                            return res.status(200).send({ success: true, message: 'cart updated' });
                        })
                        .catch(err => {
                            return res.status(500).send({ success: false, error: 'internal server error' })
                        })
                    } else {
                        return res.status(500).send({ success: false, error: 'quantity must be greater than 0' })
                    }
                }
            }
        } else {
            return res.status(401).send({ success: false, error: `product is not available` })
        }
    } else {
        return res.status(401).send({ success: false, error: 'invalid details' })
    }
}

exports.getCart = async function (req, res) {
    if (req.query.userId) {
        const cart = await Cart.findOne({ userId: req.query.userId }).lean().populate('products.productId', '_id name price specialPrice photos quantity')
        if (cart) {
            const deliveryLimit = await Setting.findOne({ type: 'free_order_delivery_limit' })
            if (deliveryLimit && deliveryLimit.value) cart['freeOrderDeliveryLimit'] = deliveryLimit.value

            const deliveryCharge = await Setting.findOne({ type: 'delivery_charge' })
            if (deliveryCharge && deliveryCharge.value) cart['deliveryCharge'] = deliveryCharge.value

            return res.status(200).send({ success: true, cart })
        } else {
            return res.status(400).send({ success: false, error: 'cart not found' })
        }
    } else {
        return res.status(401).send({ success: false, error: 'userId required' })
    }
}