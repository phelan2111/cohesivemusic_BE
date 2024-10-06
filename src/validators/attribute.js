const logger = require('../utils/logger');
const Enum = require('../data/enum');
const helper = require('../utils/helper');

class AttributeValidator {
	hasFullValuesCreate(req, res, next) {
		logger.info('AttributeValidator execute hasFullValuesCreate');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, ['attributeName', 'attributeImage']);
		if (isEveryHasValue) {
			next();
		} else {
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesUpdate(req, res, next) {
		logger.info('AttributeValidator execute hasFullValuesUpdate');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, ['attributeName', 'attributeImage', 'id']);
		if (isEveryHasValue) {
			next();
		} else {
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesHidden(req, res, next) {
		logger.info('AttributeValidator execute hasFullValuesHidden');
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

module.exports = new AttributeValidator();
