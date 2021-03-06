const sequelize = require("./../../../../../models").sequelize;
const Image = require("./../../../../../models").Image;
const Product = require("./../../../../../models").Product;

module.exports = async function(req, res, next) {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    let product = await Product.findOne({
      where: {
        id: req.params.id
      },
      include: [{ model: Image }]
    });
    if (!product) throw new Error("Product not found");

    res.status(200).send(product.serialize());
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    errors = e.errors ? e.errors.map(element => element.message) : [e.message];
    res.status(500).send({ errors });
  }
};
