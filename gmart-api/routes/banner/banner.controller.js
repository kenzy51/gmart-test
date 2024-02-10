var _ = require('underscore');
var Banner = require('./banner.model');

exports.addBanner = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        if(user.role && user.role === 'admin') {
            if (req.body.photo) {
                var bannerData = new Banner();
                bannerData.photo = req.body.photo
                if(!_.isUndefined(req.body.title)) bannerData.title = req.body.title
                if(!_.isUndefined(req.body.visible)) bannerData.visible = req.body.visible
            
                await bannerData.save()
                .then(async (bannerObj) => {
                    return res.status(200).send({ success: true, message: 'banner added', data: bannerObj });
                })
                .catch(err => {
                    return res.status(500).send({ success: false, error: 'internal server error' })
                })
            } else {
                return res.status(400).send({ success: false, error: 'invalid details' })
            }
        } else {
            return res.status(400).send({ success: false, error: 'only admin can add banner' })
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.editBanner = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        if(user.role && user.role === 'admin') {
            if(req?.params?.id) {
                const banner = await Banner.findOne({ _id: req?.params?.id })
                if (!banner) return res.status(400).send({ success: false, error: 'invalid banner' })

                var bannerData = {}
                if(!_.isUndefined(req.body.photo)) bannerData['photo'] = req.body.photo
                if(!_.isUndefined(req.body.title)) bannerData['title'] = req.body.title
                if(!_.isUndefined(req.body.visible)) bannerData['visible'] = req.body.visible

                await Banner.updateOne({ _id: req?.params?.id }, { $set: bannerData })
                .then(async (result) => {
                    return res.status(200).send({ success: true, message: 'banner updated' })
                })
                .catch(err => {
                    return res.status(500).send({ success: false, error: 'internal server error' })
                })
            } else {
                return res.status(400).send({ success: false, error: 'bannerId required' })
            }
        } else {
            return res.status(400).send({ success: false, error: 'only admin can edit banner' })
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.deleteBanner = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        if(user.role && user.role === 'admin') {
            if(req?.params?.id) {
                const banner = await Banner.findOne({ _id: req?.params?.id })
                if (!banner) return res.status(400).send({ success: false, error: 'invalid banner' })

                await Banner.deleteOne({ _id: req.params.id })
                .then(async () => {
                    return res.status(200).send({ success: true, message: 'banner deleted' })
                })
                .catch(err => {
                    return res.status(500).send({ success: false, error: 'internal server error' })
                })
            } else {
                return res.status(400).send({ success: false, error: 'bannerId required' })
            }
        } else {
            return res.status(400).send({ success: false, error: 'only admin can delete banner' })
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.getBanners = async function (req, res) {
    var query = {}

    if (req.query.search) query['title'] = new RegExp(".*" + req.query.search.trim().replace(/(\W)/g, "\\$1") + ".*", "i") 
    if(!req.query.all) query['visible'] = true 

    const totalBanner = await Banner.find(query).count()
    const banners = await Banner.find(query).skip(req.query.skip).limit(req.query.limit).sort({ createdAt: -1 })

    return res.status(200).send({ success: true, banners, totalBanner })
}