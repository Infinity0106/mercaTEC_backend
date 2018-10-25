"use strict";
module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define(
    "Product",
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
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.DECIMAL(10, 2),
      user_id: {
        type: DataTypes.UUID,
        validate: {
          notEmpty: {
            args: true,
            msg: "User id can't be null"
          }
        }
      }
    },
    {
      schema: "public"
    }
  );

  Product.prototype.serialize = function(opt) {
    return Object.assign(
      {
        id: this.id,
        name: this.name,
        description: this.description,
        price: this.price,
        images: this.Images.map(ele => ele.serialize())
      },
      opt
    );
  };

  Product.associate = function(models) {
    // associations can be defined here
    Product.hasMany(models.Image, {
      foreignKey: "imaginable_id",
      constraints: false,
      scope: {
        imaginable: "Product"
      }
    });

    Product.belongsTo(models.User, {
      foreignKey: "user_id",
      constraints: false,
      as: "User"
    });
  };
  return Product;
};
