var User = require("./../../../../../models").User;
var Token = require("./../../../../../models").Token;

module.exports = {
  create_recovery_token: async function(req, res, next) {
    try {
      let user = await User.scope({
        method: ["byEmailOrUsername", req.body.user.user_handler]
      }).findOne();
      if (!user) throw new Error("User not found");

      let token = await user.create_recovery_token();

      res.status(204).send(token.serialize());
    } catch (e) {
      errors = e.errors
        ? e.errors.map(element => element.message)
        : [e.message];
      res.status(500).send({ errors });
    }
  },
  update_user_password: async function(req, res, next) {
    try {
      let token = await Token.scope({
        method: ["byValue", req.params.token_value]
      }).findOne();
      if (token === null) {
        throw Error("Token not found");
      }

      let user = await token.getUser();
      await user.update_password(req.body.user);
      await token.destroy();

      res.status(204).send();
    } catch (e) {
      errors = e.errors
        ? e.errors.map(element => element.message)
        : [e.message];
      res.status(500).send({ errors });
    }
  }
};
