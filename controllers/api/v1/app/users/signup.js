const User = require("./../../../../../models").User;
const Member = require("./../../../../../models").Member;
const sequelize = require("./../../../../../models").sequelize;

const create_member_fields = function(transaction) {
  return {
    fields: ["email", "password", "password_confirmation"],
    transaction
  };
};

const create_member_body = function(body) {
  return {
    email: body.email,
    password: body.password,
    password_confirmation: body.password_confirmation
  };
};

const create_user_fields = function(transaction) {
  return {
    fields: ["username"],
    transaction
  };
};

const create_user_body = function(body) {
  return {
    username: body.username,
    player_id: body.player_id
  };
};

module.exports = async function(req, res, next) {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    let member = await Member.create(
      create_member_body(req.body.user),
      create_member_fields(transaction)
    );
    let user = await User.create(
      create_user_body(req.body.user),
      create_user_fields(transaction)
    );
    await user.setMember(member, { transaction });
    let token = await user.create_session_token(transaction);
    if (req.body.player_id) await user.create_phone(token, transaction);
    user.Member = member;

    res.status(200).send(user.toJWT(token.value));
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    errors = e.errors ? e.errors.map(element => element.message) : [e.message];
    res.status(500).send({ errors });
  }
};
