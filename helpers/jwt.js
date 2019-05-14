const JWT = require('jsonwebtoken');
const User = require('../models/Email');
const { JWT_SECRET } = require('../config/index');

/**
 * @desc sign JSON web token
 * @param   {String} [user]
 * @returns {String}
 */
const signToken = user => {
  return JWT.sign(
    {
      iss: 'walletconnect',
      sub: user.uuid,
      iat: Date.now(),
      exp: Date.now() + 1800000 // 30 mins
    },
    JWT_SECRET
  );
};

/**
 * @desc verify and find user middleware
 */
const verifyUserMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  let uuid = null;
  let foundUser = null;
  try {
    const jwt = JWT.verify(token, JWT_SECRET);
    uuid = jwt.sub;
  } catch (error) {
    return res.status(500).json({ error: true, message: 'INVALID_JWT' });
  }
  if (uuid) {
    foundUser = await User.findOne({ where: { uuid } });
  } else {
    return res.status(500).json({ error: true, message: 'MISSING_USER_ID' });
  }
  if (!foundUser) {
    return res.status(404).json({ error: true, message: 'USER_NOT_FOUND' });
  }
  req.foundUser = foundUser;
  next();
};

module.exports = {
  signToken,
  verifyUserMiddleware
};
