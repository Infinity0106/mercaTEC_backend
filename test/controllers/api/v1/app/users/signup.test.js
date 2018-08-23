const helper = require("../../../../../helpers");
const Models = require("../../../../../../models");

let password = faker.internet.password();
let _params = {
  user: {
    email: faker.internet.email(),
    password: password,
    username: faker.internet.userName(),
    password_confirmation: password
  }
};

describe("POST /api/v1/signup", () => {
  beforeEach(done => {
    Models.User.sync({ force: true })
      .then(() => Models.Token.sync({ force: true }))
      .finally(done);
  });

  describe("with valid information", () => {
    it("it should create a user", done => {
      chai
        .request(server)
        .post("/api/v1/signup")
        .set("x-application", "app")
        .send(_params)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.own.property("token");
          Models.User.count()
            .then(num => {
              num.should.eql(1);
            })
            .finally(done);
        });
    });
  });

  describe("with different passwords", () => {
    var params = JSON.parse(JSON.stringify(_params));
    beforeEach(done => {
      params.user.password_confirmation =
        "1" + params.user.password_confirmation;
      done();
    });

    it("should return error different password", done => {
      chai
        .request(server)
        .post("/api/v1/signup")
        .set("x-application", "app")
        .send(params)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have.deep.own.property("errors", [
            "Password confirmation doesn't match Password"
          ]);
          Models.User.count()
            .then(num => {
              num.should.eql(0);
            })
            .finally(done);
        });
    });
  });

  describe("with email already taken", () => {
    var params = JSON.parse(JSON.stringify(_params));
    beforeEach(done => {
      Models.User.create(params.user).then(user => done());
      params.user.username = "1" + params.user.username;
    });

    it("should return error email not unique", done => {
      chai
        .request(server)
        .post("/api/v1/signup")
        .set("x-application", "app")
        .send(params)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have.deep.own.property("errors", [
            "email must be unique"
          ]);
          Models.User.count()
            .then(num => num.should.eql(1))
            .then(() => done());
        });
    });
  });

  describe("with username already taken", () => {
    var params = JSON.parse(JSON.stringify(_params));
    beforeEach(done => {
      Models.User.create(params.user).then(user => done());
      params.user.email = "1" + params.user.email;
    });

    it("should return error username not unique", done => {
      chai
        .request(server)
        .post("/api/v1/signup")
        .set("x-application", "app")
        .send(params)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have.deep.own.property("errors", [
            "username must be unique"
          ]);
          Models.User.count()
            .then(num => num.should.eql(1))
            .then(() => done());
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
