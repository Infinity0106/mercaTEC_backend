const notification_to = require("../../../../../lib/one_signal")
  .notification_to;
const User = require("./../../../../../models").User;
const Notification = require("./../../../../../models").Notification;

module.exports = function(req, res, next) {
  var from_user = req.locals.current_user;
  var to_user = null;

  User.findById(req.params.to_id)
    .then(user => {
      to_user = user;
    })
    .then(() => to_user.get_player_ids())
    .then(players => notification_to(req.body.message, players))
    .then(result => {
      return Notification.create({
        one_signal_id: result.data.id,
        from_user_id: from_user.id,
        to_user_id: to_user.id,
        message: req.body.message
      });
    })
    .then(notification => res.status(204).send())
    .catch(e => {
      errors = e.errors
        ? e.errors.map(element => element.message)
        : [e.message];
      res.status(500).send({ errors });
    });
};
