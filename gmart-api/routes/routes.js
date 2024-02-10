"use strict";

var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
var config = require("../config");

router.use(function (req, res, next) {
  var token = req.body.authorization || req.query.authorization || req.headers.authorization; //['x-access-token'];

  if (token) {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        return res.status(401).send({ success: false, message: "Failed to authenticate token." });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: "no token provided.",
    });
  }
});

// User Module
var user = require("./users/users.controller");
router.get("/getUsers", user.getUsers);
router.get("/getUserDetail", user.getUserDetail);
router.put("/editUser/:id?", user.editUser);
router.post("/wishlistProduct", user.wishlistProduct);
router.get("/getWishlistProducts", user.getWishlistProducts);
router.delete("/deleteUser/:id", user.deleteUser);
router.get("/getDashboardData", user.getDashboardData);

// Address Module
var address = require("./address/address.controller");
router.post("/addAddress", address.addAddress);
router.put("/editAddress/:id", address.editAddress);
router.delete("/deleteAddress/:id", address.deleteAddress);
router.get("/getUserAddresses", address.getUserAddresses);

var productController = require("./product/product.controller");
router.post("/addProduct", productController.addProduct);

// Product Module
var product = require("./product/product.controller");
router.post("/addProduct", product.addProduct);
router.put("/editProduct/:id", product.editProduct);
router.delete("/deleteProduct/:id", product.deleteProduct);

// Category Module
var category = require("./category/category.controller");
router.post("/addCategory", category.addCategory);
router.put("/editCategory/:id", category.editCategory);
router.delete("/deleteCategory/:id", category.deleteCategory);

// Banner Module
var banner = require("./banner/banner.controller");
router.post("/addBanner", banner.addBanner);
router.put("/editBanner/:id", banner.editBanner);
router.delete("/deleteBanner/:id", banner.deleteBanner);

// Order Module
var order = require("./order/order.controller");
router.post("/placeOrder", order.placeOrder);
router.post("/createRazorPayOrder", order.createRazorPayOrder);
router.post("/cancelOrder/:id", order.cancelOrder);
router.post("/deliverOrder/:id", order.deliverOrder);
router.get("/getOrders", order.getOrders);

// Setting Module
var setting = require("./setting/setting.controller");
router.post("/updatePrivacy", setting.updatePrivacy);
router.post("/updateTerms", setting.updateTerms);
router.post("/setDeliveryLimit", setting.setDeliveryLimit);
router.post("/setDeliveryCharge", setting.setDeliveryCharge);

var shop = require("./shop/shop.controller");
router.post("/addShop", shop.addShop);
//getShop is in public

var manufacturerController = require("./manufacturers/manufacturer.controller");
router.post("/addManufacturer", manufacturerController.addManufacturer);

var productController = require("./product/product.controller");
router.post("/addProduct", productController.addProduct);

module.exports = router;
