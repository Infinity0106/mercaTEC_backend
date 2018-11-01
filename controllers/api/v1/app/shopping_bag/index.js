const sequelize = require("./../../../../../models").sequelize;
const ShoppingBag = require("./../../../../../models").ShoppingBag;
const ShoppingBagProduct = require("./../../../../../models")
  .ShoppingBagProduct;
const Product = require("./../../../../../models").Product;
const Image = require("./../../../../../models").Image;

module.exports = async function(req, res, next) {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    let user = req.locals.current_user;
    let shopping_bag = await ShoppingBag.findOne({
      where: {
        user_id: user.id
      },
      include: [
        {
          model: ShoppingBagProduct,
          as: "ShoppingBagItems",
          include: [
            { model: Product, as: "Product", include: [{ model: Image }] }
          ]
        }
      ],
      transaction
    });

    res.status(200).send(shopping_bag.serialize());
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    errors = e.errors ? e.errors.map(element => element.message) : [e.message];
    res.status(500).send({ errors });
  }
};
