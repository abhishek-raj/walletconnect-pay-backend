'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('accounts', 'archived', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('accounts', 'archived', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  }
};
