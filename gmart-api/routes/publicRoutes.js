"use strict";

var express = require("express");
var router = express.Router();

// User Module
var user = require("./users/users.controller");
router.post("/addUser", user.addUser);
router.post("/authUser", user.authUser);
router.get("/getTempUserId", user.getTempUserId);

// Product Module
// var product = require("./product/product.controller");
// router.get("/getProducts", product.getProducts);
// router.get("/getProductDetails/:productId", product.getProductDetails);

// Category Module
var category = require("./category/category.controller");
router.get("/getCategories", category.getCategories);

// Banner Module
var banner = require("./banner/banner.controller");
router.get("/getBanners", banner.getBanners);

// Cart Module
var cart = require("./cart/cart.controller");
router.put("/updateCart/:userId", cart.updateCart);
router.get("/getCart", cart.getCart);

// Setting Module
var setting = require("./setting/setting.controller");
router.get("/getPrivacy", setting.getPrivacy);
router.get("/getTerms", setting.getTerms);
router.get("/getDeliveryLimit", setting.getDeliveryLimit);
router.get("/getDeliveryCharge", setting.getDeliveryCharge);

var manufacturerController = require("./manufacturers/manufacturer.controller");

// Add the routes for manufacturer module
router.get("/getManufacturers", manufacturerController.getManufacturers);
router.get("/getManufacturer/:manufacturerId", manufacturerController.getManufacturerById);
router.put("/editManufacturer/:id", manufacturerController.editManufacturer);
router.delete("/deleteManufacturer/:id", manufacturerController.deleteManufacturer);

// ... existing routes and module.exports
// ... existing imports and routes

var productController = require("./product/product.controller");

// Add the routes for product module
router.get("/getProducts", productController.getProducts);
router.get("/getProductDetails/:productId", productController.getProductDetails);
router.post("/addProduct", productController.addProduct);
router.put("/editProduct/:id", productController.editProduct);
router.delete("/deleteProduct/:id", productController.deleteProduct);

// ... existing routes and module.exports

var shop = require("./shop/shop.controller");
router.get("/getShops", shop.getShops);
router.get("/getShop/:id", shop.getShop);

var keywords = require("./keywords/keyword.controller");
router.get("/getKeywords", keywords.getKeywords);

module.exports = router;
