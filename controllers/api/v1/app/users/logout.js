var JWT = require("../../../../../lib/json_web_token");

module.exports = function(req, res, next) {
  var user = req.locals.current_user;

  user
    .delete_session_token(req.locals.token)
    .then(() => {
      res.status(204).send();
    })
    .catch(e => {
      res.status(204).send();
    });
};
