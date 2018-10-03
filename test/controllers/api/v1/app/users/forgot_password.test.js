const helper = require("../../../../../helpers");
const Models = require("../../../../../../models");
const faker = require("faker");

let username = faker.internet.userName();
let email = faker.internet.email();
let password = faker.internet.password();

describe("POST /api/v1/forgot", () => {
  let params = {
    user: {
      user_handler: null
    }
  };

  beforeEach(async () => {
    try {
      let user = await Models.User.create({
        username: username,
        player_id: faker.random.uuid()
      });
      let member = await Models.Member.create({
        email: email,
        password: password,
        password_confirmation: password
      });
      await user.setMember(member);

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  });

  let request = function(done, callback) {
    chai
      .request(server)
      .post("/api/v1/forgot")
      .set("x-application", "app")
      .send(params)
      .then(res => callback(res))
      .catch(done);
  };

  context("with username", () => {
    beforeEach(() => {
      params.user.user_handler = username;
    });

    it("returns http ok", done => {
      request(done, async res => {
        res.status.should.be.eql(204);
        done();
      });
    });

    it("body should be empty", done => {
      request(done, async res => {
        res.body.should.be.empty;
        done();
      });
    });

    it("token should be created", done => {
      request(done, async res => {
        let tokens = await Models.Token.count();
        tokens.should.be.eql(1);
        done();
      });
    });
  });

  context("with email", () => {
    beforeEach(() => {
      params.user.user_handler = email;
    });

    it("returns http ok", done => {
      request(done, async res => {
        res.status.should.be.eql(204);
        done();
      });
    });

    it("body should be empty", done => {
      request(done, async res => {
        res.body.should.be.empty;
        done();
      });
    });

    it("token should be created", done => {
      request(done, async res => {
        let tokens = await Models.Token.count();
        tokens.should.be.eql(1);
        done();
      });
    });
  });

  context("with not existing user", () => {
    beforeEach(() => {
      params.user.user_handler = "12345678";
    });

    it("return http server error", done => {
      request(done, async res => {
        res.status.should.be.eql(500);
        done();
      });
    });

    it("returns error object", done => {
      request(done, async res => {
        res.body.should.have.own.property("errors");
        done();
      });
    });

    it("error with proper message", done => {
      request(done, async res => {
        expect(res.body.errors[0]).to.have.string("User not found");
        done();
      });
    });

    it("should not create token", done => {
      request(done, async res => {
        let tokens = await Models.Token.count();
        tokens.should.be.eql(0);
        done();
      });
    });
  });
});

describe("POST /api/v1/forgot/{:token_value}", () => {
  let token;
  let user;
  let password = faker.internet.password();
  let password_1 = faker.internet.password();
  let params = {
    user: {
      password: password_1,
      password_confirmation: password_1
    }
  };

  beforeEach(async () => {
    try {
      user = await Models.User.create({
        username: username,
        player_id: faker.random.uuid()
      });
      let member = await Models.Member.create({
        email: email,
        password: password,
        password_confirmation: password
      });
      await user.setMember(member);
      token = await user.create_recovery_token();

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  });

  let request = function(done, token, callback) {
    chai
      .request(server)
      .put(`/api/v1/forgot/${token}`)
      .set("x-application", "app")
      .send(params)
      .then(res => callback(res))
      .catch(done);
  };

  context("with valid information", () => {
    it("should return http no content", done => {
      request(done, token.value, async res => {
        res.status.should.be.eql(204);
        done();
      });
    });
    it("should be empty body", done => {
      request(done, token.value, async res => {
        res.body.should.be.empty;
        done();
      });
    });
    it("should consume the token", done => {
      request(done, token.value, async res => {
        let tokens = await Models.Token.count();
        tokens.should.be.eql(0);
        done();
      });
    });
    it("should change password", done => {
      request(done, token.value, async res => {
        expect(await user.valid_password(password_1)).not.to.be.an("error");
        done();
      });
    });
  });

  context("with invalid information", () => {
    it("should return http server error", done => {
      request(done, "123456", async res => {
        res.status.should.be.eql(500);
        done();
      });
    });

    it("should be errors json", done => {
      request(done, "123456", async res => {
        res.body.should.have.own.property("errors");
        done();
      });
    });

    it("should return proper message", done => {
      request(done, "123456", async res => {
        expect(res.body.errors[0]).to.have.string("Token not found");
        done();
      });
    });

    it("should not consume the token", done => {
      request(done, "123456", async res => {
        let tokens = await Models.Token.count();
        tokens.should.be.eql(1);
        done();
      });
    });
    it("should not change password", done => {
      request(done, "123456", async res => {
        user
          .valid_password(password_1)
          .then(ele => {
            done("Error password was changed");
          })
          .catch(e => done());
      });
    });
  });
});
