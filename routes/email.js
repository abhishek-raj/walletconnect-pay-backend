const express = require('express'); //eslint-disable-line
const router = require('express-promise-router')();
const passport = require('passport');
const { verifyUserMiddleware } = require('../helpers/jwt');
const EmailController = require('../controllers/email');

router.route('/verify/:hash').get(EmailController.verify);

router
  .route('/resend-verify')
  .get(
    passport.authenticate('jwt', { session: false }),
    verifyUserMiddleware,
    EmailController.resendVerify
  );

router
  .route('/is-verified')
  .get(
    passport.authenticate('jwt', { session: false }),
    verifyUserMiddleware,
    EmailController.isVerified
  );

module.exports = router;
