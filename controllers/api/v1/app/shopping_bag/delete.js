const sequelize = require("./../../../../../models").sequelize;
const ShoppingBag = require("./../../../../../models").ShoppingBag;
const ShoppingBagProduct = require("./../../../../../models")
  .ShoppingBagProduct;

module.exports = async function(req, res, next) {
  let transaction;
  try {
    req.parameters.permit("id");
    transaction = await sequelize.transaction();

    await ShoppingBagProduct.destroy({
      where: {
        shopping_bag_id: req.params.id
      },
      individualHooks: true,
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
