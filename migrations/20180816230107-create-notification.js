"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Notifications", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        validate: {
          isUUID: 4
        }
      },
      message: {
        type: Sequelize.JSONB
      },
      from_user_id: {
        type: Sequelize.UUID
      },
      to_user_id: {
        type: Sequelize.UUID
      },
      one_signal_id: {
        type: Sequelize.UUID
      },
      delivery_time: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Notifications");
  }
};
