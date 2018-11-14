const sequelize = require("./../../../../../models").sequelize;
const Product = require("./../../../../../models").Product;
const Image = require("./../../../../../models").Image;

module.exports = async function(req, res, next) {
  let transaction;
  try {
    req.parameters.permit("id");
    transaction = await sequelize.transaction();
    let user = req.locals.current_user;

    let sells = await user.getSells({
      include: [
        {
          model: Product,
          as: "Product",
          include: [
            {
              model: Image,
              limit: 1
            }
          ]
        }
      ]
    });

    let response = sells.map(ele => ele.serialize());

    res.status(200).send(response);
    await transaction.commit();
  } catch (e) {
    if (transaction) await transaction.rollback();
    errors = e.errors ? e.errors.map(element => element.message) : [e.message];
    res.status(500).send({ errors });
  }
};
