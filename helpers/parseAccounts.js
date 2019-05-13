const BigNumber = require('bignumber.js');
const Account = require('../models/account');
const Token = require('../models/token');
const { ethplorerGetAddressInfo } = require('../helpers/ethplorer');

const iterateTokens = async tokens => {
  const parsedTokens = await Promise.all(
    tokens.map(async token => {
      const tokenFound = await Token.findOne({
        where: { address: token.tokenInfo.address }
      });
      if (!tokenFound) {
        await Token.create({
          address: token.tokenInfo.address,
          name: token.tokenInfo.name,
          symbol: token.tokenInfo.symbol,
          decimal: token.tokenInfo.decimals,
          totalSupply: token.tokenInfo.totalSupply
        });
      }
      const balance = BigNumber(token.balance)
        .dividedBy(new BigNumber(10).pow(token.tokenInfo.decimals))
        .toString();
      return {
        address: token.tokenInfo.address,
        symbol: token.tokenInfo.symbol,
        decimal: token.tokenInfo.decimals,
        balance
      };
    })
  );
  return parsedTokens;
};

/**
 * @desc get all user accounts and parse balance / tokens
 * @param  {String}   [userID]
 * @return {Promise}
 */
const getAllAccounts = async userID => {
  const accountsRaw = await Account.findAll({
    attributes: ['address', 'name', 'type', 'tokens', 'balance'],
    where: { userID, archived: false },
    order: [['createdAt', 'ASC']]
  });
  const accounts = await Promise.all(
    accountsRaw.map(async account => {
      if (account.address) {
        let accountInfo = null;
        try {
          accountInfo = await ethplorerGetAddressInfo(account.address);
        } catch (error) {
          console.error(error);
        }
        const balance = BigNumber(accountInfo.ETH.balance).toFormat(8);
        const tokens = accountInfo.tokens
          ? await iterateTokens(accountInfo.tokens)
          : null;
        await account.update(
          { balance, tokens },
          { where: { address: account.address } }
        );
      }
      return {
        address: account.address,
        name: account.name,
        type: account.type,
        tokens: account.tokens,
        balance: account.balance
      };
    })
  );
  return accounts;
};

/**
 * @desc get account balance and parse tokens
 * @param  {Object}   [account]
 * @return {Promise}
 */
const getAccountBalance = async account => {
  const accountInfo = await ethplorerGetAddressInfo(account.address);
  const balance = BigNumber(accountInfo.ETH.balance).toFormat(8);
  const tokens = accountInfo.tokens
    ? await iterateTokens(accountInfo.tokens)
    : null;
  await account.update(
    { balance, tokens },
    { where: { address: account.address } }
  );
  return balance;
};

module.exports = {
  getAllAccounts,
  getAccountBalance
};
