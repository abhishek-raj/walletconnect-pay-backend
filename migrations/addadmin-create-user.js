'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'admin', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'admin', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  }
};
