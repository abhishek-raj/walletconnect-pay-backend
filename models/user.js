const Sequelize = require('sequelize');
const { generatePasswordHash } = require('../helpers/bcrypt');
const { DATABASE } = require('../config/index');

const sequelize = new Sequelize(DATABASE);

const User = sequelize.define(
  'users',
  {
    uuid: {
      type: Sequelize.STRING,
      unique: true,
      primaryKey: true,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    walletCount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    twoFactor: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    secret: {
      type: Sequelize.STRING
    },
    waitingList: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    admin: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    hooks: {
      beforeCreate: async user => {
        const passwordHash = await generatePasswordHash(user.password);
        user.password = passwordHash;
      }
    }
  }
);

sequelize
  .sync()
  .then(() =>
    console.log(
      `SEQUELIZE ==> users table has been successfully created, if one doesn't exist`
    )
  )
  .catch(error => console.error(error));

module.exports = User;
