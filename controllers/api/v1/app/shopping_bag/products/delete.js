const sequelize = require("./../../../../../../models").sequelize;
const ShoppingBagProduct = require("./../../../../../../models")
  .ShoppingBagProduct;

module.exports = async function(req, res, next) {
  let transaction;
  try {
    req.parameters.permit("id", "shopping_id");
    transaction = await sequelize.transaction();

    await ShoppingBagProduct.destroy({
      where: {
        id: req.params.shopping_id
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
