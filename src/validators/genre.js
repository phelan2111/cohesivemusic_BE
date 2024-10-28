const logger = require('../utils/logger');
const Enum = require('../data/enum');
const helper = require('../utils/helper');

class GenreValidator {
	hasFullValuesCreate(req, res, next) {
		logger.info('GenreValidator execute hasFullValues');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, ['nameGenre', 'imageGenre', 'topicId']);
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
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, ['nameGenre', 'imageGenre', 'topicId', 'genreId']);
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
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, ['genreId', 'status']);
		if (isEveryHasValue) {
			next();
		} else {
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesGetDetails(req, res, next) {
		logger.info('TopicValidator execute hasFullValuesGetDetails');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.query, ['genreId']);
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
