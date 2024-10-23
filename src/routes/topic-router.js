const express = require('express');
const router = express.Router();
const Topic = require('../controllers/topic-controller');
const TopicValidator = require('../validators/topic');
const CommonValidator = require('../validators/common');

router.put('/', CommonValidator.isLoggedIn, TopicValidator.hasFullValuesCreate, Topic.create);
router.post('/', CommonValidator.isLoggedIn, TopicValidator.hasFullValuesUpdate, Topic.update);
router.delete('/', CommonValidator.isLoggedIn, TopicValidator.hasFullValuesHidden, Topic.updateStatus);
router.get('/', CommonValidator.isLoggedIn, Topic.get);

module.exports = router;
