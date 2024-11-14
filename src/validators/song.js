const logger = require('../utils/logger');
const Enum = require('../data/enum');
const helper = require('../utils/helper');

class SongValidator {
	hasFullValuesCreate(req, res, next) {
		logger.info('SongValidator execute hasFullValuesCreate');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, [
			'songName',
			'image',
			'songDescription',
			'singers',
			'link',
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
	hasFullValuesUpdate(req, res, next) {
		logger.info('SongValidator execute hasFullValuesUpdate');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, ['songId']);
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
		logger.info('SongValidator execute hasFullValuesUpdate');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.query, ['songId']);
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

module.exports = new SongValidator();
