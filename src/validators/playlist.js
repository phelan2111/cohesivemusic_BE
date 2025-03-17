const logger = require('../utils/logger');
const Enum = require('../data/enum');
const helper = require('../utils/helper');

class PlaylistValidators {
	hasFullValuesCreate(res, req, next) {
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
}

module.exports = new PlaylistValidators();
