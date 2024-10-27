const ServiceCommon = require('../services/common');
const Enum = require('../data/enum');
const logger = require('../utils/logger');
const Genre = require('../models/genre-model');
const Helper = require('../utils/helper');

class GenreController {
	//[PUT]-[/genre]
	create(req, res, next) {
		const dataBody = req.body;
		const genre = new Genre({
			...dataBody,
			status: Enum.genre.status.display,
		});
		genre
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

	//[GET]-[/genre]
	get(req, res, next) {
		const { from, limit, status = Enum.genre.status.display, search = '', ...rest } = req.query;

		const query = Helper.search(search, {
			status,
		});

		Genre.find(query)
			.limit(limit)
			.skip(from)
			.sort(rest)
			.then((genres) => {
				Genre.countDocuments(query)
					.exec()
					.then((total) => {
						res.json({
							...Enum.response.success,
							data: {
								list: genres,
								total,
							},
						});
					});
			})
			.catch((error) => {
				logger.error(error);
				res.json({
					...Enum.response.systemError,
				});
			});
	}

	//[POST]-[/genre]
	update(req, res, next) {
		const { id, ...rest } = req.body;

		Genre.findByIdAndUpdate(id, rest)
			.then((genreItem) => {
				res.json({
					...Enum.response.success,
					data: genreItem,
				});
			})
			.catch((error) => {
				logger.error(error);
				res.json({
					...Enum.response.systemError,
				});
			});
	}

	//[DELETE]-[/genre]
	updateStatus(req, res, next) {
		const { id, status } = req.body;

		Genre.findByIdAndUpdate(id, { status })
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

	//[POST]-[/genre/uploadImage]
	uploadImage(req, res, next) {
		logger.info('Controller genre execute upload image username');
		logger.debug('Controller genre get request from client', req.file);

		ServiceCommon.uploadImage(req.file.path, {
			folder: 'genre/image',
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

module.exports = new GenreController();
