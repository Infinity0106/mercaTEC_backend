var express = require("express");
var router = express.Router();

var auth_middleware = require("./middleware/auth");
var redirect_header_middleware = require("./middleware/redirect_header");

var unauthorized_app_routes = require("./app/unauthorized");
var unauthorized_dashboard_routes = require("./dashboard/unauthorized");
var app_routes = require("./app");
var dashboard_routes = require("./dashboard");

//routes that does not need authorization header

router.use("/", redirect_header_middleware);

router.use("/app", unauthorized_app_routes);
router.use("/app", auth_middleware);
router.use("/app", app_routes);

router.use("/dashboard", unauthorized_dashboard_routes);
router.use("/dashboard", auth_middleware);
router.use("/dashboard", dashboard_routes);

module.exports = router;
