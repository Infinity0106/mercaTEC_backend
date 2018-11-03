const express = require("express");
const router = express.Router();

let auth_middleware = require("./../../middleware/auth");
let signup = require("./../../../../../controllers/api/v1/app/users/signup.js");
let login = require("./../../../../../controllers/api/v1/app/users/login.js");
let forgot = require("./../../../../../controllers/api/v1/app/users/forgot_password.js");
let logout = require("./../../../../../controllers/api/v1/app/users/logout");

router.use("/", function(req, res, next) {
  if (req.path == "/logout") {
    auth_middleware(req, res, next);
  } else {
    next();
  }
});
router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", logout);
router.post("/forgot", forgot.create_recovery_token);
router.put("/forgot/:token_value", forgot.update_user_password);

module.exports = router;
