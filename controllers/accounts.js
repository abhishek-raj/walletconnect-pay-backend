const { web3 } = require("../web3");
const Account = require("../models/account");
const { verifyTwoFactor } = require("../helpers/twoFactor");
const { encryptAccount } = require("../web3/keystore");
const {
  getAllAccounts,
  getAccountBalance
} = require("../helpers/parseAccounts");

module.exports = {
  all: async (req, res, next) => {
    const user = req.foundUser;
    const accounts = await getAllAccounts(user.uuid);
    res.status(200).json({ accounts });
  },
  generate: async (req, res, next) => {
    const user = req.foundUser;
    const { name } = req.value.body;
    const walletNumber = user.walletCount + 1;
    const generatedWallet = web3.eth.accounts.create();
    const keystore = encryptAccount(generatedWallet.privateKey, user.password);
    const newAccount = await Account.create({
      name: name || null,
      address: generatedWallet.address,
      keystore,
      userID: user.uuid,
      userWallet: walletNumber
    });
    const account = {
      address: newAccount.address,
      name: newAccount.name,
      type: newAccount.type,
      tokens: newAccount.tokens,
      balance: newAccount.balance
    };
    await user.update({ walletCount: walletNumber });
    res.status(200).json({ account });
  },
  addAddress: async (req, res, next) => {
    const user = req.foundUser;
    const { name, address } = req.value.body;
    const accountFound = await Account.findOne({
      where: { address }
    });
    if (accountFound && accountFound.userID !== user.uuid) {
      return res
        .status(403)
        .json({ error: true, message: "USER_NOT_ACCOUNT_OWNER" });
    } else if (accountFound) {
      return res
        .status(500)
        .json({ error: true, message: "ACCOUNT_ALREADY_EXISTS" });
    } else {
      const walletNumber = user.walletCount + 1;
      const newAccount = await Account.create({
        name: name || null,
        address,
        userID: user.uuid,
        userWallet: walletNumber
      });
      const account = {
        address: newAccount.address,
        name: newAccount.name,
        type: newAccount.type,
        tokens: newAccount.tokens,
        balance: newAccount.balance
      };
      await user.update({ walletCount: walletNumber });
      return res.status(200).json({ account });
    }
  },
  rename: async (req, res, next) => {
    const user = req.foundUser;
    const { address, name } = req.value.body;
    const changedAccount = await Account.findOne({
      where: { address, archived: false }
    });
    if (changedAccount.userID !== user.uuid) {
      return res
        .status(403)
        .json({ error: true, message: "USER_NOT_ACCOUNT_OWNER" });
    }
    changedAccount.name = name;
    const balance = await getAccountBalance(changedAccount);
    await changedAccount.update(
      { name, balance },
      { fields: ["name", "balance"] }
    );
    const account = {
      address: changedAccount.address,
      name: changedAccount.name,
      type: changedAccount.type,
      tokens: changedAccount.tokens,
      balance: changedAccount.balance
    };
    res.status(200).json({ account });
  },
  delete: async (req, res, next) => {
    const user = req.foundUser;
    const { address, code } = req.value.body;
    const account = await Account.findOne({
      where: { address, archived: false }
    });
    if (account.userID !== user.uuid) {
      return res
        .status(403)
        .json({ error: true, message: "USER_NOT_ACCOUNT_OWNER" });
    }
    if (user.twoFactor) {
      const twoFactorCheck = verifyTwoFactor(user.secret, code);
      if (twoFactorCheck.error) {
        return res
          .status(500)
          .json({ error: true, message: twoFactorCheck.message });
      }
    }
    await account.update({ archived: true }, { fields: ["archived"] });
    await user.update({ walletCount: user.walletCount - 1 });
    res
      .status(200)
      .json({ error: false, message: "WALLET_SUCCESFULLY_DELETED" });
  }
};
