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
				console.log('password', password, user.password);

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
	convertResponseGenre(dataItem) {
		return {
			createdAt: dataItem.createdAt,
			email: dataItem.email,
			firstName: dataItem.firstName,
			lastName: dataItem.lastName,
			role: dataItem.role,
			status: dataItem.status,
			updatedAt: dataItem.updatedAt,
			userId: dataItem._id,
			avatar: dataItem?.avatar,
			address: dataItem?.address,
			gender: dataItem?.gender,
			cover: dataItem?.cover,
		};
	}
}
module.exports = new ServiceUser();
