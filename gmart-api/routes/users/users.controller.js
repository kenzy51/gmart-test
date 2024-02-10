var _ = require('underscore');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var moment = require('moment');
var User = require('./users.model');
var Order = require('../order/order.model');
var Cart = require('../cart/cart.model');
var Setting = require('../setting/setting.model');
var config = require('../../config');
var { validateEmail, validatePhone, comparePassword } = require('../../lib/core');

// Create admin by script
exports.createAdmin = async function () {
    const totalUser = await User.count()
    if (totalUser === 0 && config.admin) {
        const userData = {
            email: config.admin.email,
            password: config.admin.password,
            profile: { firstName: config.admin.firstName },
            role: 'admin'
        }

        // save the user and check for errors
        var user = new User(userData);
        await user.save();
    }
}

exports.addUser = async function (req, res) {
    if ((req.body.email || req.body.phone) && req.body.password) {
        if (req.body.email) {
            const email = req.body.email.toLowerCase()
            if (validateEmail(email)) {
                const userWithEmail = await User.findOne({ 'email': email })
                if (userWithEmail && userWithEmail._id) {
                    return res.status(500).send({ success: false, error: 'Email already exist' })
                }
            } else {
                return res.status(500).send({ success: false, error: 'Invalid email' })
            }
        } else if (req.body.phone) {
            const phone = req.body.phone
            if (validatePhone(phone)) {
                const userWithPhone = await User.findOne({ 'phone': phone })
                if (userWithPhone && userWithPhone._id) {
                    return res.status(500).send({ success: false, error: 'Phone number already exist' })
                }
            } else {
                return res.status(500).send({ success: false, error: 'Invalid phone number' })
            }
        }

        var userData = new User();
        if (req.body.email) userData.email = req.body.email.toLowerCase()
        if (req.body.phone) userData.phone = req.body.phone
        userData.password = req.body.password
        userData.role = 'user'

        if (!_.isUndefined(req.body.firstName)) userData.profile['firstName'] = req.body.firstName
        if (!_.isUndefined(req.body.lastName)) userData.profile['lastName'] = req.body.lastName

        await userData.save()
            .then(async (userObj) => {
                var token = jwt.sign({ user: { _id: userObj._id, email: userObj?.email || '', phone: userObj?.phone || '', role: userObj.role } }, config.secret, {
                    expiresIn: config.expiresIn
                });
                userObj.token = token

                await User.updateOne({ _id: userObj._id }, { $set: { token: token } })
                return res.status(200).send({ success: true, message: 'User added', data: _.pick(userObj, ['_id', 'phone', 'role', 'profile', 'email', 'token']) });
            })
    } else {
        return res.status(400).send({ success: false, error: 'Invalid details' })
    }
}

exports.editUser = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        var userId = user._id
        if (user && user?.role == 'admin' && req?.body?.userId) userId = req?.body?.userId

        var userData = {}
        if (req.body.email) {
            if (validateEmail(req.body.email)) {
                const userWithEmail = await User.findOne({ _id: { $ne: userId }, 'email': { $regex: new RegExp('' + req.body.email, 'i') } })
                if (userWithEmail) {
                    return res.status(409).send({ success: false, error: 'email already exists' })
                } else {
                    userData['email'] = req.body.email
                }
            } else {
                return res.status(400).send({ success: false, error: 'invalid email' })
            }
        }

        if (req.body.phone) {
            const userWithPhone = await User.findOne({ _id: { $ne: userId }, 'phone': req.body.phone })
            if (userWithPhone) {
                return res.status(409).send({ success: false, error: 'phone number already exists' })
            } else {
                userData['phone'] = req.body.phone
            }
        }
        if(!_.isUndefined(req.body.firstName)) userData['profile.firstName'] = req.body.firstName
        if(!_.isUndefined(req.body.lastName)) userData['profile.lastName'] = req.body.lastName
        if(!_.isUndefined(req.body.photo)) userData['profile.photo'] = req.body.photo
        // update user
        await User.updateOne({ _id: userId }, { $set: userData }, { runValidators: true })
        .then((obj) => {
            return res.status(200).send({ success: true, message: 'user updated' })
        })
        .catch((err) => {
            return res.status(500).send({ success: false, error: 'internal server error' })
        })

    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.authUser = async function (req, res) {
    if (req.body && (req.body.email || req.body.phone) && req.body.password) {
        var user
        if (req.body.email) {
            const email = req.body.email.toLowerCase()
            user = await User.findOne({ 'email': { $regex: new RegExp('' + email, 'i') } })
            if (!user) return res.status(400).send({ success: false, error: 'Email is incorrect' })
        } else if (req.body.phone) {
            const phone = req.body.phone
            user = await User.findOne({ 'phone': phone })
            if (!user) return res.status(400).send({ success: false, error: 'Phone number is incorrect' })
        }

        var validPassword = comparePassword(req.body.password, user.password);
        if (!validPassword) return res.status(400).send({ success: false, error: 'Password is incorrect' })

        let cart = null
        if (req.body.userId) cart = await Cart.findOne({ userId: req.body.userId })
        if (cart && cart._id) {
            // check user has cart already
            const cartExists = await Cart.findOne({ userId: user._id })
            if (cartExists) await Cart.deleteOne({ _id: cartExists._id })
            // replace tempId to userId
            await Cart.updateOne({ _id: cart._id }, { $set: { userId: user._id } })
        }

        // create token
        var token = jwt.sign({ user: _.pick(user, ['_id', 'email', 'phone', 'role']) }, config.secret, { expiresIn: config.expiresIn })
        await User.updateOne({ _id: user._id }, { $set: { token } })

        return res.status(200).json({
            success: true,
            message: 'login successfully',
            data: { ..._.pick(user, ['_id', 'phone', 'role', 'profile', 'email']), token }
        });
    } else {
        return res.status(400).send({ success: false, error: 'email/phone and password are required' })
    }
}

