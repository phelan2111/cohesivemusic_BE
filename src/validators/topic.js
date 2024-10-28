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
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, ['topicName', 'topicId']);
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
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, ['topicId', 'status']);
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
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.query, ['topicId']);
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
