const express = require('express');
const app = express();
const morgan = require('morgan');
const route = require('./routes');
const cors = require('cors');
const mongodb = require('./data/mongoDB');

// example about cors:
// var corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200
// }

// Cors
app.use(cors());

//todo: connect db
mongodb.connect();

//Route
route(app);

app.use(morgan('combined'));

app.listen(8000, () => {
	console.log('Server started on port 8000');
});
