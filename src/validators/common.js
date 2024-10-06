const Enum = require('../data/enum');
const logger = require('../utils/logger');

class CommonValidator {
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
}
module.exports = new CommonValidator();
