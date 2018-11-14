const helper = require("../../../../../helpers");
const Models = require("../../../../../../models");
const faker = require("faker");

let password = faker.internet.password();
let _params = {
  user: {
    email: faker.internet.email(),
    password: password,
    username: faker.internet.userName(),
    player_id: faker.random.uuid(),
    password_confirmation: password
  }
};

describe("POST /api/v1/signup", () => {
  context("success creation", () => {
    let request = function(done, callback) {
      chai
        .request(server)
        .post("/api/v1/signup")
        .set("x-application", "app")
        .send(_params)
        .then(async res => {
          callback(res);
        })
        .catch(done);
    };

    it("return http ok", done => {
      request(done, res => {
        res.status.should.be.eql(200);
        done();
      });
    });

    it("correct json data", done => {
      request(done, res => {
        res.body.should.have.own.property("token");
        done();
      });
    });

    // it("creates one member", done => {
    //   request(done, async res => {
    //     let members = await Models.Member.count();
    //     members.should.be.eql(1);
    //     done();
    //   });
    // });

    // it("creates one user", done => {
    //   request(done, async res => {
    //     let users = await Models.User.count();
    //     users.should.be.eql(1);
    //     done();
    //   });
    // });

    it("create a phone", done => {
      request(done, async res => {
        let users = await Models.Phone.count();
        users.should.be.eql(0);
        done();
      });
    });
  });

  context("success creation without player_id", () => {
    let params;
    before(() => {
      params = JSON.parse(JSON.stringify(_params));
      delete params.user.player_id;
    });
    let request = function(done, callback) {
      chai
        .request(server)
        .post("/api/v1/signup")
        .set("x-application", "app")
        .send(params)
        .then(async res => {
          callback(res);
        })
        .catch(done);
    };

    it("return http ok", done => {
      request(done, res => {
        res.status.should.be.eql(200);
        done();
      });
    });

    it("correct json data", done => {
      request(done, res => {
        res.body.should.have.own.property("token");
        done();
      });
    });

    // it("creates one member", done => {
    //   request(done, async res => {
    //     let members = await Models.Member.count();
    //     members.should.be.eql(1);
    //     done();
    //   });
    // });

    // it("creates one user", done => {
    //   request(done, async res => {
    //     let users = await Models.User.count();
    //     users.should.be.eql(1);
    //     done();
    //   });
    // });

    it("not create a phone", done => {
      request(done, async res => {
        let users = await Models.Phone.count();
        users.should.be.eql(0);
        done();
      });
    });
  });

  context("different password", () => {
    let params;
    before(() => {
      params = JSON.parse(JSON.stringify(_params));
      params.user.password = "1234567890";
    });
    let request = function(done, callback) {
      chai
        .request(server)
        .post("/api/v1/signup")
        .set("x-application", "app")
        .send(params)
        .then(async res => {
          callback(res);
        })
        .catch(done);
    };

    it("return http server error", done => {
      request(done, res => {
        res.status.should.be.eql(500);
        done();
      });
    });

    it("with error key", done => {
      request(done, res => {
        res.body.should.have.own.property("errors");
        done();
      });
    });

    it("proper message", done => {
      request(done, res => {
        expect(res.body.errors[0]).to.have.string(
          "Password confirmation doesn't match Password"
        );
        done();
      });
    });

    it("doesn't create a user", done => {
      request(done, async res => {
        let users = await Models.User.count();
        users.should.be.eql(0);
        done();
      });
    });

    it("doesn't create a member", done => {
      request(done, async res => {
        let members = await Models.Member.count();
        members.should.be.eql(0);
        done();
      });
    });
  });

  context("email already taken", () => {
    let params;
    beforeEach(async () => {
      params = JSON.parse(JSON.stringify(_params));
      try {
        let user = await Models.User.create({
          username: params.user.username,
          player_id: params.user.player_id
        });
        let member = await Models.Member.create({
          email: params.user.email,
          password: params.user.password,
          password_confirmation: params.user.password_confirmation
        });
        await user.setMember(member);
        params.user.username += "1";

        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    });
    let request = function(done, callback) {
      chai
        .request(server)
        .post("/api/v1/signup")
        .set("x-application", "app")
        .send(params)
        .then(async res => {
          callback(res);
        })
        .catch(done);
    };

    it("return http server error", done => {
      request(done, res => {
        res.status.should.be.eql(500);
        done();
      });
    });

    it("with error key", done => {
      request(done, res => {
        res.body.should.have.own.property("errors");
        done();
      });
    });

    it("proper message", done => {
      request(done, res => {
        expect(res.body.errors[0]).to.have.string("email must be unique");
        done();
      });
    });

    it("doesn't create a user", done => {
      request(done, async res => {
        let users = await Models.User.count();
        users.should.be.eql(1);
        done();
      });
    });

    it("doesn't create a member", done => {
      request(done, async res => {
        let members = await Models.Member.count();
        members.should.be.eql(1);
        done();
      });
    });
  });

  context("username already taken", () => {
    let params;
    beforeEach(async () => {
      params = JSON.parse(JSON.stringify(_params));
      try {
        let user = await Models.User.create({
          username: params.user.username,
          player_id: params.user.player_id
        });
        let member = await Models.Member.create({
          email: params.user.email,
          password: params.user.password,
          password_confirmation: params.user.password_confirmation
        });
        await user.setMember(member);
        params.user.email = "1" + params.user.email;

        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    });
    let request = function(done, callback) {
      chai
        .request(server)
        .post("/api/v1/signup")
        .set("x-application", "app")
        .send(params)
        .then(async res => {
          callback(res);
        })
        .catch(done);
    };

    it("return http server error", done => {
      request(done, res => {
        res.status.should.be.eql(500);
        done();
      });
    });

    it("with error key", done => {
      request(done, res => {
        res.body.should.have.own.property("errors");
        done();
      });
    });

    it("proper message", done => {
      request(done, res => {
        expect(res.body.errors[0]).to.have.string("username must be unique");
        done();
      });
    });

    it("doesn't create a user", done => {
      request(done, async res => {
        let users = await Models.User.count();
        users.should.be.eql(1);
        done();
      });
    });

    it("doesn't create a member", done => {
      request(done, async res => {
        let members = await Models.Member.count();
        members.should.be.eql(1);
        done();
      });
    });
  });

  context("invalid formats", () => {
    let params;
    beforeEach(async () => {
      params = JSON.parse(JSON.stringify(_params));
      params.user.email += "1";
    });
    let request = function(done, callback) {
      chai
        .request(server)
        .post("/api/v1/signup")
        .set("x-application", "app")
        .send(params)
        .then(async res => {
          callback(res);
        })
        .catch(done);
    };

    it("return http server error", done => {
      request(done, res => {
        res.status.should.be.eql(500);
        done();
      });
    });

    it("with error key", done => {
      request(done, res => {
        res.body.should.have.own.property("errors");
        done();
      });
    });

    it("with proper error description", done => {
      request(done, res => {
        expect(res.body.errors[0]).to.have.string("Incorrect email format");
        done();
      });
    });
  });
});

// what to validate
/** POST
 * status code
 * response body
 * creation
 */
/** GET
 * status code
 * response body
 */
/** PUT
 * status code
 * response body
 * record updated
 */
/** DELETE
 * status code
 * response body
 * record not existing
 */
// valid
/**
 * post create
 */

//invalid
/**
 * different password and password_confirmation
 * same email
 * same username
 */
