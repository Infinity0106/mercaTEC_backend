"use strict";
module.exports = (sequelize, DataTypes) => {
  var Goal = sequelize.define(
    "Goal",
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
            msg: "User id can't be null"
          }
        }
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        allowNull: false
      },
      actual: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        allowNull: false
      }
    },
    {
      schema: "public"
    }
  );
  Goal.associate = function(models) {
    // associations can be defined here
  };
  return Goal;
};
