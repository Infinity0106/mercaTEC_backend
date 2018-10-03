"use strict";
module.exports = (sequelize, DataTypes) => {
  var Notification = sequelize.define(
    "Notification",
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
      message: {
        type: DataTypes.JSONB,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Message can't be empty"
          },
          notNull: {
            args: false,
            msg: "Message can't be null"
          }
        }
      },
      from_user_id: DataTypes.UUID,
      to_user_id: DataTypes.UUID,
      one_signal_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "OneSignal can't be empty"
          },
          notNull: {
            args: false,
            msg: "OneSignal can't be null"
          }
        }
      },
      delivery_time: DataTypes.DATE
    },
    {
      schema: "public"
    }
  );
  Notification.associate = function(models) {
    // associations can be defined here
    Notification.belongsTo(models.User, {
      foreignKey: "from_user_id",
      constraints: false,
      as: "FromUser"
    });

    Notification.belongsTo(models.User, {
      foreignKey: "to_user_id",
      constraints: false,
      as: "ToUser"
    });
  };
  return Notification;
};
