var express = require("express");
var router = express.Router();

let get_image = require("./../../controllers/uploads/index");

router.get("/:id", get_image);

module.exports = router;
