const sequelize = require("./../../../../../models").sequelize;
const ShoppingBag = require("./../../../../../models").ShoppingBag;
const Sell = require("./../../../../../models").Sell;
const Product = require("./../../../../../models").Product;
const ShoppingBagProduct = require("./../../../../../models")
  .ShoppingBagProduct;

module.exports = async function(req, res, next) {
  let transaction;
  try {
    req.parameters.permit("id");
    transaction = await sequelize.transaction();

    let shopping_bag = await ShoppingBag.findById(req.params.id);
    let first_product = await shopping_bag.getProducts({
      limit: 1
    });

    if (first_product[0]) {
      await Sell.create({
        total: shopping_bag.total,
        product_id: first_product[0].id,
        user_id: shopping_bag.user_id
      });
    }

    await ShoppingBagProduct.destroy({
      where: {
        shopping_bag_id: req.params.id
      },
      transaction
    });

    res.status(204).send();
    await transaction.commit();
  } catch (e) {
    if (transaction) await transaction.rollback();
    errors = e.errors ? e.errors.map(element => element.message) : [e.message];
    res.status(500).send({ errors });
  }
};
