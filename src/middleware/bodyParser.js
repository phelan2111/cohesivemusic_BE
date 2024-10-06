const bodyParser = require('body-parser');
const express = require('express');

function BodyParser(app) {
	app.use(express.urlencoded({ extended: true }));
	app.use(bodyParser.json({ limit: '1000mb' }));
}
module.exports = BodyParser;
