const bcrypt = require('bcrypt');

/**
 * @desc validates if value is the same
 * @param  {String}  [value]
 * @param  {String}  [original]
 * @return {Boolean}
 */
const isValidHash = async (value, original) => {
  const isValid = await bcrypt.compare(value, original);
  return isValid;
};

/**
 * @desc generate value hash
 * @param  {String}  [value]
 * @return {Boolean}
 */
const generateHash = async value => {
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(value, salt);
  return passwordHash;
};

module.exports = {
  isValidHash,
  generateHash
};
