const Op = require("sequelize").Op;
const User = require("../../../../../models").User;
const Phone = require("../../../../../models").Phone;

module.exports = async function(req, res, next) {
  try {
    let user = await User.scope({
      method: ["byEmailOrUsername", req.body.user.user_handler]
    }).findOne();
    if (!user) throw new Error("User not found");

    await user.valid_password(req.body.user.password);

    let token = await user.create_session_token();
    user.player_id = req.body.user.player_id;
    if (user.player_id) await user.create_phone(token);

    res.status(200).send(user.toJWT(token.value));
  } catch (e) {
    errors = e.errors ? e.errors.map(element => element.message) : [e.message];
    res.status(500).send({ errors });
  }
};
