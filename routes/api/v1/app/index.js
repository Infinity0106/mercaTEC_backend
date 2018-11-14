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

let notification = require("../../../../controllers/api/v1/app/notifications/create");
let product_post = require("../../../../controllers/api/v1/app/products/post");
let product_index = require("../../../../controllers/api/v1/app/products/index");
let product_show = require("../../../../controllers/api/v1/app/products/show");
let product_update = require("../../../../controllers/api/v1/app/products/update");
let product_delete = require("../../../../controllers/api/v1/app/products/delete");
let product_qr = require("../../../../controllers/api/v1/app/products/qr");
let image_delete = require("../../../../controllers/api/v1/app/images/delete");
let shopping_bag_create = require("./../../../../controllers/api/v1/app/shopping_bag/post");
let shopping_bag_delete = require("./../../../../controllers/api/v1/app/shopping_bag/delete");
let shopping_bag_index = require("./../../../../controllers/api/v1/app/shopping_bag/index");
let shopping_bag_product_delete = require("./../../../../controllers/api/v1/app/shopping_bag/products/delete");
let sell_index = require("./../../../../controllers/api/v1/app/sells/index");

//SEND_GENERAL_NOTIFICATIONS
router.post("/notifications/:to_id", notification);

//PRODUCTS
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

//IMAGES
router.delete("/images/:id", image_delete);

//SHOPPING_BAG
router.get("/shopping_bags", shopping_bag_index);
router.delete("/shopping_bags/:id", shopping_bag_delete);
router.post("/shopping_bags/:id", shopping_bag_create);
router.delete(
  "/shopping_bags/:id/products/:shopping_id",
  shopping_bag_product_delete
);

//SELL
router.get("/sells", sell_index);

module.exports = router;
