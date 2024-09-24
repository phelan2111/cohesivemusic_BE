const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user-controller');
const UserValidator = require('../validators/user');

router.post('/', UserController.index);
router.post('/register', UserController.register);
router.post('/verifyUsername', UserController.verifyUsername);
router.post('/verifyOTP', UserValidator.isLoggedIn, UserController.verifyOTP);
router.put('/login', UserController.login);
router.put(
	'/information',
	UserValidator.isLoggedIn,
	UserController.information,
);

module.exports = router;
