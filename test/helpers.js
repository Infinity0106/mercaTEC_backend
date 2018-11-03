const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const server = require("../bin/www");
const should = chai.should();
const expect = chai.expect;
const Models = require("../models");
chai.use(chaiHttp);

global.faker = faker;
global.chai = chai;
global.server = server;
global.should = should;
global.expect = expect;

module.exports = {
  truncate_db: async function() {
    return await Promise.all(
      Object.keys(Models).map(key => {
        if (["sequelize", "Sequelize"].includes(key)) return null;
        return Models[key].destroy({ where: {}, force: true });
      })
    );
  },
  sync_db: async function() {
    return await Promise.all(
      [
        //ORDER of creation with foreign keys dependency so it does not break
        "User",
        "Administrator",
        "Member",
        "Token",
        "Phone",
        "Notification",
        "ShoppingBag",
        "ShoppingBagProduct",
        "Product",
        "Image",
        "Goal"
      ].map(key => {
        return Models[key].sync({ force: true }).catch(console.error);
      })
    );
  },
  create_user_session_jwt: async function() {
    try {
      let password = faker.internet.password();
      let member = await Models.Member.create({
        email: faker.internet.email(),
        password: password,
        password_confirmation: password
      });
      let user = await Models.User.create({
        username: faker.internet.userName(),
        player_id: faker.random.uuid()
      });
      await user.setMember(member);
      let token = await user.create_session_token();
      user.Member = member;

      return user.toJWT(token.value);
    } catch (e) {
      return Promise.reject(e);
    }
  }
};
