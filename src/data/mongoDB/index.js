const mongoose = require('mongoose');
const config = require('../../config');

async function connect() {
	console.log(
		`mongodb+srv://${config.development.db.username}:${config.development.db.password}@music.8qvgt.mongodb.net/cohesive?retryWrites=true&w=majority&appName=music`,
	);
	await mongoose
		.connect(
			`mongodb+srv://${config.development.db.username}:${config.development.db.password}@music.8qvgt.mongodb.net/cohesive?retryWrites=true&w=majority&appName=music`,
		)
		.then(() => {
			console.log('Connect successfully');
		})
		.catch((error) => {
			console.log('Do not connect to server...', error);
		});
}

module.exports = { connect };
