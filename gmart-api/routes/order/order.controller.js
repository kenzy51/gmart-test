var _ = require('underscore');
var Order = require('./order.model');
var User = require('../users/users.model');
var Cart = require('../cart/cart.model');
var Razorpay = require('razorpay');
var { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');
var Product = require('../product/product.model');
var Address = require('../address/address.model');
var Setting = require('../setting/setting.model');
var config = require('../../config');

exports.createRazorPayOrder = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        var cart = await Cart.findOne({ userId: user._id })
        if(!cart) return res.status(400).send({ success: false, error: 'please add products to cart before placing order' })

        const products = cart.products ? cart.products : []
        if(products && products.length > 0) {
            var subTotal = 0
            for(var i = 0; i < products.length; i++) {
                const product = await Product.findOne({ _id: products[i]?.productId })
                if(product && product._id) {
                    if(products[i]?.quantity > product.quantity) {
                        return res.status(401).send({ success: false, error: `${product.quantity} quantities available for ${product.name}` })
                    } else {
                        subTotal += product?.specialPrice * products[i]?.quantity > 0 ? product?.specialPrice * products[i]?.quantity : 0;
                    }
                } else {
                    return res.status(404).send({ success: false, error: 'product not found' })
                }
            }

            const freeOrderLimit = await Setting.findOne({ type: 'free_order_delivery_limit' })
            const deliverChrg = await Setting.findOne({ type: 'delivery_charge' })

            var deliveryLimit = freeOrderLimit?.value ? parseInt(freeOrderLimit?.value) : 0
            var deliveryCharge = deliverChrg?.value ? parseInt(deliverChrg?.value) : 0
            var totalPrice = deliveryLimit > subTotal ? (deliveryCharge ? subTotal + deliveryCharge : subTotal) : subTotal

            var instance = new Razorpay({ key_id: config?.razorPay?.keyId, key_secret: config?.razorPay?.keySecret })
            const order = await instance.orders.create({
                amount: totalPrice * 100,
                currency: 'INR'
            })

            if(order && order.id) return res.status(200).send({ success: true, data: { orderId: order.id, amount: totalPrice } })
            else return res.status(500).send({ success: false, error: 'unable to create razor pay order' })
        } else {
            return res.status(400).send({ success: false, error: 'please add products to cart before placing order' })
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.placeOrder = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        var cart = await Cart.findOne({ userId: user._id })
        if(!cart) return res.status(400).send({ success: false, error: 'cart is empty' })

        if (!req.body.paymentType) return res.status(400).send({ success: false, error: 'payment type required' })

        const products = cart.products ? cart.products : []
        if(products && products.length > 0) {
            var productsData = [], subTotal = 0, deliveryCharge = 0, total = 0, discount = 0;
            for(var i = 0; i < products.length; i++) {
                const product = await Product.findOne({ _id: products[i]?.productId })
                if(product && product._id) {
                    if(products[i]?.quantity > product.quantity) {
                        return res.status(401).send({ success: false, error: `${product.quantity} quantities available for ${product.name}` })
                    } else {
                        subTotal += product?.specialPrice * products[i]?.quantity > 0 ? product?.specialPrice * products[i]?.quantity : 0;
                        discount += product?.specialPrice >= product?.price ? 0 : (product?.price - (product?.specialPrice > 0 ? product?.specialPrice : 0)) * products[i]?.quantity
                        productsData.push({
                            productId: product?._id,
                            name: product?.name || '',
                            categories: product?.categories || [],
                            quantity: products[i]?.quantity,
                            price: product?.price > product?.specialPrice ? product?.price * products[i]?.quantity : product?.specialPrice * products[i]?.quantity,
                            discount: product?.specialPrice >= product?.price ? 0 : (product?.price - (product?.specialPrice > 0 ? product?.specialPrice : 0)) * products[i]?.quantity,
                            sellPrice: product?.specialPrice * products[i]?.quantity > 0 ? product?.specialPrice * products[i]?.quantity : 0,
                        })
                    }
                } else {
                    return res.status(404).send({ success: false, error: 'product not found' })
                }
            }

            const freeOrderLimit = await Setting.findOne({ type: 'free_order_delivery_limit' })
            const deliverChrg = await Setting.findOne({ type: 'delivery_charge' })

            var deliveryLimit = freeOrderLimit?.value ? parseInt(freeOrderLimit?.value) : 0
            var deliveryCharge = deliverChrg?.value ? parseInt(deliverChrg?.value) : 0

            if(deliveryLimit < subTotal) deliveryCharge = 0

            const orderData = {
                userId: user._id,
                products: productsData,
                deliveryCharge,
                subTotal,
                totalPrice: deliveryLimit > subTotal ? (deliveryCharge ? subTotal + deliveryCharge : subTotal) : subTotal,
                totalDiscount: discount,
                status: 'placed'
            }

            if (req.body.addressId) {
                const address = Address.findOne({ _id: req.body.addressId })
                if(address && address._id) {
                    orderData['deliveryAddress'] = {
                        addressId: address._id,
                        name: address.name || '',
                        phone: address.phone || '',
                        address: address.address || '',
                        city: address.city || '',
                        zipCode: address.zipCode || '',
                        state: address.state || ''
                    }
                }
            }

            if (req.body.paymentType === 'cod') {
                orderData['paymentType'] = 'cod'
                orderData['paymentStatus'] = 'pending'
            } else if(req.body.paymentType === 'razorPay') {
                if(req.body.paymentId && req.body.paymentOrderId && req.body.paymentSignature) {
                    var instance = new Razorpay({ key_id: config?.razorPay?.keyId, key_secret: config?.razorPay?.keySecret })
                    const isPaymentValid = await validatePaymentVerification({"order_id": req.body.paymentOrderId, "payment_id": req.body.paymentId }, req.body.paymentSignature, config?.razorPay?.keySecret);
                    if(!isPaymentValid) {
                        return res.status(500).send({ success: false, error: 'there is error in your payment...please try again' })
                    }
                    orderData['paymentId'] = req.body.paymentId
                    orderData['paymentType'] = 'razorPay'
                    orderData['paymentStatus'] = 'complete'
                } else {
                    return res.status(400).send({ success: false, error: 'paymentId, paymentOrderId and paymentSignature are required' })
                }
            }
            await Order.create(orderData)
            .then(async (result) => {
                for(var i = 0; i < orderData.products.length; i++) {
                    await Product.updateOne({ _id: orderData.products[i].productId }, { $inc: { quantity: -(orderData.products[i].quantity) } })
                }
                await Cart.updateOne({ userId: user._id }, { $set: { products: [] } })
                return res.status(200).send({ success: true, message: 'order placed successfully' })
            })
            .catch(err => {
                return res.status(500).send({ success: false, error: 'unable to place order..somthing went wrong' })
            })
        } else {
            return res.status(400).send({ success: false, error: 'please add products to cart before placing order' })
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.getOrders = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        var query = { '$and': [] }
        if(user.role === 'user') query['$and'].push({ userId: user._id })  
        if(req?.query?.status) query['$and'].push({ status: req?.query?.status }) 
        if(req?.query?.search && user.role === 'admin') {
            const userQuery = { $or: [{ 'profile.firstName': new RegExp(".*" + req.query.search.trim().replace(/(\W)/g, "\\$1") + ".*", "i") }, { 'profile.lastName': new RegExp(".*" + req.query.search.trim().replace(/(\W)/g, "\\$1") + ".*", "i") }, { 'email': new RegExp(".*" + req.query.search.trim().replace(/(\W)/g, "\\$1") + ".*", "i") }] }
            const userIds = _.pluck(await User.find(userQuery).lean(), '_id')
            query['$and'].push({ userId: { $in: userIds }})
        }
        if(req?.query?.fromDate) query['$and'].push({ createdAt: { '$gte': req?.query?.fromDate }})
        if(req?.query?.toDate) query['$and'].push({ createdAt: { '$lte': req?.query?.toDate }})

        if(query['$and'].length <= 0) delete query['$and'];

        const totalOrder = await Order.find(query).count()
        const orders = await Order.find(query).populate('userId', '_id profile email').populate('products.productId', '_id photos').skip(req?.query?.skip).limit(req?.query?.limit).sort({ createdAt: -1 })

        return res.status(200).send({ success: true, orders, totalOrder })
        
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.cancelOrder = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        if(req.params.id) {
            var order = await Order.findOne({ _id: req.params.id }) 
            if(order && order._id) {
                if(order && order.userId && (order.userId.toString() == user._id.toString() || user.role === 'admin')) {
                    try {
                        if(order.status && order.status == 'placed') {
                            const cancelOrder = async () => {
                                if(order.products && order.products.length > 0) {
                                    for(var i = 0; i < order.products.length; i++) {
                                        const prod = await Product.findOne({ _id: order.products[i]?.productId })
                                        if(prod && prod._id && order.products[i]?.quantity) await Product.updateOne({ _id: order.products[i]?.productId }, { $inc: { quantity: order.products[i]?.quantity } })
                                    }
                                }
                                await Order.updateOne({ _id: order._id }, { $set: { 'status': 'cancelled' } })
                                return res.status(200).send({ success: true, error: 'order cancelled successfully' })
                            }

                            if(order.paymentType) {
                                if(order.paymentType == 'razorPay') {
                                    var instance = new Razorpay({ key_id: config?.razorPay?.keyId, key_secret: config?.razorPay?.keySecret })
                                    const refunded = await instance.payments.refund(order.paymentId, {
                                        'amount': order.totalPrice * 100
                                    })
                                    if(refunded && refunded.id) return await cancelOrder()
                                } else {
                                    return await cancelOrder()
                                }
                            }  
                        } 

                        return res.status(500).send({ success: false, error: 'Unable to cancel order' })
                    } catch(error) {
                        return res.status(500).send({ success: false, error: 'Unable to cancel order' })
                    }
                } else {
                    return res.status(500).send({ success: false, error: 'this order does not belong to you' })
                }
            } else {
                return res.status(400).send({ success: false, error: 'order not found' })
            }
        } else {
            return res.status(400).send({ success: false, error: 'orderId required' })
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.deliverOrder = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        if(user.role && user.role === 'admin') {
            var order = await Order.findOne({ _id: req.params.id }) 
            if(order && order._id) {
                await Order.updateOne({_id: order._id}, { $set: { 'status': 'delivered' } })
                .then((obj) => {
                    return res.status(200).send({ success: true, message: 'order set as delivered successfully' })
                })
                .catch((err) => {
                    return res.status(500).send({ success: false, error: 'unable to set order as delivered' })
                })        
            } else {
                return res.status(400).send({ success: false, error: 'order not found' })
            }
        } else {
            return res.status(401).send({ success: false, error: 'only admin can set order as delivered' })
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}