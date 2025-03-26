const logger = require('../utils/logger');
const User = require('../models/user-model');
const Enum = require('../data/enum');
const Singer = require('../models/singer-model');
const Song = require('../models/song-model');
const Playlist = require('../models/playlist-model');
const Genre = require('../models/genre-model');
const Topic = require('../models/topic-model');

class GenreController {
	//[GET]-[/other/summary]
	async summary(req, res, next) {
		try {
			const user = {
				active: await User.countDocuments({ status: Enum.user.status.active }).exec(),
				inActive: await User.countDocuments({ status: Enum.user.status.inActive }).exec(),
				lock: await User.countDocuments({ status: Enum.user.status.lock }).exec(),
				all: await User.countDocuments().exec(),
			};
			const singer = {
				lock: await Singer.countDocuments({ status: Enum.singer.status.active }).exec(),
				active: await Singer.countDocuments({ status: Enum.singer.status.inActive }).exec(),
				inActive: await Singer.countDocuments({ status: Enum.singer.status.lock }).exec(),
				all: await Singer.countDocuments().exec(),
			};
			const song = {
				hidden: await Song.countDocuments({ status: Enum.song.status.hidden }).exec(),
				display: await Song.countDocuments({ status: Enum.song.status.display }).exec(),
				all: await Song.countDocuments().exec(),
			};
			const playlist = {
				hidden: await Playlist.countDocuments({ status: Enum.playList.status.hidden }).exec(),
				display: await Playlist.countDocuments({ status: Enum.song.status.display }).exec(),
				all: await Playlist.countDocuments().exec(),
			};
			const genre = {
				hidden: await Genre.countDocuments({ status: Enum.genre.status.hidden }).exec(),
				display: await Genre.countDocuments({ status: Enum.genre.status.display }).exec(),
				all: await Genre.countDocuments().exec(),
			};
			const topic = {
				hidden: await Topic.countDocuments({ status: Enum.topic.status.hidden }).exec(),
				display: await Topic.countDocuments({ status: Enum.topic.status.display }).exec(),
				all: await Topic.countDocuments().exec(),
			};

			res.json({
				...Enum.response.success,
				data: {
					user,
					singer,
					song,
					playlist,
					genre,
					topic,
				},
			});
		} catch (error) {
			logger.error(error);
			res.json({
				...Enum.response.systemError,
			});
		}
	}
}

module.exports = new GenreController();
