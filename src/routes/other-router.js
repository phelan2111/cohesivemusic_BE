const express = require('express');
const router = express.Router();
const CommonValidator = require('../validators/common');
const OtherController = require('../controllers/other-controller');

router.get('/summary', CommonValidator.isLoggedIn, OtherController.summary);
module.exports = router;
