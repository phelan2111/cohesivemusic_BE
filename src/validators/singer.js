const logger = require('../utils/logger');
const Enum = require('../data/enum');
const helper = require('../utils/helper');

class SingerValidator {
	hasFullValuesCreate(req, res, next) {
		logger.info('SingerValidator execute hasFullValuesCreate');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, ['singerName', 'singerAvatar', 'singerCover', 'singerDescription', 'genres']);
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
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, ['singerId']);
		if (isEveryHasValue) {
			next();
		} else {
			logger.error('Validator invalid');
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesDetails(req, res, next) {
		logger.info('SingerValidator execute hasFullValuesDetails');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.query, ['artistId']);
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
