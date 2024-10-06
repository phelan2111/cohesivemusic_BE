const ServiceCommon = require('../services/common');
const Enum = require('../data/enum');
const logger = require('../utils/logger');
const Song = require('../models/song-model');

class SongController {
	//[PUT]-[/song]
	create(req, res, next) {
		const dataBody = req.body;
		const song = new Song({
			...dataBody,
			views: 0,
		});
		song
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

	//[GET]-[/song]
	get(req, res, next) {
		Song.find({})
			.then((songs) => {
				res.json({
					...Enum.response.success,
					data: {
						list: songs,
						total: songs.length,
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

	//[POST]-[/song]
	update(req, res, next) {
		const { id, ...rest } = req.body;

		Song.findByIdAndUpdate(id, rest)
			.then((songItem) => {
				res.json({
					...Enum.response.success,
					data: {
						id: songItem._id.toString(),
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

	//[POST]-[/browse/upload]
	uploadImage(req, res, next) {
		logger.info('Controller browse execute upload image username');
		logger.debug('Controller browse get request from client', req.file);

		ServiceCommon.uploadImage(req.file.path, {
			folder: 'song/image',
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

	//[POST]-[/browse/uploadMedia]
	uploadMedia(req, res, next) {
		logger.info('Controller browse execute upload image username');
		logger.debug('Controller browse get request from client', req.file);

		ServiceCommon.uploadImage(req.file.path, {
			folder: 'song/image',
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

module.exports = new SongController();
