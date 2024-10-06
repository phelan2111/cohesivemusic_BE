const ServiceCommon = require('../services/common');
const Enum = require('../data/enum');
const logger = require('../utils/logger');
const Browse = require('../models/brwose-model');

class BrowserController {
	//[PUT]-[/browse]
	create(req, res, next) {
		const dataBody = req.body;
		const browse = new Browse({
			...dataBody,
			status: Enum.browse.status.display,
		});
		browse
			.save()
			.then(() => {
				res.json({
					...Enum.response.success,
				});
			})
			.catch((error) => {
				logger.error(error);
				res.json({
					...Enum.response.systemError,
				});
			});
	}

	//[GET]-[/browse]
	get(req, res, next) {
		Browse.find({ status: Enum.browse.status.display })
			.then((browses) => {
				res.json({
					...Enum.response.success,
					data: {
						list: browses,
						total: browses.length,
					},
				});
			})
			.catch((error) => {
				logger.error(error);
				res.json({
					...Enum.response.systemError,
				});
			});
	}

	//[POST]-[/browse]
	update(req, res, next) {
		const { id, ...rest } = req.body;

		Browse.findByIdAndUpdate(id, rest)
			.then((browseItem) => {
				res.json({
					...Enum.response.success,
					data: browseItem,
				});
			})
			.catch((error) => {
				logger.error(error);
				res.json({
					...Enum.response.systemError,
				});
			});
	}

	//[DELETE]-[/browse]
	updateStatus(req, res, next) {
		const { id, status } = req.body;

		Browse.findByIdAndUpdate(id, { status })
			.then(() => {
				res.json({
					...Enum.response.success,
				});
			})
			.catch((error) => {
				logger.error(error);
				res.json({
					...Enum.response.systemError,
				});
			});
	}

	//[POST]-[/browse/uploadImage]
	uploadImage(req, res, next) {
		logger.info('Controller browse execute upload image username');
		logger.debug('Controller browse get request from client', req.file);

		ServiceCommon.uploadImage(req.file.path, {
			folder: 'browse/image',
			use_filename: true,
		})
			.then((data) => {
				res.json({
					...Enum.response.success,
					data: {
						link: data.url,
						name: data.original_filename,
						createAt: new Date(data.created_at).getTime(),
					},
				});
			})
			.catch((error) => {
				logger.error(error);

				res.json({
					...Enum.response.systemError,
				});
			});
	}
}

module.exports = new BrowserController();
