"use strict";
module.exports = (sequelize, DataTypes) => {
  var Administrator = sequelize.define(
    "Administrator",
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
      type: DataTypes.ENUM("RH", "Programmer")
    },
    {
      schema: "public"
    }
  );
  Administrator.associate = function(models) {
    // associations can be defined here
    Administrator.hasOne(models.Member, {
      foreignKey: "memberable_id",
      constraints: false,
      scope: {
        memberable: "Administrator"
      }
    });

    Administrator.hasMany(models.Token, {
      foreignKey: "tokenizable_id",
      constraints: false,
      scope: {
        tokenizable: "Administrator"
      }
    });

    Administrator.hasMany(models.Token.scope("session"), {
      as: "sessionTokens",
      foreignKey: "tokenizable_id",
      constraints: false,
      scope: {
        tokenizable: "Administrator"
      }
    });
  };
  return Administrator;
};
