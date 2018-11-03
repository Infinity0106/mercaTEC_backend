"use strict";
module.exports = (sequelize, DataTypes) => {
  var ShoppingBagProduct = sequelize.define(
    "ShoppingBagProduct",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "ID can't be null"
          }
        }
      },
      shopping_bag_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      schema: "public",
      hooks: {
        afterCreate: async (instance, opt) => {
          // Do other stuff
          let product = await instance.getProduct();
          let shopping_bag = await instance.getShoppingBag();

          await shopping_bag.update({
            total: (
              parseFloat(shopping_bag.total) + parseFloat(product.price)
            ).toFixed(2)
          });
        },
        beforeDestroy: async (instance, opt) => {
          console.log("🛠🛠🛠🛠🛠");
          console.log("entro");
          console.log("🛠🛠🛠🛠🛠");
          let product = await instance.getProduct();
          let shopping_bag = await instance.getShoppingBag();

          await shopping_bag.update({
            total: (
              parseFloat(shopping_bag.total) - parseFloat(product.price)
            ).toFixed(2)
          });
        }
      }
    }
  );
  ShoppingBagProduct.prototype.serialize = function() {
    return {
      id: this.id,
      product: this.Product.serialize()
    };
  };
  ShoppingBagProduct.associate = function(models) {
    // associations can be defined here
    ShoppingBagProduct.belongsTo(models.ShoppingBag, {
      foreignKey: "shopping_bag_id",
      constraints: false,
      as: "ShoppingBag"
    });

    ShoppingBagProduct.belongsTo(models.Product, {
      foreignKey: "product_id",
      constraints: false,
      as: "Product"
    });
  };
  return ShoppingBagProduct;
};
