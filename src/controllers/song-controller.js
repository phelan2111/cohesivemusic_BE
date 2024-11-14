const ServiceCommon = require('../services/common');
const ServiceSong = require('../services/song');
const ServiceArtist = require('../services/artist');
const Enum = require('../data/enum');
const logger = require('../utils/logger');
const Song = require('../models/song-model');
const SingerOfSong = require('../models/singerOfSong-model');
const Helper = require('../utils/helper');

class SongController {
	//[PUT]-[/song]
	create(req, res, next) {
		const { singers, ...rest } = req.body;
		const song = new Song({
			...rest,
			views: 0,
			status: Enum.song.status.display,
		});
		song
			.save()
			.then((item) => {
				const genreOfSing = new SingerOfSong({
					songId: item._id,
					singers,
				});
				genreOfSing.save().then(() => {
					res.json({
						...Enum.response.success,
						data: {
							songId: item._id,
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

	//[GET]-[/song]
	get(req, res, next) {
		const { from, limit, status, search = '', ...rest } = req.query;
		const query = Helper.search(
			search,
			Helper.cleanObject({
				status,
			}),
		);

		Song.find(query)
			.limit(limit)
			.skip(from)
			.sort(rest)
			.then((songs) => {
				res.json({
					...Enum.response.success,
					data: {
						list: songs.map((i) => ServiceSong.convertResponseSong(i)),
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
		const { songId, ...rest } = req.body;

		Song.findByIdAndUpdate(songId, rest)
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
	//[DELETE]-[/song]
	updateStatus(req, res, next) {
		const { songId, status } = req.body;

		Song.findByIdAndUpdate(songId, { status })
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

	//[POST]-[/song/upload]
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

		ServiceCommon.uploadVideo(req.file.path, {
			folder: 'song/media',
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

	//[GET]-[/song/details]
	details(req, res, next) {
		const { songId } = req.query;

		Song.findOne({ _id: songId })
			.then((songItem) => {
				const dataResponse = ServiceSong.convertResponseSong(songItem);
				SingerOfSong.findOne({ songId }).then((singerOfSongItem) => {
					res.json({
						...Enum.response.success,
						data: {
							...dataResponse,
							singer: singerOfSongItem.singers.map((i) => ServiceArtist.convertResponseArtist(i)),
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

module.exports = new SongController();
