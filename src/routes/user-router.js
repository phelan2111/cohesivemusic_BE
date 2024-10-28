const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user-controller');
const UserValidator = require('../validators/user');
const CommonValidator = require('../validators/common');
const ServiceUser = require('../services/user');

router.post('/register', CommonValidator.isValidToken, UserValidator.hasFullValuesRegister, UserController.register);
router.post('/verifyUsername', UserController.verifyUsername);
router.post('/verifyOTP', CommonValidator.isValidToken, UserController.verifyOTP);
router.post('/login', UserValidator.hasFullValuesLogin, ServiceUser.comparePassword, UserController.login);
router.get('/', CommonValidator.isLoggedIn, UserController.getList);
router.get('/details', CommonValidator.isLoggedIn, UserValidator.hasFullValuesDetails, UserController.details);

module.exports = router;
