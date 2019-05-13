const database = require('./database');

switch (process.env.NODE_ENV) {
  case 'development':
    module.exports = {
      LOGGER: 'dev',
      ETHEREUM_NETWORK: 'ropsten',
      HTTP_PROVIDER: 'https://ropsten.infura.io/',
      DOMAIN: 'http://localhost:3000',
      DATABASE: database,
      KEYSTORE_HASH:
        '3404d2ad4a7722a3b596cc67523c9fd8264620441bf5eb44b4b35e8c44299c43',
      JWT_SECRET: 'YmFsYW5jZWN1c3RvZGlhbGRldmVsb3BtZW50',
      VERIFY_SECRET: 'dmVyaWZ5dGhp',
      MAILGUN_API_KEY: 'key-d0ac9f3f77006342362f89c4324afefb',
      MAILGUN_DOMAIN: 'dev.walletconnectpay.com'
    };
    break;
  case 'staging':
    module.exports = {
      LOGGER: 'dev',
      ETHEREUM_NETWORK: 'ropsten',
      HTTP_PROVIDER: 'https://ropsten.infura.io/',
      DOMAIN: 'https://walletconnectpay.com',
      DATABASE: database,
      KEYSTORE_HASH: process.env.WALLETCONNECT_PAYKEYSTORE_HASH_STAGING,
      JWT_SECRET: process.env.WALLETCONNECT_PAYJWT_STAGING,
      VERIFY_SECRET: process.env.WALLETCONNECT_PAYVERIFY_SECRET_STAGING,
      MAILGUN_API_KEY: process.env.WALLETCONNECT_PAYMAILGUN_API_KEY,
      MAILGUN_DOMAIN: 'mg.walletconnectpay.com'
    };
    break;
  case 'production':
    module.exports = {
      LOGGER: 'common',
      ETHEREUM_NETWORK: 'mainnet',
      HTTP_PROVIDER: 'https://mainnet.infura.io/',
      DOMAIN: 'https://walletconnectpay.com',
      DATABASE: database,
      KEYSTORE_HASH: process.env.WALLETCONNECT_PAYKEYSTORE_HASH_PRODUCTION,
      JWT_SECRET: process.env.WALLETCONNECT_PAYJWT_PRODUCTION,
      VERIFY_SECRET: process.env.WALLETCONNECT_PAYVERIFY_SECRET_PRODUCTION,
      MAILGUN_API_KEY: process.env.WALLETCONNECT_PAYMAILGUN_API_KEY,
      MAILGUN_DOMAIN: 'mg.walletconnectpay.com'
    };
    break;
  default:
    console.error('Unrecognized NODE_ENV: ' + process.env.NODE_ENV); // eslint-disable-line
}
