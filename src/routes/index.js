const userRouter = require('./user-router')
const GenreRouter = require('./genre-router');
const TopicRouter = require('./topic-router');
const SingerRouter = require('./singer-router');

function route(app) {
	app.use('/user', userRouter);
	app.use('/genre', GenreRouter);
	app.use('/topic', TopicRouter);
	app.use('/singer', SingerRouter);
}

module.exports = route;