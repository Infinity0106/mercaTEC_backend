"use strict";
const ip = require("ip");
module.exports = (sequelize, DataTypes) => {
  var Image = sequelize.define(
    "Image",
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
      path: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Email can't be null"
          }
        }
      },
      imaginable_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Imaginable can't be null"
          }
        }
      },
      imaginable: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Imaginable can't be null"
          }
        }
      }
    },
    {
      schema: "public"
    }
  );

  Image.prototype.serialize = function(opt) {
    return Object.assign(
      {
        id: this.id,
        path: `http://${ip.address()}:${process.env.PORT || "3000"}/${
          this.path
        }`
      },
      opt
    );
  };

  Image.associate = function(models) {
    // associations can be defined here
    Image.belongsTo(models.Product, {
      foreignKey: "imaginable_id",
      constraints: false,
      as: "Product"
    });

    Image.belongsTo(models.User, {
      foreignKey: "imaginable_id",
      constraints: false,
      as: "User"
    });
  };
  return Image;
};
