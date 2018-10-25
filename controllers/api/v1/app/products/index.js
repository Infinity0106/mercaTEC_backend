const sequelize = require("./../../../../../models").sequelize;
const Image = require("./../../../../../models").Image;

module.exports = async function(req, res, next) {
  let page = req.query.page || 1;
  let count = await req.locals.current_user.countProducts();
  let products = await req.locals.current_user.getProducts({
    include: [{ model: Image }],
    limit: 5,
    offset: 5 * (page - 1),
    order: [["createdAt", "DESC"]]
  });

  let result = products.map(ele => ele.serialize());
  let json = {
    products: result,
    meta: {
      current_page: page,
      total_pages: Math.ceil(count / 5),
      total_products: count
    }
  };
  res.status(200).send(json);
};
