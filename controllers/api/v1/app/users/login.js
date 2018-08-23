const Op = require("sequelize").Op;
const User = require("../../../../../models").User;
const Phone = require("../../../../../models").Phone;

module.exports = function(req, res, next) {
  var current_user = null;
  var session_token = null;

  User.scope({
    method: ["byEmailOrUsername", req.body.user.user_handler]
  })
    .findOne()
    .then(user => {
      current_user = user;
      return user.validPassword(req.body.user.password);
    })
    .then(user => user.create_session_token())
    .then(token => {
      current_user.player_id = req.body.user.player_id;
      session_token = token;
      return current_user.create_phone(session_token);
    })
    .then(() => {
      res.status(200).send(current_user.toJWT(session_token.value));
    })
    .catch(e => {
      errors = e.errors
        ? e.errors.map(element => element.message)
        : [e.message];
      res.status(500).send({ errors });
    });
};
