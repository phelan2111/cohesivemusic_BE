const userRouter = require('./user-router')
function route(app) {
    app.use('/product', userRouter);
}

module.exports = route;