import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
  * Hash Password Method
  * @param {string} password
  * @returns {string} returns hashed password
  */
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashPassword = password => bcrypt.hashSync(password, salt);

/**
  * comparePassword
  * @param {string} hashPassword
  * @param {string} password
  * @returns {Boolean} return True or False
  */
const arePasswordsEqual = (hashedPassword, password) => {
	return bcrypt.compareSync(password, hashedPassword);
};

const isNonEmptyString = input => (!!input) && (input.length > 0) && (!Array.isArray(input));

/**
  * Generate Token
  * @param {string} id
  * @returns {string} token
  */
const generateUserToken = (login, id) => jwt.sign({ id, login }, process.env.SECRET, { expiresIn: '3d' });

export {
	arePasswordsEqual,
	generateUserToken,
	hashPassword,
	isNonEmptyString
};
