const seuqilize = require("./../../../../../models").sequelize;
const Product = require("./../../../../../models").Product;

module.exports = async function(req, res, next) {
  let transaction;
  try {
    transaction = await seuqilize.transaction();

    await Product.destroy({
      where: {
        id: req.params.id
      },
      transaction
    });

    res.send(204);
    await transaction.commit();
  } catch (e) {
    transaction.rollback();
    errors = e.errors ? e.errors.map(element => element.message) : [e.message];
    res.status(500).send({ errors });
  }
};
