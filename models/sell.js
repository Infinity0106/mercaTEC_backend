"use strict";
module.exports = (sequelize, DataTypes) => {
  var Sell = sequelize.define(
    "Sell",
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
      total: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE
      }
    },
    {
      schema: "public"
    }
  );

  Sell.prototype.serialize = function() {
    return {
      id: this.id,
      total: this.total,
      createdAt: this.createdAt,
      product: this.Product.serialize()
    };
  };

  Sell.associate = function(models) {
    // associations can be defined here
    Sell.belongsTo(models.Product, {
      foreignKey: "product_id",
      constraints: false,
      as: "Product"
    });

    Sell.belongsTo(models.User, {
      foreignKey: "user_id",
      constraints: false,
      as: "User"
    });
  };
  return Sell;
};
