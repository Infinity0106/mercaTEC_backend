var JWT = require("../../../../lib/json_web_token");
var Token = require("../../../../models").Token;

module.exports = async function(req, res, next) {
  try {
    let user_serialized = JWT.decrypt(req.headers.authorization);
    let token = await Token.findOne({
      where: {
        tokenizable_id: user_serialized.id,
        value: user_serialized.token
      }
    });
    let current_user = await token.getUser();

    req.locals = Object.assign({}, { current_user, token });

    next();
  } catch (e) {
    let status = req.path == "/logout" ? 204 : 401;
    res.status(status).send();
  }
};
