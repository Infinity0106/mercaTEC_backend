var repl = require("repl");
var envName = process.env.NODE_ENV || "development";
var Models = require("./models");
var app = require("./app");
var displayRoutes = require("express-routemap");

var replServer = repl.start({
  prompt: `<APPNAME> (${envName}) > `
});

for (var key in Models) {
  replServer.context[key] = Models[key];
}

replServer.context.app = app;
replServer.context.routes = function() {
  displayRoutes(app);
};
