const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user-controller');
const UserValidator = require('../validators/user');
const ServiceUser = require('../services/user');

router.post('/', UserController.index);
router.post('/register', UserValidator.isLoggedIn, UserValidator.hasFullValues, ServiceUser.hasPassword, UserController.register);
router.post('/verifyUsername', UserController.verifyUsername);
router.post('/verifyOTP', UserValidator.isLoggedIn, UserController.verifyOTP);
router.post('/login', UserValidator.hasFullValues, ServiceUser.comparePassword, UserController.login);
router.put('/information', UserValidator.isLoggedIn, UserController.information);

module.exports = router;
