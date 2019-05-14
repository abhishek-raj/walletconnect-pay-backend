const Email = require('../models/Email');
const { sendVerifyEmail } = require('../helpers/mailgun');

module.exports = {
  resendVerify: async (req, res, next) => {
    const { email } = req.foundUser;
    sendVerifyEmail(email);
    res.status(200).json({ error: false, message: 'VERIFY_EMAIL_SENT' });
  },
  verify: async (req, res, next) => {
    const hash = req.params.hash;
    const email = await Email.findOne({
      where: { hash }
    });
    await email.update({ verified: true });
    res.status(200).json({ error: false, message: 'USER_EMAIL_VERIFIED' });
  },
  isVerified: async (req, res, next) => {
    const { verified } = req.foundUser;
    res.status(200).json({ verified });
  }
};
