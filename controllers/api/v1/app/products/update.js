const sequelize = require("./../../../../../models").sequelize;
const Product = require("./../../../../../models").Product;
const Image = require("./../../../../../models").Image;

module.exports = async function(req, res, next) {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    await Product.update(req.body, {
      where: { id: req.params.id },
      transaction
    });
    await Image.bulkCreate(
      req.files.map(ele => {
        return {
          path: ele.path,
          imaginable_id: req.params.id,
          imaginable: "Product"
        };
      }),
      { transaction }
    );

    res.send(204);
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    errors = e.errors ? e.errors.map(element => element.message) : [e.message];
    res.status(500).send({ errors });
  }
};
