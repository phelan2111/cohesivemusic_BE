const logger = require('../utils/logger');
const Enum = require('../data/enum');
const helper = require('../utils/helper');

class SingerValidator {
	hasFullValuesCreate(req, res, next) {
		logger.info('SingerValidator execute hasFullValuesCreate');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, ['singerName', 'singerAvatar', 'singerCover', 'singerDescription']);
		if (isEveryHasValue) {
			next();
		} else {
			logger.error('Validator invalid');
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesUpdate(req, res, next) {
		logger.info('SingerValidator execute hasFullValuesUpdate');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, [
			'singerName',
			'singerAvatar',
			'singerCover',
			'singerDescription',
			'id',
		]);
		if (isEveryHasValue) {
			next();
		} else {
			logger.error('Validator invalid');
			res.json({
				...Enum.response.systemError,
			});
		}
	}
}

module.exports = new SingerValidator();
