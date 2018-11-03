const helper = require("../../../../../helpers");
const Models = require("../../../../../../models");

describe("DELETE /api/v1/logout", () => {
  context("token exist", () => {
    let auth_token;
    beforeEach(done => {
      helper
        .create_user_session_jwt()
        .then(token => {
          auth_token = token.token;
          done();
        })
        .catch(done);
    });

    let request = function(done, callback) {
      chai
        .request(server)
        .del("/api/v1/logout")
        .set("x-application", "app")
        .set("Authorization", auth_token)
        .send()
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
        let tokens = await Models.Token.count();
        tokens.should.be.eql(0);
        done();
      });
    });
  });

  context("token doesn't exist", () => {
    let request = function(done, callback) {
      chai
        .request(server)
        .del("/api/v1/logout")
        .set("x-application", "app")
        .set("Authorization", "auth_token")
        .send()
        .then(res => {
          callback(res);
        })
        .catch(done);
    };

    it("returns unauthorized", done => {
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

    it("should not exist a token", done => {
      request(done, async res => {
        let tokens = await Models.Token.count();
        tokens.should.be.eql(0);
        done();
      });
    });
  });
});
