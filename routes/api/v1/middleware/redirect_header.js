module.exports = function(req, res, next) {
  switch (req.headers["x-application"]) {
    case "app":
      req.url = "/app" + req.url;
      next();
      break;
    case "dashboard":
      req.url = "/dashboard" + req.url;
      next();
      break;
    default:
      res.status(404).send();
      break;
  }
};
