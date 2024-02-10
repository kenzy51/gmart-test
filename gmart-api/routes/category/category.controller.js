var _ = require('underscore');
var Category = require('./category.model');
var Product = require('../product/product.model');

exports.addCategory = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        if (req.body.name) {
            var categoryData = new Category();
            categoryData.name = req.body.name
            if(!_.isUndefined(req.body.photo)) categoryData.photo = req.body.photo
           
            await categoryData.save()
            .then(async (categoryObj) => {
                return res.status(200).send({ success: true, message: 'category added', data: categoryObj });
            })
            .catch(err => {
                return res.status(500).send({ success: false, error: 'internal server error' })
            })
        } else {
            return res.status(400).send({ success: false, error: 'invalid details' })
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.editCategory = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        if(req?.params?.id) {
            const category = await Category.findOne({ _id: req?.params?.id })
            if (!category) return res.status(400).send({ success: false, error: 'invalid category' })

            var categoryData = {}
            if(!_.isUndefined(req.body.name)) categoryData['name'] = req.body.name
            if(!_.isUndefined(req.body.photo)) categoryData['photo'] = req.body.photo

            await Category.updateOne({ _id: req?.params?.id }, { $set: categoryData })
            .then(async (result) => {
                return res.status(200).send({ success: true, message: 'category updated' })
            })
            .catch(err => {
                return res.status(500).send({ success: false, error: 'internal server error' })
            })
        } else {
            return res.status(400).send({ success: false, error: 'categoryId required' })
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.deleteCategory = async function (req, res) {
    const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
    if (user._id) {
        if(req?.params?.id) {
            const category = await Category.findOne({ _id: req?.params?.id })
            if (!category) return res.status(400).send({ success: false, error: 'invalid category' })

            var productsCount = await Product.find({ categories: { $in: req?.params?.id } }, { _id: 1 }).count()
            if (productsCount > 0) {
                return res.status(403).send({ success: false, message: 'This category has products, It can not be delete' })
            }

            await Category.deleteOne({ _id: req.params.id })
            .then(async () => {
                return res.status(200).send({ success: true, message: 'category deleted' })
            })
            .catch(err => {
                return res.status(500).send({ success: false, error: 'internal server error' })
            })
        } else {
            return res.status(400).send({ success: false, error: 'categoryId required' })
        }
    } else {
        return res.status(401).send({ success: false, error: 'authentication failed' })
    }
}

exports.getCategories = async function (req, res) {
    var query = {}

    if (req.query.search) query['name'] = new RegExp(".*" + req.query.search.trim().replace(/(\W)/g, "\\$1") + ".*", "i") 

    const totalCategory = await Category.find(query).count()
    const categories = await Category.find(query).skip(req.query.skip).limit(req.query.limit).sort({ createdAt: -1 })

    return res.status(200).send({ success: true, categories, totalCategory })
}
