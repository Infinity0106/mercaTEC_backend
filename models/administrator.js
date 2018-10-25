"use strict";
const JWT = require("../lib/json_web_token");

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

  Administrator.prototype.valid_password = async function(password) {
    let member = await this.getMember();
    return member.valid_password(password);
  };

  Administrator.prototype.serialize = function(opt) {
    return Object.assign(
      {
        id: this.id,
        email: this.Member.email
      },
      opt
    );
  };

  Administrator.prototype.toJWT = function(token_value) {
    return {
      token: JWT.encrypt(this.serialize({ token: token_value }))
    };
  };

  Administrator.prototype.update_password = async function(params) {
    let member = await this.getMember();
    return member.update_password(params);
  };

  Administrator.prototype.create_session_token = function(transaction) {
    if (transaction)
      return this.createToken({ type: "session" }, { transaction });
    return this.createToken({ type: "session" });
  };

  Administrator.prototype.create_recovery_token = function() {
    return this.createToken({ type: "forgot" });
  };

  Administrator.prototype.delete_session_token = function(token) {
    return token.destroy();
  };

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
