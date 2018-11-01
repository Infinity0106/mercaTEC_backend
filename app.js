var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
// var session = require("client-sessions");
var RateLimit = require("express-rate-limit");
var params = require("strong-params");

//load env variables
require("dotenv").load();
global.__basedir = __dirname;

var indexRouterV1 = require("./routes/api/v1/index");
var shared_routes = require("./routes/shared_routes/index");

var app = express();
var limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 100 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});

app.enable("trust proxy");

app.use(cors());
app.use(limiter);
app.use(params.expressMiddleware());
// app.use(
//   session({
//     cookieName: "session",
//     secret: "QkhW!pfiLAP5;Ra(?6l/.[dedVM5bDd_Et#&+Z[rEUkXGd*fy/=q-ip[MMw:N+,",
//     duration: 30 * 60 * 1000,
//     activeDuration: 5 * 60 * 1000,
//     httpOnly: true,
//     secure: true,
//     ephemeral: true
//   })
// );

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

if (process.env.NODE_ENV != "test") {
  app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", shared_routes);
app.use("/api/v1", indexRouterV1);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
