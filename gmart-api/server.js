//==================================--BASE SETUP--============================
//LOAD PACKAGES-------------------------------
var express = require("express"); //EXPRESS Package
var cors = require("cors");
var app = express(); //define our app using express
var bodyParser = require("body-parser"); // get body-parser
var morgan = require("morgan"); //use to see requests
var mongoose = require("mongoose"); //for working with mongoDB
var config = require("./config"); //get config file

var userFn = require(__dirname + "/routes/users/users.controller.js");

app.use(morgan("dev")); //HTTP logger
app.use(cors());
//==================================--APP--====================================
// APP CONFIGURATION------------------------------------------
// use body parser to grab information from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure app to handle CORS requests
app.use(function (req, res, next) {
  next();
});

//==================================--DB--====================================
let mongoUrl =
  "mongodb+srv://LPrpepp:ku5GnZb8jZSMx5xn@cluster0.5bblnsw.mongodb.net/?retryWrites=true&w=majority";
// if (config.dbusername) mongoUrl += (config.dbusername + ':')
// if (config.dbpassword) mongoUrl += (encodeURIComponent(config.dbpassword) + '@')
// if (config.dburl) mongoUrl += (config.dburl)
// if (config.dbname) mongoUrl += ('/' + config.dbname)
mongoose.connect(mongoUrl, { useNewUrlParser: true });

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function (callback) {
  console.log("MONGO: successfully connected to db");
  userFn.createAdmin();
});

// set static files location used for requests that frontend will make
app.use(express.static(__dirname + "/public"));

//PUBLIC APIs
app.use("/public", require("./routes/publicRoutes"));

//=========================--ROUTES/API--====================================
//API ROUTES
app.use("/api", require("./routes/routes"));

//=========================--START THE SERVER--=========================

app.listen(config.port);
console.log("Magic happens on port - " + config.port);
module.exports = app;
