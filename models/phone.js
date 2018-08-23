"use strict";
module.exports = (sequelize, DataTypes) => {
  var Phone = sequelize.define(
    "Phone",
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
      player_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Player can't be empty"
          },
          notNull: {
            args: false,
            msg: "Player can't be null"
          }
        }
      },
      session_token: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Token can't be empty"
          },
          notNull: {
            args: false,
            msg: "Token can't be null"
          }
        }
      },
      memberable: DataTypes.STRING,
      memberable_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Member can't be empty"
          },
          notNull: {
            args: false,
            msg: "Member can't be null"
          }
        }
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["player_id", "session_token", "memberable_id"]
        }
      ]
    }
  );
  Phone.associate = function(models) {
    Phone.belongsTo(models.User, {
      foreignKey: "memberable_id",
      constraints: false,
      as: "User"
    });
  };
  return Phone;
};
