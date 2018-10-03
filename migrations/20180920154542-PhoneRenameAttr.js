"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.renameColumn("Tokens", "memberable", "phoneable");
    queryInterface.renameColumn("Tokens", "memberable_id", "phoneable_id");
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.renameColumn("Tokens", "phoneable", "memberable");
    queryInterface.renameColumn("Tokens", "phoneable_id", "memberable_id");
  }
};
