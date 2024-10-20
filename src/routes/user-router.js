const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user-controller');
const UserValidator = require('../validators/user');
const CommonValidator = require('../validators/common');
const ServiceUser = require('../services/user');

router.post('/register', CommonValidator.isLoggedIn, UserValidator.hasFullValuesRegister, ServiceUser.hasPassword, UserController.register);
router.post('/verifyUsername', UserController.verifyUsername);
router.post('/verifyOTP', CommonValidator.isLoggedIn, UserController.verifyOTP);
router.post('/login', UserValidator.hasFullValuesLogin, ServiceUser.comparePassword, UserController.login);
router.put('/information', CommonValidator.isLoggedIn, UserController.information);
router.get('/', CommonValidator.isLoggedIn, UserController.getList);

module.exports = router;
