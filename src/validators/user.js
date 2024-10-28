const Enum = require('../data/enum');
const logger = require('../utils/logger');
const Helper = require('../utils/helper');

class UserValidator {
	hasFullValuesRegister(req, res, next) {
		logger.info('UserValidator execute hasFullValues');
		const isEveryHasValue = !Helper.isEmptyObjectByValidate(req.body, ['password', 'firstName', 'lastName']);
		if (isEveryHasValue) {
			next();
		} else {
			logger.info('UserValidator not hasFullValues');
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesLogin(req, res, next) {
		logger.info('UserValidator execute hasFullValues');
		const isEveryHasValue = !Helper.isEmptyObjectByValidate(req.body, ['password', 'email']);
		if (isEveryHasValue) {
			next();
		} else {
			logger.info('UserValidator not hasFullValues');
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesDetails(req, res, next) {
		logger.info('UserValidator execute hasFullValues');
		const isEveryHasValue = !Helper.isEmptyObjectByValidate(req.query, ['userId']);
		if (isEveryHasValue) {
			next();
		} else {
			logger.info('UserValidator not hasFullValues');
			res.json({
				...Enum.response.systemError,
			});
		}
	}
}

module.exports = new UserValidator();
