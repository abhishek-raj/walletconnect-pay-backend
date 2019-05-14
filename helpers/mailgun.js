const Mailgun = require('mailgun-js');
const { DOMAIN, MAILGUN_API_KEY, MAILGUN_DOMAIN } = require('../config/index');

const mailgun = new Mailgun({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN
});

const sendEmail = config =>
  new Promise((resolve, reject) => {
    mailgun.messages().send(config, (error, body) => {
      if (error) {
        reject(error);
      }
      resolve(body);
    });
  });

const sendVerifyEmail = (email, hash) => {
  const template = `
    <html>
      <head><title>WalletConnect Pay - Verify your email</title></head>
      <body style="font-size:16px;font-family:Roboto,sans-serif;font-weight:400;color:#222222;text-align:center;background-color:#F1F1F1">
        <table align="center" width="100%" cellpadding="0" cellspacing="0">
          <tr height="150"><td align="center"><img style="width:35px" src="https://walletconnectpay.com/walletconnect-pay-logo.png" alt="WalletConnect Pay"/></td></tr>
          <tr>
            <td align="center">
              <p style="font-size:20px;font-family:monospace;font-weight:bold">Just one more step.. Verify your email</p>
              <a href="${DOMAIN}/verify/${hash}">
                <button style="border-style:none;border:none;box-sizing:border-box;background-color:#FFF;box-shadow:0 2px 40px 0px rgba(34,34,34,0.1);border-radius:7px;font-size:16px;font-weight:400;font-family:Roboto,sans-serif;padding:10px;margin:10px;width:150px;height:36px;">
                  Submit
                </button>
              </a>
            </td>
          </tr>
          <tr height="100"><td align="center"><a href="#"><!-- empty --></a></td></tr>
        </table>
      </body>
    </html>
  `;
  const config = {
    from: 'WalletConnect Pay <noreply@walletconnectpay.com>',
    to: email,
    subject: 'Verify your email address',
    html: template
  };
  return sendEmail(config);
};

const sendResetPasswordEmail = (email, hash) => {
  const template = `
    <html>
      <head><title>WalletConnect Pay - Reset your password</title></head>
      <body style="font-size:16px;font-family:Roboto,sans-serif;font-weight:400;color:#222222;text-align:center;background-color:#F1F1F1">
        <table align="center" width="100%" cellpadding="0" cellspacing="0">
          <tr height="150"><td align="center"><img style="width:35px" src="https://walletconnectpay.com/walletconnect-pay-logo.png" alt="WalletConnect Pay"/></td></tr>
          <tr>
            <td align="center">
              <p style="font-size:20px;font-family:monospace;font-weight:bold">You have requested a password reset. Click bellow to change password:</p>
              <a href="${DOMAIN}/change-password?q=${hash}">
                <button style="border-style:none;border:none;box-sizing:border-box;background-color:#FFF;box-shadow:0 2px 40px 0px rgba(34,34,34,0.1);border-radius:7px;font-size:16px;font-weight:400;font-family:Roboto,sans-serif;padding:10px;margin:10px;width:150px;height:36px;">
                  Submit
                </button>
              </a>
              <p style="font-size:12px; opacity: 0.7;">If you didn't request a password reset, please click us at support@walletconnectpay.com</p>
            </td>
          </tr>
          <tr height="100"><td align="center"><a href="#"><!-- empty --></a></td></tr>
        </table>
      </body>
    </html>
  `;
  const config = {
    from: 'WalletConnect Pay <noreply@walletconnectpay.com>',
    to: email,
    subject: 'Reset your password',
    html: template
  };
  return sendEmail(config);
};

const sendInviteWaitingList = (email, hash) => {
  const template = `
    <html>
      <head><title>WalletConnect Pay - Invite to Closed Beta</title></head>
      <body style="font-size:16px;font-family:Roboto,sans-serif;font-weight:400;color:#222222;text-align:center;background-color:#F1F1F1">
        <table align="center" width="100%" cellpadding="0" cellspacing="0">
          <tr height="150"><td align="center"><img style="width:35px" src="https://walletconnectpay.com/walletconnect-pay-logo.png" alt="WalletConnect Pay"/></td></tr>
          <tr>
            <td align="center">
              <p style="font-size:20px;font-family:monospace;font-weight:bold">You've been invited to WalletConnect Pay Beta</p>
              <p style="font-size:20px;font-family:monospace;font-weight:bold">Click bellow to choose a new password</p>
              <a href="${DOMAIN}/change-password?q=${hash}">
                <button style="border-style:none;border:none;box-sizing:border-box;background-color:#FFF;box-shadow:0 2px 40px 0px rgba(34,34,34,0.1);border-radius:7px;font-size:16px;font-weight:400;font-family:Roboto,sans-serif;padding:10px;margin:10px;width:150px;height:36px;">
                  Submit
                </button>
              </a>
            </td>
          </tr>
          <tr height="100"><td align="center"><a href="#"><!-- empty --></a></td></tr>
        </table>
      </body>
    </html>
  `;
  const config = {
    from: 'WalletConnect Pay <noreply@walletconnectpay.com>',
    to: email,
    subject: 'Invite to Closed Beta',
    html: template
  };
  return sendEmail(config);
};

module.exports = {
  sendVerifyEmail,
  sendResetPasswordEmail,
  sendInviteWaitingList
};
