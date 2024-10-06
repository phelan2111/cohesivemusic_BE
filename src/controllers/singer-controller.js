const ServiceCommon = require('../services/common');
const Enum = require('../data/enum');
const logger = require('../utils/logger');
const Singer = require('../models/singer-model');

class SingerController {
	//[PUT]-[/singer]
	create(req, res, next) {
		const dataBody = req.body;
		const singer = new Singer({
			...dataBody,
			followers: 0,
		});
		singer
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

	//[GET]-[/singer]
	get(req, res, next) {
		Singer.find({})
			.then((singers) => {
				res.json({
					...Enum.response.success,
					data: {
						list: singers,
						total: singers.length,
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

	//[POST]-[/singer]
	update(req, res, next) {
		const { id, ...rest } = req.body;

		Singer.findByIdAndUpdate(id, rest)
			.then((singerItem) => {
				res.json({
					...Enum.response.success,
					data: {
						id: singerItem._id.toString(),
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

	//[POST]-[/browse/uploadAvatar]
	uploadAvatar(req, res, next) {
		logger.info('Controller browse execute upload image username');
		logger.debug('Controller browse get request from client', req.file);

		ServiceCommon.uploadImage(req.file.path, {
			folder: 'singer/image',
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

	//[POST]-[/browse/uploadCover]
	uploadCovers(req, res, next) {
		logger.info('Controller browse execute upload image username');
		logger.debug('Controller browse get request from client', req.files);
		const promises = req.files.map(async (file) => {
			return await ServiceCommon.uploadImage(file.path, {
				folder: 'singer/image',
				use_filename: true,
			});
		});

		Promise.all(promises)
			.then((data) => {
				const dataRes = data.map((item) => ({
					link: item.url,
					name: item.original_filename,
					createAt: new Date(item.created_at).getTime(),
				}));
				res.json({
					...Enum.response.success,
					data: dataRes,
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

module.exports = new SingerController();
