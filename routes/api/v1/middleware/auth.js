var JWT = require("../../../../lib/json_web_token");
var Token = require("../../../../models").Token;

module.exports = function(req, res, next) {
  var user_serialized = JWT.decrypt(req.headers.authorization);
  Token.findOne({
    where: {
      memberable_id: user_serialized.id,
      value: user_serialized.token
    }
  })
    .then(token => {
      req.locals = Object.assign({}, { token });
      return token.getUser();
    })
    .then(current_user => {
      req.locals = Object.assign(req.locals, { current_user });
      next();
    })
    .catch(_ => res.status(401).send());
};
