var _ = require("underscore");
var Manufacturer = require("./manufacturer.model");

exports.addManufacturer = async function (req, res) {
  const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null;

  if (user._id) {
    let okay = true;
    let shop = new Manufacturer();
    if (req.body.name) shop.name = req.body.name;
    else okay = false;
    if (req.body.location) shop.location = req.body.location;
    else okay = false;
    if (req.body.latitude) shop.latitude = req.body.latitude;
    else okay = false;
    if (req.body.longitude) shop.longitude = req.body.longitude;
    else okay = false;
    if (req.body.description) shop.description = req.body.description;
    else okay = false;
    if (req.body.keywords) {
      if (req.body.keywords.length < 1) okay = false;
      shop.keywords = req.body.keywords;
    } else okay = false;
    if (req.body.photos) {
      if (req.body.photos.length < 1) okay = false;
      shop.photos = req.body.photos;
    } else okay = false;
    if (req.body.our) shop.our = req.body.our;
    else okay = false;

    if (!okay) return res.status(401).send({ success: false, message: "shop was not added" });

    await shop
      .save()
      .then(async (shopObj) => {
        return res.status(200).send({ success: true, message: "shop added", data: shopObj });
      })
      .catch(async (err) => {
        return res.status(401).send({ success: false, message: "shop was not added" });
      });
  } else {
    return res.status(401).send({ success: false, message: "shop was not added" });
  }
};

//   without token above
exports.editManufacturer = async function (req, res) {
  const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null;
  if (user?._id) {
    if (user.role && user.role === "admin") {
      if (req?.params?.id) {
        const manufacturer = await Manufacturer.findOne({
          _id: req?.params?.id,
        });
        if (!manufacturer)
          return res.status(400).send({ success: false, error: "Invalid manufacturer" });

        var manufacturerData = {};
        if (!_.isUndefined(req.body.name)) manufacturerData["name"] = req.body.name;
        if (!_.isUndefined(req.body.keywords)) manufacturerData["keywords"] = req.body.keywords;
        if (!_.isUndefined(req.body.description))
          manufacturerData["description"] = req.body.description;
        await Manufacturer.updateOne({ _id: req?.params?.id }, { $set: manufacturerData })
          .then(async (result) => {
            return res.status(200).send({ success: true, message: "Manufacturer updated" });
          })
          .catch((err) => {
            return res.status(500).send({ success: false, error: "Internal server error" });
          });
      } else {
        return res.status(400).send({ success: false, error: "Manufacturer ID required" });
      }
    } else {
      return res.status(400).send({ success: false, error: "Only admin can edit Manufacturer" });
    }
  } else {
    return res.status(401).send({ success: false, error: "Authentication failed" });
  }
};

exports.deleteManufacturer = async function (req, res) {
  const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null;
  if (user?._id) {
    if (user.role && user.role === "admin") {
      if (req?.params?.id) {
        const manufacturer = await Manufacturer.findOne({
          _id: req?.params?.id,
        });
        if (!manufacturer)
          return res.status(400).send({ success: false, error: "Invalid manufacturer" });

        await Manufacturer.deleteOne({ _id: req.params.id })
          .then(async () => {
            return res.status(200).send({ success: true, message: "Manufacturer deleted" });
          })
          .catch((err) => {
            return res.status(500).send({ success: false, error: "Internal server error" });
          });
      } else {
        return res.status(400).send({ success: false, error: "Manufacturer ID required" });
      }
    } else {
      return res.status(400).send({ success: false, error: "Only admin can delete Manufacturer" });
    }
  } else {
    return res.status(401).send({ success: false, error: "Authentication failed" });
  }
};

exports.getManufacturers = async function (req, res) {
  var query = {};

  if (req.query.search)
    query["name"] = new RegExp(".*" + req.query.search.trim().replace(/(\W)/g, "\\$1") + ".*", "i");

  const totalManufacturers = await Manufacturer.find(query).countDocuments();
  const manufacturers = await Manufacturer.find(query)
    .skip(parseInt(req.query.skip))
    .limit(parseInt(req.query.limit))
    .sort({ createdAt: -1 });

  return res.status(200).send({ success: true, manufacturers, totalManufacturers });
};

exports.getManufacturerById = async function (req, res) {
  try {
    const manufacturerId = req.params.manufacturerId;
    if (!manufacturerId) {
      return res.status(400).send({ success: false, error: "Manufacturer ID is required" });
    }

    const manufacturer = await Manufacturer.findById(manufacturerId);

    if (!manufacturer) {
      return res.status(404).send({ success: false, error: "Manufacturer not found" });
    }

    return res.status(200).send({ success: true, data: manufacturer });
  } catch (error) {
    return res.status(500).send({ success: false, error: "Internal server error" });
  }
};
