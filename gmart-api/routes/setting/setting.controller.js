var Setting = require('./setting.model')

exports.updatePrivacy = async function (req, res) {
  const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
  if (user._id) {
    if (req.body.value) {
      await Setting.updateOne({ type: 'privacy_policy' }, { $set: { value: req.body.value } }, { upsert: true })
        .then(() => {
          return res.status(200).send({ success: true, message: 'privacy updated' })
        })
        .catch(err => {
          return res.status(500).send({ success: false, error: 'internal server error' })
        })
    } else return res.status(400).send({ status: false, error: 'invalid details' })
  } else return res.status(401).send({ status: false, error: 'authentication failed' })
}

exports.getPrivacy = async function (req, res) {
  try {
    const result = await Setting.findOne({ type: 'privacy_policy' })
    return res.status(200).send({ success: true, privacy: result });
  } catch (err) {
    return res.status(500).send({ success: false, error: err });
  }
}

exports.updateTerms = async function (req, res) {
  const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
  if (user._id) {
    if (req.body.value) {
      await Setting.updateOne({ type: 'terms' }, { $set: { value: req.body.value } }, { upsert: true })
      .then(() => {
        return res.status(200).send({ success: true, message: 'terms of use updated' })
      })
      .catch(err => {
        return res.status(500).send({ success: false, error: 'internal server error' })
      })
    } else return res.status(400).send({ status: false, error: 'invalid details' })
  } else return res.status(401).send({ status: false, error: 'authentication failed' })
}

exports.getTerms = async function (req, res) {
  try {
    const result = await Setting.findOne({ type: 'terms' })
    return res.status(200).send({ success: true, terms: result });
  } catch (err) {
    return res.status(500).send({ success: false, error: err });
  }
}

exports.setDeliveryLimit = async function (req, res) {
  const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
  if (user._id) {
    if (req.body.value) {
      await Setting.updateOne({ type: 'free_order_delivery_limit' }, { $set: { value: req.body.value } }, { upsert: true })
      .then(() => {
        return res.status(200).send({ success: true, message: 'free order delivery limit updated' })
      })
      .catch(err => {
        return res.status(500).send({ success: false, error: 'internal server error' })
      })
    } else return res.status(400).send({ status: false, error: 'invalid details' })
  } else return res.status(401).send({ status: false, error: 'authentication failed' })
}

exports.getDeliveryLimit = async function (req, res) {
  try {
    const result = await Setting.findOne({ type: 'free_order_delivery_limit' })
    return res.status(200).send({ success: true, deliveryLimit: result });
  } catch (err) {
    return res.status(500).send({ success: false, error: err });
  }
}

exports.setDeliveryCharge = async function (req, res) {
  const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null
  if (user._id) {
    if (req.body.value) {
      await Setting.updateOne({ type: 'delivery_charge' }, { $set: { value: req.body.value } }, { upsert: true })
      .then(() => {
        return res.status(200).send({ success: true, message: 'delivery charge updated' })
      })
      .catch(err => {
        return res.status(500).send({ success: false, error: 'internal server error' })
      })
    } else return res.status(400).send({ status: false, error: 'invalid details' })
  } else return res.status(401).send({ status: false, error: 'authentication failed' })
}

exports.getDeliveryCharge = async function (req, res) {
  try {
    const result = await Setting.findOne({ type: 'delivery_charge' })
    return res.status(200).send({ success: true, deliveryCharge: result });
  } catch (err) {
    return res.status(500).send({ success: false, error: err });
  }
}