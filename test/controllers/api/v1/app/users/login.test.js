const Op = require("sequelize").Op;
const User = require("../../../../../models").User;

module.exports = function(req, res, next) {
  var current_user = null;
  User.scope({
    method: ["byEmailOrUsername", req.body.user.user_handler]
  })
    .findOne()
    .then(user => {
      current_user = user;
      return user.validPassword(req.body.user.password);
    })
    .then(user => user.create_session_token())
    .then(session_token => {
      res.status(200).send(current_user.toJWT(session_token.value));
    })
    .catch(e => {
      errors = e.errors
        ? e.errors.map(element => element.message)
        : [e.message];
      res.status(500).send({ errors });
    });
};
