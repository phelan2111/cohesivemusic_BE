const Enum = require('../data/enum');
const logger = require('../utils/logger');
const Topic = require('../models/topic-model');

class TopicController {
	//[PUT]-[/Topic]
	create(req, res, next) {
		const dataBody = req.body;
		const topic = new Topic({
			...dataBody,
			status: Enum.topic.status.display,
		});
		topic
			.save()
			.then(() => {
				res.json({
					...Enum.response.success,
				});
			})
			.catch((error) => {
				logger.error(error);
				res.json({
					...Enum.response.systemError,
				});
			});
	}

	//[GET]-[/Topic]
	get(req, res, next) {
		Topic.find({ status: Enum.topic.status.display })
			.then((topic) => {
				res.json({
					...Enum.response.success,
					data: {
						list: topic,
						total: topic.length,
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

	//[POST]-[/browse]
	update(req, res, next) {
		const { id, ...rest } = req.body;

		Topic.findByIdAndUpdate(id, rest)
			.then((browseItem) => {
				res.json({
					...Enum.response.success,
					data: {
						id: browseItem._id.toString(),
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

	//[DELETE]-[/browse]
	updateStatus(req, res, next) {
		const { id, status } = req.body;

		Topic.findByIdAndUpdate(id, { status })
			.then(() => {
				res.json({
					...Enum.response.success,
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

module.exports = new TopicController();
