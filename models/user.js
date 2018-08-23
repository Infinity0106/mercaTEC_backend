"use strict";
const bcrypt = require("bcrypt");
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
          fields: ["email"]
        },
        {
          unique: true,
          fields: ["username"]
        }
      ],
      hooks: {
        beforeCreate: function(user, options) {
          if (user.password != user.password_confirmation) {
            throw new Error("Password confirmation doesn't match Password");
          }

          return bcrypt
            .hash(user.password, bcrypt.genSaltSync(8))
            .then(password => {
              user.password = password;
            });
        }
      },
      scopes: {
        byEmailOrUsername: function(value) {
          return {
            where: {
              [sequelize.Op.or]: [{ username: value }, { email: value }]
            },
            limit: 1
          };
        }
      }
    }
  );
  //Instance methods
  User.prototype.validPassword = function(password) {
    if (bcrypt.compare(password, this.password)) {
      return this;
    } else {
      throw new Error("Password incorrect");
    }
  };

  User.prototype.serialize = function(opt) {
    return Object.assign(
      {
        id: this.id,
        username: this.username,
        email: this.email
      },
      opt
    );
  };

  User.prototype.toJWT = function(token_value) {
    return {
      token: JWT.encrypt(this.serialize({ token: token_value }))
    };
  };

  User.prototype.update_password = function(params) {
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

  User.prototype.create_session_token = function() {
    return this.createToken({ type: "session" });
  };

  User.prototype.create_recovery_token = function() {
    return this.createToken({ type: "forgot" });
  };

  User.prototype.delete_session_token = function(token) {
    return this.removeToken(token);
  };

  User.prototype.create_phone = function(token) {
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
    User.hasMany(models.Token, {
      foreignKey: "memberable_id",
      constraints: false,
      scope: {
        memberable: "User"
      }
    });

    User.hasMany(models.Token.scope("session"), {
      as: "sessionTokens",
      foreignKey: "memberable_id",
      constraints: false,
      scope: {
        memberable: "User"
      }
    });

    User.hasMany(models.Phone, {
      foreignKey: "memberable_id",
      constraints: false,
      scope: {
        memberable: "User"
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
  };
  return User;
};
