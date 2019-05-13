'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('accounts', 'privateKey', Sequelize.STRING);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('accounts', 'privateKey', Sequelize.STRING);
  }
};
