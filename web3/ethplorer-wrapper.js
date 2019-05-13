const BigNumber = require('bignumber.js');
const { web3 } = require('./index.js');
const ropstenTokens = require('./ropsten.json');
const { getDataString, getNakedAddress, fromWei } = require('./helpers');

/**
 * @desc get account ether balance
 * @param  {String} accountAddress
 * @param  {String} tokenAddress
 * @return {Array}
 */
const getAccountBalance = async address => {
  const wei = await web3.eth.getBalance(address);
  const ether = fromWei(wei);
  const balance = Number(ether) !== 0 ? BigNumber(ether).toFormat(8) : 0;
  return balance;
};

/**
 * @desc get account token balance
 * @param  {String} accountAddress
 * @param  {String} tokenAddress
 * @return {Array}
 */
const getBalanceOf = (accountAddress, tokenAddress) =>
  new Promise((resolve, reject) => {
    const balanceHexMethod = web3.utils
      .sha3('balanceOf(address)')
      .substring(0, 10);
    const dataString = getDataString(balanceHexMethod, [
      getNakedAddress(accountAddress)
    ]);
    web3.eth
      .call({ to: tokenAddress, data: dataString })
      .then(balanceHexResult => {
        const balance = web3.utils.fromWei(balanceHexResult);
        resolve(balance);
      })
      .catch(error => reject(error));
  });

/**
 * @desc get account tokens
 * @param  {String} accountAddress
 * @return {Array}
 */
const getAccountTokens = async accountAddress => {
  let accountTokens = await Promise.all(
    ropstenTokens.map(async token => {
      if (ropstenTokens) {
        let balance = await getBalanceOf(accountAddress, token.address);
        if (balance === '0') {
          return null;
        }
        balance = BigNumber(balance)
          .toFormat(token.decimal, 0)
          .replace(/0+$/, '')
          .replace(/\.+$/, '');
        balance = BigNumber(Number(balance.replace(/[^0-9.]/gi, '')))
          .times(new BigNumber(10).pow(token.decimal))
          .toNumber();
        return {
          tokenInfo: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimal
          },
          balance
        };
      }
      return null;
    })
  );
  accountTokens = accountTokens.filter(token => !!token).length
    ? accountTokens.filter(token => !!token)
    : null;
  return accountTokens;
};

//

/**
 * @desc get ethereum address info / tokens
 * @param  {String}   [address='']
 * @return {Promise}
 */
const ropstenGetAddressInfo = async (address = '') => {
  const countTxs = await web3.eth.getTransactionCount(address);
  const balance = await getAccountBalance(address);
  const tokens = await getAccountTokens(address);
  const response = {
    address,
    countTxs,
    ETH: {
      balance
    }
  };
  if (tokens) response.tokens = tokens;
  return response;
};

module.exports = {
  ropstenGetAddressInfo
};
