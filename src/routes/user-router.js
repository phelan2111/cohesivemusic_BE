const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user-controller');
const UserValidator = require('../validators/user');

router.post('/', UserController.index);
router.put('/register', UserController.register);
router.put('/login', UserController.login);
router.put(
	'/information',
	UserValidator.isLoggedIn,
	UserController.information,
);

module.exports = router;
