const helper = require("../../../../../helpers");
const Models = require("../../../../../../models");
const faker = require("faker");
const JWT = require("./../../../../../../lib/json_web_token");

let password = faker.internet.password();
let phone = faker.random.uuid();
let email = faker.internet.email();
let username = faker.internet.userName();

let _params = {
  user: {
    user_handler: null,
    player_id: phone,
    password: password
  }
};

describe("POST /api/v1/login", () => {
  beforeEach(async () => {
    try {
      let user = await Models.User.create({
        username: username,
        player_id: phone
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

  context("login with username", () => {
    let params;
    before(() => {
      params = JSON.parse(JSON.stringify(_params));
      params.user.user_handler = username;
    });
    let request = function(done, callback) {
      chai
        .request(server)
        .post("/api/v1/login")
        .set("x-application", "app")
        .send(params)
        .then(res => {
          callback(res);
        })
        .catch(done);
    };

    it("returns http ok", done => {
      request(done, async res => {
        res.status.should.be.eql(200);
        done();
      });
    });

    it("should return token", done => {
      request(done, async res => {
        res.body.should.have.own.property("token");
        done();
      });
    });

    it("should return token proper properties", done => {
      request(done, async res => {
        let resObj = JWT.decrypt(res.body.token);
        resObj.should.contain.keys("id", "username", "token", "email");
        done();
      });
    });

    it("should create token", done => {
      request(done, async res => {
        let tokens = await Models.Token.count();
        tokens.should.be.eql(1);
        done();
      });
    });

    it("should create phone", done => {
      request(done, async res => {
        let phones = await Models.Phone.count();
        phones.should.be.eql(1);
        done();
      });
    });
  });

  context("login with email", () => {
    let params;
    before(() => {
      params = JSON.parse(JSON.stringify(_params));
      params.user.user_handler = email;
    });
    let request = function(done, callback) {
      chai
        .request(server)
        .post("/api/v1/login")
        .set("x-application", "app")
        .send(params)
        .then(res => {
          callback(res);
        })
        .catch(done);
    };

    it("returns http ok", done => {
      request(done, async res => {
        res.status.should.be.eql(200);
        done();
      });
    });

    it("should return token", done => {
      request(done, async res => {
        res.body.should.have.own.property("token");
        done();
      });
    });

    it("should return token proper properties", done => {
      request(done, async res => {
        let resObj = JWT.decrypt(res.body.token);
        resObj.should.contain.keys("id", "username", "token", "email");
        done();
      });
    });

    it("should create token", done => {
      request(done, async res => {
        let tokens = await Models.Token.count();
        tokens.should.be.eql(1);
        done();
      });
    });

    it("should create phone", done => {
      request(done, async res => {
        let phones = await Models.Phone.count();
        phones.should.be.eql(1);
        done();
      });
    });
  });

  context("without player_id", () => {
    let params;
    before(() => {
      params = JSON.parse(JSON.stringify(_params));
      params.user.user_handler = email;
      delete params.user.player_id;
    });
    let request = function(done, callback) {
      chai
        .request(server)
        .post("/api/v1/login")
        .set("x-application", "app")
        .send(params)
        .then(res => {
          callback(res);
        })
        .catch(done);
    };

    it("returns http ok", done => {
      request(done, async res => {
        res.status.should.be.eql(200);
        done();
      });
    });

    it("should return token", done => {
      request(done, async res => {
        res.body.should.have.own.property("token");
        done();
      });
    });

    it("should return token proper properties", done => {
      request(done, async res => {
        let resObj = JWT.decrypt(res.body.token);
        resObj.should.contain.keys("id", "username", "token", "email");
        done();
      });
    });

    it("should create token", done => {
      request(done, async res => {
        let tokens = await Models.Token.count();
        tokens.should.be.eql(1);
        done();
      });
    });

    it("should not create phone", done => {
      request(done, async res => {
        let phones = await Models.Phone.count();
        phones.should.be.eql(0);
        done();
      });
    });
  });

  context("user doesn't exist", () => {
    let params;
    before(() => {
      params = JSON.parse(JSON.stringify(_params));
      params.user.user_handler = "1234567890";
    });
    let request = function(done, callback) {
      chai
        .request(server)
        .post("/api/v1/login")
        .set("x-application", "app")
        .send(params)
        .then(res => {
          callback(res);
        })
        .catch(done);
    };

    it("should return server error", done => {
      request(done, async res => {
        res.status.should.be.eql(500);
        done();
      });
    });

    it("should return errors", done => {
      request(done, async res => {
        res.body.should.have.own.property("errors");
        done();
      });
    });

    it("should proper error", done => {
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

  context("incorrect password", () => {
    let params;
    before(() => {
      params = JSON.parse(JSON.stringify(_params));
      params.user.user_handler = email;
      params.user.password = "1234567890";
    });

    let request = function(done, callback) {
      chai
        .request(server)
        .post("/api/v1/login")
        .set("x-application", "app")
        .send(params)
        .then(res => {
          callback(res);
        })
        .catch(done);
    };

    it("return http server error", done => {
      request(done, async res => {
        res.status.should.be.eql(500);
        done();
      });
    });

    it("returns body error", done => {
      request(done, async res => {
        res.body.should.have.own.property("errors");
        done();
      });
    });
    it("returns proper error message", done => {
      request(done, async res => {
        expect(res.body.errors[0]).to.have.string("Password incorrect");
        done();
      });
    });
    it("doesn't create token", done => {
      request(done, async res => {
        let tokens = await Models.Token.count();
        tokens.should.be.eql(0);
        done();
      });
    });
  });
});
