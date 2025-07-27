const ServiceCommon = require('../services/common');
const ServiceSong = require('../services/song');
const ServiceArtist = require('../services/artist');
const Enum = require('../data/enum');
const logger = require('../utils/logger');
const Song = require('../models/song-model');
const SingerOfSong = require('../models/singerOfSong-model');
const Helper = require('../utils/helper');
const helper = require('../utils/helper');
const Singer = require('../models/singer-model');

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
				const singersRecord = singers.map((s) => Singer.findByIdAndUpdate(s?.singerId, { status: Enum.singer.status.active }));

				Promise.all(singersRecord)
					.then(() => {
						genreOfSing.save().then(() => {
							res.json({
								...Enum.response.success,
								data: {
									songId: item._id,
								},
							});
						});
					})
					.catch(() => {
						throw new Error('Not update status singer');
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
				SingerOfSong.find({}).then((singersOfSong) => {
					const dataResponse = songs.map((i) => ServiceSong.convertResponseSong(i));
					for (let i = 0; i < dataResponse.length; i++) {
						const song = dataResponse[i];
						const { index, isExist } = helper.findItem(singersOfSong, 'songId', song.songId.toString());
						if (isExist) {
							dataResponse[i].singers = singersOfSong[index].singers;
						}
					}
					res.json({
						...Enum.response.success,
						data: {
							list: dataResponse,
							total: songs.length,
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
						duration: Math.floor(data?.duration),
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

	//[GET]-[/song/byUserWeb]
	getByUserWeb(req, res, next) {
		const { from, limit, status, search = '', type, ...rest } = req.query;
		const query = Helper.search(
			search,
			Helper.cleanObject({
				status: Enum.song.status.display,
				type,
			}),
		);

		Song.find(query)
			.limit(limit)
			.skip(from)
			.sort(rest)
			.then((songs) => {
				SingerOfSong.find({}).then((singersOfSong) => {
					const dataResponse = songs.map((i) => ServiceSong.convertResponseSong(i));
					for (let i = 0; i < dataResponse.length; i++) {
						const song = dataResponse[i];
						const { index, isExist } = helper.findItem(singersOfSong, 'songId', song.songId.toString());
						if (isExist) {
							dataResponse[i].singers = singersOfSong[index].singers;
						}
					}
					res.json({
						...Enum.response.success,
						data: {
							list: dataResponse,
							total: songs.length,
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

	//[GET]-[/song/byUserWeb/short]
	detailsShort(req, res, next) {
		const { songId } = req.query;

		Song.findOne({ _id: songId })
			.then((songItem) => {
				const dataResponse = ServiceSong.convertResponseSongShort(songItem);
				SingerOfSong.findOne({ songId }).then((singerOfSongItem) => {
					res.json({
						...Enum.response.success,
						data: {
							...dataResponse,
							singers: singerOfSongItem.singers.map((i) => ServiceSong.convertResponseArtistShort(i)),
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
