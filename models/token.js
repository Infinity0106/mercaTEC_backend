"use strict";
module.exports = (sequelize, DataTypes) => {
  var Token = sequelize.define(
    "Token",
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
      value: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [6],
            msg: "Incorrect token size"
          }
        }
      },
      type: DataTypes.ENUM("session", "forgot"),
      memberable: DataTypes.STRING,
      memberable_id: DataTypes.UUID
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["value"]
        }
      ],
      hooks: {
        beforeCreate: function(instance, options) {
          instance.value = Math.floor(Math.random() * 900000) + 100000;
        }
      },
      scopes: {
        session: {
          where: {
            type: "session"
          }
        },
        forgot: {
          where: {
            type: "forgot"
          }
        },
        byValue: function(value) {
          return {
            where: {
              value: value
            },
            limit: 1
          };
        }
      }
    }
  );

  Token.prototype.serialize = function() {
    return {
      value: this.value
    };
  };

  Token.associate = function(models) {
    // associations can be defined here
    Token.belongsTo(models.User, {
      foreignKey: "memberable_id",
      constraints: false,
      as: "User"
    });
  };
  return Token;
};
