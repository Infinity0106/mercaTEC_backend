const path = require("path");
module.exports = function(req, res, next) {
  let file = path.resolve(__basedir) + `/uploads/${req.params.id}`;
  res.download(file);
};
