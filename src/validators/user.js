const Enum = require('../data/enum');
const logger = require('../utils/logger');
const Helper = require('../utils/helper');

class UserValidator {
	isLoggedIn(req, res, next) {
		if (req.user) {
			logger.info('UserValidator execute isLoggedIn success');
			next();
		} else {
			logger.info('UserValidator execute isLoggedIn do not token');
			res.json({
				...Enum.response.unauthorized,
			});
		}
	}
	hasFullValues(req, res, next) {
		logger.info('UserValidator execute hasFullValues');
		const isEveryHasValue = !Helper.isEmptyObject(req.body);
		if (isEveryHasValue) {
			next();
		} else {
			res.json({
				...Enum.response.systemError,
			});
		}
	}
}

module.exports = new UserValidator();
