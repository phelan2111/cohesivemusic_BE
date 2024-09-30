const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const User = require('../models/user-model');
const Enum = require('../data/enum');

class ServiceUser {
	hasPassword(req, res, next) {
		logger.info('UserValidator execute hasPassword');
		const { password } = req.body;
		const hasPassword = bcrypt.hash(password, 10);
		hasPassword
			.then((pass) => {
				req.body.password = pass;
				next();
			})
			.catch(() => {
				logger.error('UserValidator execute hasPassword failed');
				res.json({
					...Enum.response.systemError,
				});
			});
	}
	comparePassword(req, res, next) {
		const { password, email } = req.body;
		User.findOne({ email })
			.then((user) => {
				const compare = bcrypt.compare(password, user.password);

				compare
					.then((isEqual) => {
						if (isEqual) {
							req.body.id = user._id.toString();
							next();
						} else {
							res.json({
								...Enum.user.wrongPassword,
							});
						}
					})
					.catch((error) => {
						logger.error('UserValidator execute comparePassword failed!', error);
						res.json({
							...Enum.response.systemError,
						});
					});
			})
			.catch(() => {
				logger.error('UserValidator execute comparePassword do not user in system!');
				res.json({
					...Enum.user.userHasNotExistedInSystem,
				});
			});
	}
}
module.exports = new ServiceUser();
