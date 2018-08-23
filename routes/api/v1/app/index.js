var express = require("express");
var router = express.Router();
var multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    let time = Math.floor(new Date() / 1000);
    cb(null, `${time}_${file.originalname}`);
  }
});

var logout = require("../../../../controllers/api/v1/app/users/logout");
var notification = require("../../../../controllers/api/v1/app/notifications/create");

router.delete("/logout", logout);
router.post("/notifications/:to_id", notification);

router.post("/files", multer({ storage }).single("user[profile]"), function(
  req,
  res,
  next
) {
  console.log("🛠🛠🛠🛠🛠");
  console.log(req.file);
  console.log("🛠🛠🛠🛠🛠");
  res.status(204).send();
});

module.exports = router;
