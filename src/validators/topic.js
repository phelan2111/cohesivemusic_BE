const logger = require('../utils/logger');
const Enum = require('../data/enum');
const helper = require('../utils/helper');

class TopicValidator {
	hasFullValuesCreate(req, res, next) {
		logger.info('TopicValidator execute hasFullValuesCreate');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, ['topicName']);
		if (isEveryHasValue) {
			next();
		} else {
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesUpdate(req, res, next) {
		logger.info('TopicValidator execute hasFullValuesUpdate');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, ['topicName', 'id']);
		if (isEveryHasValue) {
			next();
		} else {
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesHidden(req, res, next) {
		logger.info('TopicValidator execute hasFullValuesHidden');
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

module.exports = new TopicValidator();
