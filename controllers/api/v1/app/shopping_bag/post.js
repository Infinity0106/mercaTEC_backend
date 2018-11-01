const sequelize = require("./../../../../../models").sequelize;
const ShoppingBag = require("./../../../../../models").ShoppingBag;
const ShoppingBagProduct = require("./../../../../../models")
  .ShoppingBagProduct;
const Product = require("./../../../../../models").Product;

module.exports = async function(req, res, next) {
  let params = req.parameters;
  let transaction;
  try {
    params.permit("product_id");
    transaction = await sequelize.transaction();

    let user = req.locals.current_user;
    let shopping_bag = await ShoppingBag.findOrCreate({
      where: {
        user_id: user.id
      },
      transaction
    });

    let product = await Product.findById(req.body.product_id);

    await ShoppingBagProduct.create(
      {
        shopping_bag_id: shopping_bag[0].id,
        product_id: product.id
      },
      { transaction }
    );

    res.status(204).send();
    await transaction.commit();
  } catch (e) {
    if (transaction) await transaction.rollback();
    errors = e.errors ? e.errors.map(element => element.message) : [e.message];
    res.status(500).send({ errors });
  }
};
