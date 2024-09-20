const express = require('express');
const app = express();
const route = require('./routes');
const cors = require('cors');
const mongodb = require('./data/mongoDB');
const morganMiddleware = require('./middleware/morgan');

//morgan
morganMiddleware(app);

// Cors
app.use(cors());

//todo: connect db
mongodb.connect();

//Route
route(app);


app.listen(8000, () => {
	console.log('Server started on port 8000');
});
