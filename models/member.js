"use strict";
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  var Member = sequelize.define(
    "Member",
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Email can't be empty"
          },
          isEmail: {
            args: true,
            msg: "Incorrect email format"
          },
          notNull: {
            args: false,
            msg: "Email can't be null"
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Password can't be empty"
          },
          notNull: {
            args: false,
            msg: "Password can't be null"
          }
        }
      },
      password_confirmation: {
        type: DataTypes.VIRTUAL
      },
      memberable: DataTypes.STRING,
      memberable_id: DataTypes.UUID
    },
    {
      schema: "public",
      indexes: [
        {
          unique: true,
          fields: ["email"]
        }
      ],
      hooks: {
        beforeCreate: function(member, options) {
          if (member.password != member.password_confirmation) {
            throw new Error("Password confirmation doesn't match Password");
          }

          return bcrypt
            .hash(member.password, bcrypt.genSaltSync(8))
            .then(password => {
              member.password = password;
            });
        }
      }
    }
  );

  Member.prototype.valid_password = function(password) {
    return bcrypt.compare(password, this.password).then(result => {
      if (result) {
        return this;
      } else {
        throw new Error("Password incorrect");
      }
    });
  };

  Member.prototype.update_password = function(params) {
    if (params.password != params.password_confirmation) {
      throw new Error("Password confirmation doesn't match Password");
    }

    return bcrypt
      .hash(params.password, bcrypt.genSaltSync(8))
      .then(password => {
        this.password = password;
        return this.save();
      });
  };

  Member.associate = function(models) {
    // associations can be defined here
    Member.belongsTo(models.User, {
      foreignKey: "memberable_id",
      constraints: false,
      as: "User"
    });

    Member.belongsTo(models.Administrator, {
      foreignKey: "memberable_id",
      constraints: false,
      as: "Administrator"
    });
  };
  return Member;
};
