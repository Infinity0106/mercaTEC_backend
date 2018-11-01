const sequelize = require("./../../../../../models").sequelize;
const Product = require("./../../../../../models").Product;
const Image = require("./../../../../../models").Image;

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
    await Image.bulkCreate(
      req.files.map(ele => {
        return {
          path: ele.path,
          imaginable_id: product.id,
          imaginable: "Product"
        };
      }),
      { transaction }
    );

    res.status(204).send();
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    errors = e.errors ? e.errors.map(element => element.message) : [e.message];
    res.status(500).send({ errors });
  }
};
