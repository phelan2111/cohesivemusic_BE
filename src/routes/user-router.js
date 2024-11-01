const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user-controller');
const UserValidator = require('../validators/user');
const CommonValidator = require('../validators/common');
const ServiceUser = require('../services/user');
const upload = require('../middleware/multer');

// KYC
router.post('/register', CommonValidator.isValidToken, UserValidator.hasFullValuesRegister, UserController.register);
router.post('/verifyUsername', UserController.verifyUsername);
router.post('/verifyOTP', CommonValidator.isValidToken, UserController.verifyOTP);
router.post('/login', UserValidator.hasFullValuesLogin, ServiceUser.comparePassword, UserController.login);

// User
router.get('/', CommonValidator.isLoggedIn, UserController.getList);
router.post('/', CommonValidator.isLoggedIn, UserValidator.hasFullValuesUpdate, UserController.update);
router.get('/details', CommonValidator.isLoggedIn, UserValidator.hasFullValuesDetails, UserController.details);
router.post('/upload', upload.single('file'), UserController.upload);
router.put('/', UserValidator.hasFullValuesCreate, UserController.createByBackOffice);
router.delete('/', UserValidator.hasFullValuesUpdateStatus, UserController.updateStatus);

module.exports = router;
