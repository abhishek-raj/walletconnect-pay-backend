const Sequelize = require('sequelize');
const { DATABASE } = require('../config/index');

const sequelize = new Sequelize(DATABASE);

const Email = sequelize.define('emails', {
  hash: {
    type: Sequelize.STRING,
    unique: true,
    primaryKey: true,
    allowNull: false
  },
  verified: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

sequelize
  .sync()
  .then(() =>
    console.log(
      `SEQUELIZE ==> emails table has been successfully created, if one doesn't exist`
    )
  )
  .catch(error => console.error(error));

module.exports = Email;
