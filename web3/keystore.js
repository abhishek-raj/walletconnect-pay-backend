const { web3 } = require("./index.js");
const { KEYSTORE_HASH } = require("../config");

/**
 * @desc encrypt accounts into keystore
 * @param  {String} privateKey
 * @param  {String} password
 * @return {Object}
 */
const encryptAccount = (privateKey, password) => {
  const key = web3.utils.sha3(`${KEYSTORE_HASH}${password}`).replace("0x", "");
  const keystore = web3.eth.accounts.encrypt(privateKey, key);
  return JSON.stringify(keystore);
};

/**
 * @desc decrypt accounts with password
 * @param  {Object} keystore
 * @param  {String} password
 * @return {Object}
 */
const decryptAccount = (keystore, password) => {
  const _keystore = JSON.parse(keystore);
  const key = web3.utils.sha3(`${KEYSTORE_HASH}${password}`).replace("0x", "");
  return web3.eth.accounts.decrypt(_keystore, key);
};

module.exports = {
  encryptAccount,
  decryptAccount
};
