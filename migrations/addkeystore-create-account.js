'use strict';
const { decryptAccount, encryptAccount } = require('../web3/keystore');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('accounts', 'keystore', Sequelize.TEXT)
      .then(() => {
        return queryInterface.sequelize
          .query('SELECT address, "privateKey", "userID" FROM accounts')
          .spread(accountResults =>
            accountResults.map(account => {
              if (account.privateKey) {
                queryInterface.sequelize
                  .query(`SELECT password FROM users WHERE uuid = '${account.userID}'`)
                  .spread(userResults => {
                    if (userResults[0]) {
                      const keystore = JSON.stringify(
                        encryptAccount(account.privateKey, userResults[0].password)
                      );
                      return queryInterface.sequelize.query(
                        `UPDATE accounts SET keystore = '${keystore}', "privateKey" = '' WHERE address = '${
                          account.address
                        }'`
                      );
                    }
                  })
                  .catch(error => console.error(error));
              }
            })
          )
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('SELECT address, keystore, "userID" FROM accounts')
      .spread(accountResults =>
        accountResults.map(account => {
          if (account.keystore) {
            queryInterface.sequelize
              .query(`SELECT password FROM users WHERE uuid = '${account.userID}'`)
              .spread(userResults => {
                if (userResults[0]) {
                  const keystore = JSON.parse(account.keystore);
                  const privateKey = decryptAccount(keystore, userResults[0].password).privateKey;
                  return queryInterface.sequelize
                    .query(
                      `UPDATE accounts SET keystore = '', "privateKey" = '${privateKey}' WHERE address = '${
                        account.address
                      }'`
                    )
                    .then(() => {
                      return queryInterface.removeColumn('accounts', 'keystore', Sequelize.TEXT);
                    })
                    .catch(error => console.error(error));
                }
              })
              .catch(error => console.error(error));
          }
        })
      )
      .catch(error => console.error(error));
  }
};
