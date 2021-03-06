"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.renameColumn("Phones", "memberable", "phoneable");
    queryInterface.renameColumn("Phones", "memberable_id", "phoneable_id");
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.renameColumn("Phones", "phoneable", "memberable");
    queryInterface.renameColumn("Phones", "phoneable_id", "memberable_id");
  }
};
