const logger = require('../utils/logger');
const Enum = require('../data/enum');
const helper = require('../utils/helper');

class GenreValidator {
	hasFullValuesCreate(req, res, next) {
		logger.info('GenreValidator execute hasFullValues');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, ['nameGenre', 'imageGenre']);
		if (isEveryHasValue) {
			next();
		} else {
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesUpdate(req, res, next) {
		logger.info('GenreValidator execute hasFullValues');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, ['nameGenre', 'imageGenre', 'id']);
		if (isEveryHasValue) {
			next();
		} else {
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesHidden(req, res, next) {
		logger.info('GenreValidator execute hasFullValues');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, ['id', 'status']);
		if (isEveryHasValue) {
			next();
		} else {
			res.json({
				...Enum.response.systemError,
			});
		}
	}
}

module.exports = new GenreValidator();
