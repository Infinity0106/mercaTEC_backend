const jwt = require("jsonwebtoken");

module.exports = {
  encrypt: function(obj) {
    return jwt.sign(obj, process.env.JWT_SECRET_TOKEN);
  },
  decrypt: function(token) {
    return jwt.verify(token, process.env.JWT_SECRET_TOKEN);
  }
};
