var Shop = require("./shop.model");

//without photos
exports.addShop = async function (req, res) {
  const user = req?.decoded && req?.decoded?.user ? req?.decoded?.user : null;

  if (user._id) {
    let okay = true;
    let shop = new Shop();

    if (req.body.container) shop.container = req.body.container;
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

exports.getShops = async function (req, res) {
  const shops = await Shop.find({});
  return res.status(200).send({ success: true, shops });
};

exports.getShop = async function (req, res) {
  if (req?.params?.id) {
    const shop = Shop.findOne({ _id: req?.params?.id });
    if (!shop) return res.status(400).send({ success: false, message: "invalid shop" });

    return res.status(200).send({ success: true, message: "shop found", data: shop });
  }

  return res.status(401).send({ success: false, error: "authentication failed" });
};
