const sequelize = require("./../../../../../models").sequelize;
const Image = require("./../../../../../models").Image;

module.exports = async function(req, res, next) {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    let products = await req.locals.current_user.getProducts({
      where: {
        id: req.params.id
      },
      include: [{ model: Image }]
    });
    if (!products[0]) throw new Error("Product not found");

    let product = products[0];

    res.status(200).send(product.serialize());
    await transaction.commit();
  } catch (e) {
    transaction.rollback();
    errors = e.errors ? e.errors.map(element => element.message) : [e.message];
    res.status(500).send({ errors });
  }
};
