const Sequelize = require('sequelize');
const { DATABASE } = require('../config/index');

const sequelize = new Sequelize(DATABASE);

const Account = sequelize.define(
  'accounts',
  {
    address: {
      type: Sequelize.STRING,
      unique: true,
      primaryKey: true,
      allowNull: false
    },
    keystore: {
      type: Sequelize.TEXT
    },
    userID: {
      type: Sequelize.STRING,
      allowNull: false
    },
    userWallet: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    tokens: {
      type: Sequelize.ARRAY(Sequelize.JSON)
    },
    balance: {
      type: Sequelize.STRING
    },
    archived: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  },
  {
    hooks: {
      beforeCreate: async user => {
        if (user.privateKey || user.keystore) {
          user.type = 'HOT';
          if (user.privateKey) {
            const privateKey =
              user.privateKey.substr(0, 2) === '0x'
                ? user.privateKey.substr(2)
                : user.privateKey;
            user.privateKey = privateKey;
          }
        } else {
          user.type = 'COLD';
        }
        if (!user.balance) {
          user.balance = '0.00000000';
        }
        if (!user.name) {
          user.name = `Wallet ${user.userWallet}`;
        }
      }
    }
  }
);

sequelize
  .sync()
  .then(() =>
    console.log(
      `SEQUELIZE ==> accounts table has been successfully created, if one doesn't exist`
    )
  )
  .catch(error => console.error(error));

module.exports = Account;
