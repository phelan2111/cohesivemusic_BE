const ServiceCommon = require('../services/common');
const ServiceArtist = require('../services/artist');
const Enum = require('../data/enum');
const logger = require('../utils/logger');
const Singer = require('../models/singer-model');
const GenreOfSinger = require('../models/genreOfSinger-model');
const ServiceGenre = require('../services/genre');
const Helper = require('../utils/helper');

class SingerController {
	//[PUT]-[/singer]
	create(req, res, next) {
		const { genres, ...rest } = req.body;
		const singer = new Singer({
			...rest,
			followers: 0,
			status: Enum.singer.status.inActive,
		});
		singer
			.save()
			.then((item) => {
				const genreOfSing = new GenreOfSinger({
					singerId: item._id,
					genres,
				});
				genreOfSing
					.save()
					.then(() => {
						res.json({
							...Enum.response.success,
							data: {
								singerId: item._id,
							},
						});
					})
					.catch((error) => {
						logger.error(error);
						res.json({
							...Enum.response.systemError,
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

	//[GET]-[/singer]
	get(req, res, next) {
		const { from, limit, status, search = '', ...rest } = req.query;
		const query = Helper.search(
			search,
			Helper.cleanObject({
				status,
			}),
		);

		Singer.find(query)
			.limit(limit)
			.skip(from)
			.sort(rest)
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
		const { singerId, ...rest } = req.body;

		Singer.findByIdAndUpdate(singerId, rest)
			.then((singerItem) => {
				GenreOfSinger.findOneAndUpdate({ singerId }, { genres: rest.genres })
					.then(() => {
						res.json({
							...Enum.response.success,
							data: {
								id: singerItem._id.toString(),
							},
						});
					})
					.catch(() => {
						logger.error(error);
						res.json({
							...Enum.response.systemError,
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

	//[POST]-[/singer/uploadAvatar]
	uploadAvatar(req, res, next) {
		logger.info('Controller singer execute upload image username');
		logger.debug('Controller singer get request from client', req.file);

		ServiceCommon.uploadImage(req.file.path, {
			folder: 'singer/image/avatar',
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

	//[POST]-[/singer/uploadCover]
	uploadCovers(req, res, next) {
		logger.info('Controller singer execute upload image username');
		logger.debug('Controller singer get request from client', req.files);
		const promises = req.files.map(async (file) => {
			return await ServiceCommon.uploadImage(file.path, {
				folder: 'singer/image/cover',
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

	//[DELETE]-[/singer]
	updateStatus(req, res, next) {
		const { singerId, status } = req.body;

		Singer.findByIdAndUpdate(singerId, { status })
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

	//[GET]-[/singer/details]
	details(req, res, next) {
		const { artistId } = req.query;

		Singer.findOne({ _id: artistId })
			.then((singerItem) => {
				const dataResponse = ServiceArtist.convertResponseArtist(singerItem);
				GenreOfSinger.findOne({ singerId: artistId }).then((genreOfSingerItem) => {
					res.json({
						...Enum.response.success,
						data: {
							...dataResponse,
							genres: genreOfSingerItem.genres.map((i) => ServiceGenre.convertGenreForSinger(i)),
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

	//[GET]-[/singer/byUserWeb]
	getByUserWeb(req, res, next) {
		const { from, limit, search = '', ...rest } = req.query;
		const query = Helper.search(
			search,
			Helper.cleanObject({
				status: Enum.singer.status.active,
			}),
		);

		Singer.find(query)
			.limit(limit)
			.skip(from)
			.sort(rest)
			.then((singers) => {
				res.json({
					...Enum.response.success,
					data: {
						list: singers.map((s) => ServiceArtist.convertResponseArtist(s)),
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
}

module.exports = new SingerController();
