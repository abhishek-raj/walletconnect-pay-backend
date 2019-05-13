const Account = require('../models/account');
const { sendSignedTransaction, transferToken } = require('../web3/methods');
const { decryptAccount } = require('../web3/keystore');
const { verifyTwoFactor } = require('../helpers/twoFactor');

module.exports = {
  sendEther: async (req, res, next) => {
    const user = req.foundUser;
    const { from, to, value, gasPrice, code } = req.value.body;
    if (user.twoFactor) {
      const twoFactorCheck = verifyTwoFactor(user.secret, code);
      if (twoFactorCheck.error) {
        return res
          .status(500)
          .json({ error: true, message: twoFactorCheck.message });
      }
    }
    const account = await Account.findOne({
      where: { userID: user.uuid, address: from, archived: false }
    });
    const privateKey = decryptAccount(account.keystore, user.password)
      .privateKey;
    sendSignedTransaction({
      from: from,
      to: to,
      value: value,
      gasPrice,
      privateKey
    })
      .then(txHash => res.status(200).json({ txHash }))
      .catch(error => {
        res.status(500).json({ error: true, message: error.message });
      });
  },
  sendToken: async (req, res, next) => {
    const user = req.foundUser;
    const { from, to, tokenAddress, amount, gasPrice, code } = req.value.body;
    if (user.twoFactor) {
      const twoFactorCheck = verifyTwoFactor(user.secret, code);
      if (twoFactorCheck.error) {
        return res
          .status(500)
          .json({ error: true, message: twoFactorCheck.message });
      }
    }
    const account = await Account.findOne({
      where: { userID: user.uuid, address: from, archived: false }
    });
    const privateKey = decryptAccount(account.keystore, user.password)
      .privateKey;
    transferToken({
      tokenAddress,
      from: from,
      to: to,
      amount: amount,
      gasPrice,
      privateKey
    })
      .then(txHash => res.status(200).json({ txHash }))
      .catch(error => {
        res.status(500).json({ error: true, message: error.message });
      });
  }
};
