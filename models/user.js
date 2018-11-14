"use strict";
const JWT = require("../lib/json_web_token");

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    "User",
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
        type: DataTypes.VIRTUAL
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Username can't be empty"
          },
          notNull: {
            args: false,
            msg: "Username can't be null"
          }
        }
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["username"]
        }
      ],
      scopes: {
        byEmailOrUsername: function(value) {
          return {
            where: {
              [sequelize.Op.or]: [
                { username: value },
                { "$Member.email$": value }
              ]
            },
            include: [sequelize.models.Member],
            limit: 1
          };
        }
      }
    }
  );
  //Instance methods
  User.prototype.valid_password = async function(password) {
    let member = await this.getMember();
    return member.valid_password(password);
  };

  User.prototype.serialize = function(opt) {
    return Object.assign(
      {
        id: this.id,
        username: this.username,
        email: this.Member.email
      },
      opt
    );
  };

  User.prototype.toJWT = function(token_value) {
    return {
      token: JWT.encrypt(this.serialize({ token: token_value }))
    };
  };

  User.prototype.update_password = async function(params) {
    let member = await this.getMember();
    return member.update_password(params);
  };

  User.prototype.create_session_token = function(transaction) {
    if (transaction)
      return this.createToken({ type: "session" }, { transaction });
    return this.createToken({ type: "session" });
  };

  User.prototype.create_recovery_token = function() {
    return this.createToken({ type: "forgot" });
  };

  User.prototype.delete_session_token = function(token) {
    return token.destroy();
  };

  User.prototype.create_phone = function(token, transaction) {
    if (transaction)
      return this.createPhone(
        {
          session_token: token.value,
          player_id: this.player_id
        },
        { transaction }
      );

    return this.createPhone({
      session_token: token.value,
      player_id: this.player_id
    });
  };

  User.prototype.get_player_ids = function() {
    return this.getPhones({
      attributes: ["player_id"],
      raw: true
    }).then(players => players.map(ele => ele.player_id));
  };

  User.associate = function(models) {
    // associations can be defined here
    User.hasOne(models.Member, {
      foreignKey: "memberable_id",
      constraints: false,
      scope: {
        memberable: "User"
      }
    });

    User.hasOne(models.ShoppingBag, {
      foreignKey: "user_id",
      constraints: false
    });

    User.hasMany(models.Token, {
      foreignKey: "tokenizable_id",
      constraints: false,
      scope: {
        tokenizable: "User"
      }
    });

    User.hasMany(models.Token.scope("session"), {
      as: "sessionTokens",
      foreignKey: "tokenizable_id",
      constraints: false,
      scope: {
        tokenizable: "User"
      }
    });

    User.hasMany(models.Phone, {
      foreignKey: "phoneable_id",
      constraints: false,
      scope: {
        phoneable: "User"
      }
    });

    User.hasMany(models.Notification, {
      as: "notifcationsRecived",
      foreignKey: "to_user_id",
      constraints: false
    });

    User.hasMany(models.Notification, {
      as: "notifcationsSent",
      foreignKey: "from_user_id",
      constraints: false
    });

    User.hasMany(models.Product, {
      as: "products",
      foreignKey: "user_id",
      constraints: false
    });

    User.hasMany(models.Sell, {
      as: "sells",
      foreignKey: "user_id",
      constraints: false
    });
  };
  return User;
};
