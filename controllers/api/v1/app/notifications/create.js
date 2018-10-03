const notification_to = require("../../../../../lib/one_signal")
  .notification_to;
const User = require("./../../../../../models").User;
const Notification = require("./../../../../../models").Notification;
const sequelize = require("./../../../../../models").sequelize;

module.exports = async function(req, res, next) {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    let from_user = req.locals.current_user;
    let to_user = await User.findById(req.params.to_id);

    let players = await to_user.get_player_ids();
    let result = await notification_to(req.body.message, players);

    if (!result.data.id) throw new Error(result.data.errors[0]);

    await Notification.create(
      {
        one_signal_id: result.data.id,
        from_user_id: from_user.id,
        to_user_id: to_user.id,
        message: req.body.message
      },
      { transaction }
    );

    res.status(204).send();
    await transaction.commit();
  } catch (e) {
    transaction.rollback();
    errors = e.errors ? e.errors.map(element => element.message) : [e.message];
    res.status(500).send({ errors });
  }
};
