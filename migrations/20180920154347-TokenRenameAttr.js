"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.renameColumn("Tokens", "memberable", "tokenizable");
    queryInterface.renameColumn("Tokens", "memberable_id", "tokenizable_id");
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.renameColumn("Tokens", "tokenizable", "memberable");
    queryInterface.renameColumn("Tokens", "tokenizable_id", "memberable_id");
  }
};
