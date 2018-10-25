const express = require("express");
const router = express.Router();

let signup = require("./../../../../../controllers/api/v1/app/users/signup.js");
let login = require("./../../../../../controllers/api/v1/app/users/login.js");
let forgot = require("./../../../../../controllers/api/v1/app/users/forgot_password.js");

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot", forgot.create_recovery_token);
router.put("/forgot/:token_value", forgot.update_user_password);

module.exports = router;
