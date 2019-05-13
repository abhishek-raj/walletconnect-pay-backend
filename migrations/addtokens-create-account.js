'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('accounts', 'tokens', Sequelize.ARRAY(Sequelize.JSON));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('accounts', 'tokens', Sequelize.ARRAY(Sequelize.JSON));
  }
};