exports.getUsers = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        if (user.role && user.role === 'admin') {
            var query = {}
            if (req.query.search) {
                query['$or'] = [
                    { 'profile.firstName': new RegExp(".*" + req.query.search.trim().replace(/(\W)/g, "\\$1") + ".*", "i") }, 
                    { 'profile.lastName': new RegExp(".*" + req.query.search.trim().replace(/(\W)/g, "\\$1") + ".*", "i") }, 
                    { 'email': new RegExp(".*" + req.query.search.trim().replace(/(\W)/g, "\\$1") + ".*", "i") },
                    { 'phone': new RegExp(".*" + req.query.search.trim().replace(/(\W)/g, "\\$1") + ".*", "i") }
                ]
            }

            const totalUser = await User.find(query).count()
            const users = await User.find(query).skip(req.query.skip).limit(req.query.limit).sort({ createdAt: -1 })

            return res.status(200).json({ success: true, users, totalUser });
        } else {
            return res.status(401).send({ success: false, error: 'only admin can access users' })
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.getUserDetail = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        try {
            await User.findOne({ _id: user._id }, { password: 0, token: 0 }).populate('addresses', '_id name phone address city state zipCode')
            .then(async (user) => {
                return res.status(200).json({ success: true, user });
            })
            .catch(err => {
                return res.status(500).send({ success: false, error: 'Internal server error' });
            })
        } catch (err) {
            return res.status(500).send({ success: false, error: err });
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.getTempUserId = async function (req, res) {
    return res.status(200).json({ success: true, userId: new mongoose.Types.ObjectId() });
}

exports.wishlistProduct = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        if(req?.body?.productId) {
            const userObj = await User.findOne({ _id: user._id }, { _id: 1, wishlist: 1 })
            var index = -1, query = { '$push': { wishlist: req.body.productId } }
            if(userObj && userObj.wishlist && userObj.wishlist.length > 0) index = _.findIndex(userObj.wishlist, productId => productId?.toString() === req.body.productId.toString())
            if(index > -1) query = { '$pull': { wishlist: req.body.productId }}
            await User.updateOne({ _id: user._id }, query)
            .then(async (result) => {
                return res.status(200).send({ success: true, message: `product ${index > -1 ? `removed from` : `added to`} wishlist` })
            })
            .catch(err => {
                return res.status(500).send({ success: false, error: 'internal server error' })
            })
        } else {
            return res.status(400).send({ success: false, error: 'productId required' })
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.getWishlistProducts = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        const userObj = await User.findOne({ _id: user._id }, { _id: 0, wishlist: 1 }).populate('wishlist', '_id name price specialPrice photos')
        return res.status(200).send({ success: true, products: userObj && userObj.wishlist ? userObj.wishlist : [] })
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.deleteUser = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        if (user.role && user.role === 'admin') {
            if(req?.params?.id) {
                const userObj = await User.findOne({ _id: req?.params?.id })
                if (!userObj) return res.status(400).send({ success: false, error: 'user not found' })

                const totalOrder = await Order.find({ userId: userObj._id }).count()
                if(totalOrder > 0) return res.status(403).send({ success: false, message: "user having order already, It can not be delete" })

                await User.deleteOne({ _id: req.params.id })
                .then(async () => {
                    await Cart.deleteMany({ userId: req.params.id })
                    return res.status(200).send({ success: true, message: 'user deleted' })
                })
                .catch(err => {
                    return res.status(500).send({ success: false, error: 'internal server error' })
                })
            } else {
                return res.status(400).send({ success: false, error: 'userId required' })
            }
        } else {
            return res.status(401).send({ success: false, error: 'only admin can delete user' })
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.getDashboardData = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        if (user.role && user.role === 'admin') {
            const dashboardData = {}

            //delivery limit
            const deliveryLimit = await Setting.findOne({ type: 'free_order_delivery_limit' })
            if(deliveryLimit && !_.isUndefined(deliveryLimit.value)) dashboardData['deliveryLimit'] = deliveryLimit.value

            //delivery charge
            const deliveryCharge = await Setting.findOne({ type: 'delivery_charge' })
            if(deliveryCharge && !_.isUndefined(deliveryCharge.value)) dashboardData['deliveryCharge'] = deliveryCharge.value

            //today orders
            const startTime = moment().startOf('day');
            const endTime = moment().endOf('day');
            dashboardData['todayOrder'] = await Order.find({ status: { $ne: 'cancelled' }, createdAt: { '$gte': startTime, '$lte': endTime } }).count()

            // this month order and income
            const firstDay = moment().startOf('month');
            const lastDay = moment().endOf('month');
            const monthOrder = await Order.find({ status: { $ne: 'cancelled' }, createdAt: { '$gte': firstDay, '$lte': lastDay } })
            dashboardData['monthOrder'] = monthOrder?.length || 0
            dashboardData['monthOrderTotal']  = _.reduce(_.pluck(monthOrder, 'totalPrice'), function(item, num) { return item + (num ? num : 0); }, 0)
            
            return res.status(200).send({ success: true, dashboardData })
        } else {
            return res.status(401).send({ success: false, error: 'only admin can access dashboard data' })
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}