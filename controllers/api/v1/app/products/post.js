const sequelize = require("./../../../../../models").sequelize;
const Product = require("./../../../../../models").Product;
const Image = require("./../../../../../models").Image;
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "djadcipba",
  api_key: "143273815859974",
  api_secret: "Mdn10ffBtZBZqRBiQCgdM5ZhCJU"
});

// const config = {
//   bucketName: "mercatec",
//   region: "us-east-1",
//   accessKeyId: "AKIAJ5HITGR7OJAJMY4Q",
//   secretAccessKey: "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"
// };

module.exports = async function(req, res, next) {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    let product = await Product.create(
      { ...req.body, user_id: req.locals.current_user.id },
      {
        fields: ["name", "description", "price", "user_id"],
        transaction
      }
    );

    let tmp = req.files.map(ele => {
      return new Promise(function(resolve, reject) {
        cloudinary.v2.uploader.upload(ele.path, (err, result) => {
          if (err) reject(err);
          return Image.create(
            {
              path: result.url,
              imaginable_id: product.id,
              imaginable: "Product"
            },
            { transaction }
          )
            .then(resolve)
            .catch(reject);
        });
      });
    });

    await Promise.all(tmp);

    res.status(204).send();
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    errors = e.errors ? e.errors.map(element => element.message) : [e.message];
    res.status(500).send({ errors });
  }
};
