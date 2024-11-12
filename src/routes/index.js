const userRouter = require('./user-router')
const GenreRouter = require('./genre-router');
const TopicRouter = require('./topic-router');
const SingerRouter = require('./singer-router');
const SongRouter = require('./song-router');

function route(app) {
	app.use('/user', userRouter);
	app.use('/browse/genre', GenreRouter);
	app.use('/browse/topic', TopicRouter);
	app.use('/singer', SingerRouter);
	app.use('/song', SongRouter);
}

module.exports = route;