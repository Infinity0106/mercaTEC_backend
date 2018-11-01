const Administrator = require("./../../../../../models").Administrator;
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

const create_admin_fields = function(transaction) {
  return {
    fields: [""],
    transaction
  };
};

const create_admin_body = function(body) {
  return {};
};

module.exports = async function(req, res, next) {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    let member = await Member.create(
      create_member_body(req.body.administrator),
      create_member_fields(transaction)
    );
    let admin = await Administrator.create(
      create_admin_body(req.body.user),
      create_admin_fields(transaction)
    );
    await admin.setMember(member, { transaction });
    let token = await admin.create_session_token(transaction);
    if (req.body.player_id) await admin.create_phone(token, transaction);
    admin.Member = member;

    res.status(200).send(admin.toJWT(token.value));
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    errors = e.errors ? e.errors.map(element => element.message) : [e.message];
    res.status(500).send({ errors });
  }
};
