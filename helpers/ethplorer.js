const axios = require('axios');

/**
 * Configuration for ethplorer api instance
 * @type axios instance
 */
const ethplorer = axios.create({
  baseURL: 'https://api.ethplorer.io',
  timeout: 30000, // 30 secs
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  params: {
    apiKey: 'freekey'
  }
});

/**
 * @desc get ethereum address info / tokens
 * @param  {String}   [address='']
 * @return {Promise}
 */
const ethplorerGetAddressInfo = (address = '') =>
  new Promise((resolve, reject) =>
    ethplorer
      .get(`/getAddressInfo/${address}`)
      .then(({ data }) => resolve(data))
      .catch(err => reject(err))
  );

/**
 * @desc switch to an ethplorer web3 wrapper for ropsten
 */

const { ETHEREUM_NETWORK } = require('../config/index');
const { ropstenGetAddressInfo } = require('../web3/ethplorer-wrapper');

switch (ETHEREUM_NETWORK) {
  case 'mainnet':
    module.exports = {
      ethplorerGetAddressInfo
    };
    break;
  case 'ropsten':
    module.exports = {
      ethplorerGetAddressInfo: ropstenGetAddressInfo
    };
    break;
  default:
    console.error('Unrecognized ETHEREUM_NETWORK: ' + ETHEREUM_NETWORK);
}
