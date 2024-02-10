var _ = require('underscore');
var Address = require('./address.model');
var User = require('../users/users.model');

exports.addAddress = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        if (req.body.name && req.body.phone && req.body.address && req.body.city && req.body.state && req.body.zipCode) {
            var addressData = new Address();
            addressData.name = req.body.name
            addressData.phone = req.body.phone
            addressData.address = req.body.address
            addressData.city = req.body.city
            addressData.state = req.body.state
            addressData.zipCode = req.body.zipCode

            await addressData.save()
            .then(async (addrObj) => {
                await User.updateOne({ _id: user._id }, { $push: { addresses: addrObj._id }})
                return res.status(200).send({ success: true, message: 'address added', data: addrObj });
            })
            .catch(err => {
                return res.status(500).send({ success: false, error: 'internal server error' })
            })
        } else {
            return res.status(400).send({ success: false, error: 'Invalid details' })
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.editAddress = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        if(req?.params?.id) {
            var addressData = {}
            if(!_.isUndefined(req.body.name)) addressData['name'] = req.body.name
            if(!_.isUndefined(req.body.phone)) addressData['phone'] = req.body.phone
            if(!_.isUndefined(req.body.address)) addressData['address'] = req.body.address
            if(!_.isUndefined(req.body.city)) addressData['city'] = req.body.city
            if(!_.isUndefined(req.body.state)) addressData['state'] = req.body.state
            if(!_.isUndefined(req.body.zipCode)) addressData['zipCode'] = req.body.zipCode

            await Address.updateOne({ _id: req?.params?.id }, { $set: addressData })
            .then(async (result) => {
                return res.status(200).send({ success: true, message: 'address updated' })
            })
            .catch(err => {
                return res.status(500).send({ success: false, error: 'internal server error' })
            })
        } else {
            return res.status(400).send({ success: false, error: 'address id required' })
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.deleteAddress = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        if(req?.params?.id) {
            const address = await Address.findOne({ _id: req.params.id })
            if(address && address._id ) { 
                await Address.deleteOne({ _id: req.params.id })
                .then(async () => {
                    await User.updateOne({ _id: user._id }, { $pull: { addresses: req.params.id }})
                    return res.status(200).send({ success: true, message: 'address deleted' })
                })
                .catch(err => {
                    return res.status(500).send({ success: false, error: 'internal server error' })
                })
            } else {
                return res.status(400).send({ success: false, error: 'address does not exist' })
            }
        } else {
            return res.status(400).send({ success: false, error: 'address id required' })
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.getUserAddresses = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        const usrObj = await User.findOne({ _id: user._id }, { addresses: 1 })
        if(usrObj && usrObj.addresses && usrObj.addresses.length > 0) {
            const addresses = await Address.find({ _id: { $in: usrObj.addresses } })
            return res.status(200).send({ success: true, addresses })
        } else {
            return res.status(200).send({ success: true, addresses: [] })
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}