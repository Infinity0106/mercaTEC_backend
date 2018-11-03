const helper = require("./../../helpers");
const fs = require("fs");
const path = require("path");

describe("GET /uploads/test_img.jpg", () => {
  before(() => {
    let dir = path.resolve(__dirname + "../../../../uploads/");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.copyFileSync(
      path.resolve(__dirname + "./../../test_img.jpg"),
      path.resolve(dir + "/test_img.jpg")
    );
  });

  context("success creation", () => {
    let request = function(done, callback) {
      chai
        .request(server)
        .get("/uploads/test_img.jpg")
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
        expect(res.body).to.be.instanceof(Buffer);
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

// const path = require("path");
// module.exports = function(req, res, next) {
//   let file = path.resolve(__basedir) + `/uploads/${req.params.id}`;
//   res.download(file);
// };
