const bcrypt = require('bcrypt');

/**
 * @desc validates if password is the same
 * @param  {String}  [password]
 * @param  {String}  [original]
 * @return {Boolean}
 */
const isValidPassword = async (password, original) => {
  const isValid = await bcrypt.compare(password, original);
  return isValid;
};

/**
 * @desc generate password hash
 * @param  {String}  [password]
 * @return {Boolean}
 */
const generatePasswordHash = async password => {
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
};

module.exports = {
  isValidPassword,
  generatePasswordHash
};
