const uuidv4 = require("uuid/v4");
const { web3 } = require("../web3");
const User = require("../models/user");
const Account = require("../models/account");
const { signToken } = require("../helpers/jwt");
const { sendInviteWaitingList } = require("../helpers/mailgun");
const { encryptAccount } = require("../web3/keystore");

module.exports = {
  waitingList: async (req, res, next) => {
    const users = await User.findAll({
      attributes: ["email"],
      where: { waitingList: true },
      order: [["createdAt", "DESC"]]
    });
    res.status(200).json({ users });
  },
  signIn: async (req, res, next) => {
    const { email } = req.value.body;
    const user = await User.findOne({
      attributes: ["uuid", "admin"],
      where: { email }
    });
    if (!user) {
      return res.status(404).json({ error: true, message: "USER_NOT_FOUND" });
    } else if (!user.admin) {
      return res
        .status(403)
        .json({ error: true, message: "ADMIN_ACCESS_ONLY" });
    }
    const token = signToken(user);
    return res.status(200).json({ token });
  },
  addUser: async (req, res, next) => {
    const { email } = req.value.body;
    const foundUser = await User.findOne({ where: { email } });
    if (foundUser) {
      return res
        .status(403)
        .json({ error: true, message: "EMAIL_ALREADY_EXISTS" });
    }
    const uuid = uuidv4();
    const password = web3.utils
      .sha3(String(Math.random()).slice(2))
      .replace("0x", "")
      .slice(0, 12);
    const verified = false;
    const twoFactor = false;
    await User.create({
      uuid,
      email,
      password,
      walletCount: 1,
      verified,
      twoFactor,
      waitingList: true
    });
    const generatedWallet = web3.eth.accounts.create();
    const keystore = encryptAccount(generatedWallet.privateKey, password);
    await Account.create({
      address: generatedWallet.address,
      keystore,
      userID: uuid,
      userWallet: 1
    });
    sendInviteWaitingList(email);
    return res
      .status(200)
      .json({ error: false, message: "USER_ADDED_TO_WAITING_LIST" });
  },
  resendEmail: async (req, res, next) => {
    const { email } = req.value.body;
    const foundUser = await User.findOne({ where: { email } });
    if (!foundUser) {
      return res.status(404).json({ error: true, message: "USER_NOT_FOUND" });
    } else if (!foundUser.waitingList) {
      return res
        .status(403)
        .json({ error: true, message: "USER_NOT_WAITING_LIST" });
    }
    sendInviteWaitingList(email);
    return res
      .status(200)
      .json({ error: false, message: "WAITING_LIST_EMAIL_RESENT" });
  },
  removeUser: async (req, res, next) => {
    const { email } = req.value.body;
    const foundUser = await User.findOne({ where: { email } });
    if (!foundUser) {
      return res.status(404).json({ error: true, message: "USER_NOT_FOUND" });
    } else if (!foundUser.waitingList) {
      return res
        .status(403)
        .json({ error: true, message: "USER_NOT_WAITING_LIST" });
    }
    foundUser.destroy();
    return res
      .status(200)
      .json({ error: false, message: "USER_HAS_BEEN_REMOVED" });
  }
};
