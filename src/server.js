const express = require('express');
const app = express();
const route = require('./routes');
const cors = require('cors');
const mongodb = require('./data/mongoDB');
const MorganMiddleware = require('./middleware/morgan');
const AuthService = require('./middleware/auth');
const bodyParser = require('body-parser');

//morgan
MorganMiddleware(app);

// Cors
app.use(cors());

// Check auth
AuthService(app);

//todo: connect db
mongodb.connect();

//bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Route
route(app);

app.listen(8000, () => {
	console.log('Server started on port 8000');
});
