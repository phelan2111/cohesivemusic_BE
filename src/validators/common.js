const Enum = require('../data/enum');
const logger = require('../utils/logger');
const User = require('../models/user-model');

class CommonValidator {
	isLoggedIn(req, res, next) {
		if (req.user) {
			logger.info('UserValidator execute isLoggedIn success');
			const { email } = req.user;
			User.findOne({ email }).then((user) => {
				const hasLoggedAtOtherPlace = req.headers.token === user?.token;
				if (hasLoggedAtOtherPlace) {
					next();
				} else {
					res.json({
						...Enum.response.unauthorized,
					});
				}
			});
		} else {
			logger.info('UserValidator execute isLoggedIn do not token');
			res.json({
				...Enum.response.unauthorized,
			});
		}
	}
	isValidToken(req, res, next) {
		if (req.user) {
			logger.info('UserValidator execute isLoggedIn success');
			const hasToken = req.headers.token;
			if (hasToken) {
				next();
			} else {
				res.json({
					...Enum.response.unauthorized,
				});
			}
		} else {
			logger.info('UserValidator execute isLoggedIn do not token');
			res.json({
				...Enum.response.unauthorized,
			});
		}
	}
}
module.exports = new CommonValidator();
