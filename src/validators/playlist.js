const logger = require('../utils/logger');
const Enum = require('../data/enum');
const helper = require('../utils/helper');

class PlaylistValidators {
	hasFullValuesCreate(req, res, next) {
		logger.info('PlaylistValidators execute hasFullValuesCreate');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, ['namePlaylist', 'descriptionPlaylist', 'image', 'songs', 'theme']);
		if (isEveryHasValue) {
			next();
		} else {
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesGet(req, res, next) {
		logger.info('PlaylistValidators execute hasFullValuesGet');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.query, ['limit', 'from', 'status']);
		if (isEveryHasValue) {
			next();
		} else {
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesDetails(req, res, next) {
		logger.info('PlaylistValidators execute hasFullValuesDetails');
		logger.debug('PlaylistValidators execute hasFullValuesDetails query', req.query);
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.query, ['playlistId']);
		if (isEveryHasValue) {
			next();
		} else {
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesUpdateStatus(req, res, next) {
		logger.info('PlaylistValidators execute hasFullValuesUpdateStatus');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, ['playlistId', 'status']);
		if (isEveryHasValue) {
			next();
		} else {
			res.json({
				...Enum.response.systemError,
			});
		}
	}
	hasFullValuesUpdate(req, res, next) {
		logger.info('PlaylistValidators execute hasFullValuesUpdateStatus');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.body, [
			'playlistId',
			'namePlaylist',
			'descriptionPlaylist',
			'image',
			'songs',
			'theme',
		]);
		if (isEveryHasValue) {
			next();
		} else {
			res.json({
				...Enum.response.systemError,
			});
		}
	}

	//User
	hasFullValuesGetByUser(req, res, next) {
		logger.info('PlaylistValidators execute hasFullValuesGetByUser');
		const isEveryHasValue = !helper.isEmptyObjectByValidate(req.query, ['limit', 'from']);
		if (isEveryHasValue) {
			next();
		} else {
			res.json({
				...Enum.response.systemError,
			});
		}
	}
}

module.exports = new PlaylistValidators();
