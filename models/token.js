const Sequelize = require('sequelize');
const { DATABASE } = require('../config/index');

const sequelize = new Sequelize(DATABASE);

const Token = sequelize.define('tokens', {
  address: {
    type: Sequelize.STRING,
    unique: true,
    primaryKey: true,
    allowNull: false
  },
  symbol: {
    type: Sequelize.STRING,
    allowNull: false
  },
  decimal: {
    type: Sequelize.INTEGER,
    defaultValue: 18
  },
  name: {
    type: Sequelize.STRING
  },
  totalSupply: {
    type: Sequelize.STRING
  }
});

sequelize
  .sync()
  .then(() =>
    console.log(
      `SEQUELIZE ==> tokens table has been successfully created, if one doesn't exist`
    )
  )
  .catch(error => console.error(error));

module.exports = Token;
