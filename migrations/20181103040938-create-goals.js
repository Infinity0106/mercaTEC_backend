"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Goals", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        validate: {
          isUUID: 4
        }
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
        allowNull: false
      },
      actual: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
        allowNull: false
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
    return queryInterface.dropTable("Goals");
  }
};
