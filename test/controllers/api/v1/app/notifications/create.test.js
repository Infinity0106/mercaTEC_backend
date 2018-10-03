const helper = require("../../../../../helpers");
const Models = require("../../../../../../models");
const nock = require("nock");
const faker = require("faker");

let params = {
  message: {
    en: "test 1",
    es: "test 1"
  }
};
describe("POST /api/v1/notifications/{to_user_id}", () => {
  context("create a specific notification", () => {
    let auth_token;
    let user;
    let player_id = faker.random.uuid();
    beforeEach(async () => {
      try {
        user = await Models.User.create({
          username: "username",
          player_id: player_id
        });
        let member = await Models.Member.create({
          email: faker.internet.email(),
          password: "password",
          password_confirmation: "password"
        });
        await user.setMember(member);
        let token = await user.create_session_token();
        await user.create_phone(token);

        let res_token = await helper.create_user_session_jwt();
        auth_token = res_token.token;

        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    });

    let request = function(done, callback) {
      //set listener for third party request
      nock("https://onesignal.com", {
        reqheaders: {
          "content-type": "application/json; charset=utf-8",
          authorization: `Basic ${process.env.ONE_SIGNAL_APP_KEY}`
        }
      })
        .log(console.log)
        .post("/api/v1/notifications", {
          contents: params.message,
          include_player_ids: [player_id],
          app_id: process.env.ONE_SIGNAL_APP_ID
        })
        .once()
        .reply(200, {
          id: "458dcec4-cf53-11e3-add2-000c2940e62c",
          recipients: 3
        });
      //create the request
      chai
        .request(server)
        .post(`/api/v1/notifications/${user.id}`)
        .set("x-application", "app")
        .set("Authorization", auth_token)
        .send(params)
        .then(res => {
          callback(res);
        })
        .catch(done);
    };

    it("should return no content", done => {
      request(done, async res => {
        res.status.should.be.eql(204);
        done();
      });
    });

    it("should return empty json", done => {
      request(done, async res => {
        res.body.should.be.empty;
        done();
      });
    });

    it("should delete the token", done => {
      request(done, async res => {
        let notifications = await Models.Notification.count();
        notifications.should.be.eql(1);
        done();
      });
    });
  });
});
