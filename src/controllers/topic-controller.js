const Enum = require('../data/enum');
const logger = require('../utils/logger');
const Topic = require('../models/topic-model');
const Helper = require('../utils/helper');
const ServiceTopic = require('../services/topic');

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
		const { from, limit, status = Enum.topic.status.display, search = '', ...rest } = req.query;

		const query = Helper.search(search, {
			status,
		});

		Topic.find(query)
			.limit(limit)
			.skip(from)
			.sort(rest)
			.then((topic) => {
				Topic.countDocuments(query)
					.exec()
					.then((total) => {
						res.json({
							...Enum.response.success,
							data: {
								list: topic,
								total,
							},
						});
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
		const { topicId, ...rest } = req.body;

		Topic.findByIdAndUpdate(topicId, rest)
			.then((topicItem) => {
				res.json({
					...Enum.response.success,
					data: {
						id: topicItem._id.toString(),
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
		const { topicId, status } = req.body;

		Topic.findByIdAndUpdate({ _id: topicId }, { status })
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

	//[POST]-[/browse/topic/details]
	getDetails(req, res, next) {
		const { topicId } = req.query;

		Topic.findOne({ _id: topicId })
			.then((topicItem) => {
				res.json({
					...Enum.response.success,
					data: ServiceTopic.convertResponseTopic(topicItem),
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
