const qrcode = require("qrcode");
const path = require("path");
const fs = require("fs");

module.exports = async function(req, res, next) {
  qrcode.toFile(
    path.resolve(__basedir + "/uploads/tmp_qr.png"),
    req.params.id,
    { width: 1000 },
    function(err) {
      let file = path.resolve(__basedir) + `/uploads/tmp_qr.png`;
      res.download(file);
    }
  );
};
