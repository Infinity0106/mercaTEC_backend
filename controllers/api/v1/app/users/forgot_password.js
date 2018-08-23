var User = require("./../../../../../models").User;
var Token = require("./../../../../../models").Token;
module.exports = {
  create_recovery_token: function(req, res, next) {
    User.scope({
      method: ["byEmailOrUsername", req.body.user.user_handler]
    })
      .findOne()
      .then(user => user.create_recovery_token())
      .then(token => res.status(200).send(token.serialize()))
      .catch(e => {
        errors = e.errors
          ? e.errors.map(element => element.message)
          : [e.message];
        res.status(500).send({ errors });
      });
  },
  update_user_password: function(req, res, next) {
    var current_token = null;
    Token.scope({
      method: ["byValue", req.params.token_value]
    })
      .findOne()
      .then(token => {
        current_token = token;
        return token.getUser();
      })
      .then(user => user.update_password(req.body.user))
      .then(user => current_token.destroy())
      .then(token => res.status(204).send())
      .catch(e => {
        errors = e.errors
          ? e.errors.map(element => element.message)
          : [e.message];
        res.status(500).send({ errors });
      });
  }
};
