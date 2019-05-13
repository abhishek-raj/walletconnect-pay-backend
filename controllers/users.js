const uuidv4 = require('uuid/v4');
const { web3 } = require('../web3');
const User = require('../models/user');
const Account = require('../models/account');
const {
  sendVerifyEmail,
  sendResetPasswordEmail
} = require('../helpers/mailgun');
const { getAllAccounts } = require('../helpers/parseAccounts');
const { signToken } = require('../helpers/jwt');
const { decrypt } = require('../helpers/cipher');
const { generatePasswordHash } = require('../helpers/bcrypt');
const { encryptAccount } = require('../web3/keystore');
const { generateSecret, verifyTwoFactor } = require('../helpers/twoFactor');

module.exports = {
  signUp: async (req, res, next) => {
    const { email, password } = req.value.body;
    const foundUser = await User.findOne({ where: { email } });
    if (foundUser) {
      return res
        .status(403)
        .json({ error: true, message: 'EMAIL_ALREADY_EXISTS' });
    }
    const uuid = uuidv4();
    const verified = false;
    const twoFactor = false;
    const newUser = await User.create({
      uuid,
      email,
      password,
      walletCount: 1,
      verified,
      twoFactor
    });
    const generatedWallet = web3.eth.accounts.create();
    const keystore = encryptAccount(generatedWallet.privateKey, password);
    const newAccount = await Account.create({
      address: generatedWallet.address,
      keystore,
      userID: uuid,
      userWallet: 1
    });
    const token = signToken(newUser);
    sendVerifyEmail(email);
    const account = {
      address: newAccount.address,
      name: newAccount.name,
      type: newAccount.type,
      tokens: newAccount.tokens,
      balance: newAccount.balance
    };
    res
      .status(200)
      .json({ token, email, verified, twoFactor, accounts: [account] });
  },
  signIn: async (req, res, next) => {
    const { email } = req.value.body;
    const user = await User.findOne({
      attributes: ['uuid', 'verified', 'twoFactor', 'secret'],
      where: { email }
    });
    if (!user) {
      return res.status(404).json({ error: true, message: 'USER_NOT_FOUND' });
    }
    if (user.twoFactor) {
      return res
        .status(200)
        .json({ error: false, message: 'REQUIRE_TWO_FACTOR' });
    }
    const token = signToken(user);
    const { verified, twoFactor } = user;
    let accounts = null;
    try {
      accounts = await getAllAccounts(user.uuid);
      res.status(200).json({ token, email, verified, twoFactor, accounts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'FAILED_GET_ALL_ACCOUNTS' });
    }
  },
  signInTwoFactor: async (req, res, next) => {
    const { email, code } = req.value.body;
    const user = await User.findOne({
      attributes: ['uuid', 'verified', 'twoFactor', 'secret'],
      where: { email }
    });
    if (!user) {
      return res.status(404).json({ error: true, message: 'USER_NOT_FOUND' });
    }
    if (user.twoFactor) {
      const twoFactorCheck = verifyTwoFactor(user.secret, code);
      if (twoFactorCheck.error) {
        return res
          .status(500)
          .json({ error: true, message: twoFactorCheck.message });
      }
    }
    const token = signToken(user);
    const { verified, twoFactor } = user;
    let accounts = null;
    try {
      accounts = await getAllAccounts(user.uuid);
      res.status(200).json({ token, email, verified, twoFactor, accounts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'FAILED_GET_ALL_ACCOUNTS' });
    }
  },
  resendVerifyEmail: async (req, res, next) => {
    const { email } = req.foundUser;
    sendVerifyEmail(email);
    res.status(200).json({ error: false, message: 'VERIFY_EMAIL_SENT' });
  },
  verify: async (req, res, next) => {
    const email = decrypt(req.params.hash);
    const user = await User.findOne({
      where: { email }
    });
    await user.update({ verified: true });
    res.status(200).json({ error: false, message: 'USER_EMAIL_VERIFIED' });
  },
  resetPassword: async (req, res, next) => {
    const { email } = req.value.body;
    sendResetPasswordEmail(email);
    res
      .status(200)
      .json({ error: false, message: 'RESET_PASSWORD_EMAIL_SENT' });
  },
  changePassword: async (req, res, next) => {
    const email = decrypt(req.params.hash);
    const { password } = req.value.body;
    const user = await User.findOne({
      where: { email }
    });
    if (!user) {
      return res.status(404).json({ error: true, message: 'USER_NOT_FOUND' });
    }
    const newPassword = await generatePasswordHash(password);
    await user.update({ password: newPassword, waitingList: false });
    res.status(200).json({ error: false, message: 'USER_PASSWORD_CHANGED' });
  },
  emailVerified: async (req, res, next) => {
    const { verified } = req.foundUser;
    res.status(200).json({ verified });
  },
  requestTwoFactor: async (req, res, next) => {
    const user = req.foundUser;
    const { secret, uri } = generateSecret(user.email);
    await user.update({ secret });
    res.status(200).json({ uri });
  },
  enableTwoFactor: async (req, res, next) => {
    const user = req.foundUser;
    const { code } = req.value.body;
    const twoFactorCheck = verifyTwoFactor(user.secret, code);
    if (twoFactorCheck.error) {
      return res
        .status(500)
        .json({ error: true, message: twoFactorCheck.message });
    }
    await user.update({ twoFactor: true });
    res.status(200).json({ twoFactor: true });
  },
  checkTwoFactor: async (req, res, next) => {
    const { twoFactor } = req.foundUser;
    res.status(200).json({ twoFactor });
  },
  verifyTwoFactor: async (req, res, next) => {
    const user = req.foundUser;
    const { code } = req.value.body;
    if (user.twoFactor) {
      const twoFactorCheck = verifyTwoFactor(user.secret, code);
      if (twoFactorCheck.error) {
        return res
          .status(500)
          .json({ error: true, message: twoFactorCheck.message });
      }
    }
    res
      .status(200)
      .json({ error: false, message: 'SUCCESSFUL_TWO_FACTOR_AUTH' });
  }
};
