var User = require("./../../../../../models").User;

const create_user_fields = function() {
  return {
    fields: ["username", "email", "password", "password_confirmation"]
  };
};

module.exports = function(req, res, next) {
  var current_user = null;
  var session_token = null;

  User.create(req.body.user, create_user_fields())
    .then(user => {
      current_user = user;
      return user.create_session_token();
    })
    .then(token => {
      session_token = token;
      return current_user.create_phone(token);
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
