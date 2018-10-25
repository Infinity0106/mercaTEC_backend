const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    let time = Math.floor(new Date() / 1000);
    cb(null, `${time}_${file.originalname}`);
  }
});

let logout = require("../../../../controllers/api/v1/app/users/logout");
let notification = require("../../../../controllers/api/v1/app/notifications/create");
let product_post = require("../../../../controllers/api/v1/app/products/post");
let product_index = require("../../../../controllers/api/v1/app/products/index");
let product_show = require("../../../../controllers/api/v1/app/products/show");
let product_update = require("../../../../controllers/api/v1/app/products/update");
let product_delete = require("../../../../controllers/api/v1/app/products/delete");
let product_qr = require("../../../../controllers/api/v1/app/products/qr");
let image_delete = require("../../../../controllers/api/v1/app/images/delete");

router.delete("/logout", logout);
router.post("/notifications/:to_id", notification);

router.post(
  "/products",
  multer({ storage }).array("images[]", 9),
  product_post
);
router.put(
  "/products/:id",
  multer({ storage }).array("images[]", 9),
  product_update
);
router.get("/products", product_index);
router.get("/products/:id", product_show);
router.delete("/products/:id", product_delete);
router.get("/products/:id/qr", product_qr);

router.delete("/images/:id", image_delete);

module.exports = router;
