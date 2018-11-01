const seuqilize = require("./../../../../../models").sequelize;
const Image = require("./../../../../../models").Image;
const fs = require("fs");
const path = require("path");
module.exports = async function(req, res, next) {
  let transaction;
  try {
    transaction = await seuqilize.transaction();

    let image = await Image.findById(req.params.id);
    await Image.destroy({
      where: {
        id: req.params.id
      },
      transaction
    });
    fs.unlink(path.join(__dirname + image.path), err => {
      if (err) console.log(image.path + " not deleted");
    });

    res.send(204);
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    errors = e.errors ? e.errors.map(element => element.message) : [e.message];
    res.status(500).send({ errors });
  }
};
