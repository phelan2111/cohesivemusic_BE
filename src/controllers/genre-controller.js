const ServiceCommon = require('../services/common');
const Enum = require('../data/enum');
const logger = require('../utils/logger');
const Genre = require('../models/genre-model');
const Helper = require('../utils/helper');
const ServiceTopic = require('../services/topic');
const ServiceGenre = require('../services/genre');

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
		const { genreId, ...rest } = req.body;

		Genre.findByIdAndUpdate(genreId, rest)
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
		const { genreId, status } = req.body;

		Genre.findByIdAndUpdate(genreId, { status })
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

	//[POST]-[/browse/genre/details]
	getDetails(req, res, next) {
		const { genreId } = req.query;

		Genre.findOne({ _id: genreId })
			.then((genreItem) => {
				ServiceTopic.getTopicDetailsByTopicId(genreItem.topicId).then((topicItem) => {
					res.json({
						...Enum.response.success,
						data: {
							...ServiceGenre.convertResponseGenre(genreItem),
							topic: ServiceTopic.convertResponseTopic(topicItem),
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
}

module.exports = new GenreController();
