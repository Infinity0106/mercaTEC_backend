var express = require("express");
var router = express.Router();

var login = require("./../../../../../controllers/api/v1/dashboard/administrators/signup.js");

router.post("/signup", login);

module.exports = router;
