const Enum = require('../data/enum');
const logger = require('../utils/logger');
const Helper = require('../utils/helper');

class UserValidator {
	hasFullValuesRegister(req, res, next) {
		logger.info('UserValidator execute hasFullValuesRegister');
		const isEveryHasValue = !Helper.isEmptyObjectByValidate(req.body, ['password', 'firstName', 'lastName']);
		if (isEveryHasValue) {
			next();
		} else {
			logger.info('UserValidator not hasFullValuesRegister');
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesLogin(req, res, next) {
		logger.info('UserValidator execute hasFullValuesLogin');
		const isEveryHasValue = !Helper.isEmptyObjectByValidate(req.body, ['password', 'email', 'roles']);
		if (isEveryHasValue) {
			next();
		} else {
			logger.info('UserValidator not hasFullValues');
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesLoginWithBO(req, res, next) {
		logger.info('UserValidator execute hasFullValuesLogin');
		const isEveryHasValue = !Helper.isEmptyObjectByValidate(req.body, ['password', 'email', 'role']);
		const isAdmin = Helper.isAdmin(req.body?.role);
		if (isEveryHasValue && isAdmin) {
			next();
		} else {
			logger.info('UserValidator not hasFullValues');
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesLoginWithGG(req, res, next) {
		logger.info('UserValidator execute hasFullValuesLogin');
		const isEveryHasValue = req.headers?.token;
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
		logger.info('UserValidator execute hasFullValuesDetails');
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
	hasFullValuesUpdate(req, res, next) {
		logger.info('UserValidator execute hasFullValuesUpdate');
		const isEveryHasValue = !Helper.isEmptyObjectByValidate(req.body, ['userId', 'firstName', 'lastName', 'email']);
		if (isEveryHasValue) {
			next();
		} else {
			logger.info('UserValidator not hasFullValues');
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesCreate(req, res, next) {
		logger.info('UserValidator execute hasFullValuesCreate');
		const isEveryHasValue = !Helper.isEmptyObjectByValidate(req.body, [
			'avatar',
			'cover',
			'email',
			'firstName',
			'gender',
			'lastName',
			'role',
		]);
		if (isEveryHasValue) {
			next();
		} else {
			logger.info('UserValidator not hasFullValues');
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesUpdateStatus(req, res, next) {
		logger.info('UserValidator execute hasFullValuesCreate');
		const isEveryHasValue = !Helper.isEmptyObjectByValidate(req.body, ['status', 'userId']);
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
