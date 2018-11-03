"use strict";
module.exports = (sequelize, DataTypes) => {
  var ShoppingBag = sequelize.define(
    "ShoppingBag",
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
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "User can't be null"
          }
        }
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        allowNull: false
      }
    },
    {
      schema: "public"
    }
  );
  // instance functions
  ShoppingBag.prototype.serialize = function() {
    return {
      id: this.id,
      total: this.total,
      items: this.ShoppingBagItems.map(ele => ele.serialize())
    };
  };

  ShoppingBag.associate = function(models) {
    // associations can be defined here
    ShoppingBag.hasMany(models.ShoppingBagProduct, {
      foreignKey: "shopping_bag_id",
      constraints: false,
      as: "ShoppingBagItems"
    });

    ShoppingBag.belongsToMany(models.Product, {
      through: {
        model: models.ShoppingBagProduct,
        unique: false
      },
      constraints: false,
      as: "Products",
      foreignKey: "shopping_bag_id"
    });

    ShoppingBag.belongsTo(models.User, {
      foreignKey: "user_id",
      constraints: false,
      as: "User"
    });
  };
  return ShoppingBag;
};
