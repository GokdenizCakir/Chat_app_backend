const express = require('express');
const { tryCatch } = require('../utils/tryCatch');
const router = express.Router();
const userController = require('./../controllers/userController');
const { authCheck } = require('../middlewares/authCheck');

router.get('/', tryCatch(authCheck), tryCatch(userController.getUsers))
router.get('/me', tryCatch(authCheck), tryCatch(userController.getMe))
router.post('/register', tryCatch(userController.register));
router.post('/login', tryCatch(userController.login));

module.exports = router;
