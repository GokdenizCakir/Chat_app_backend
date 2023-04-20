const express = require('express');
const { tryCatch } = require('../utils/tryCatch');
const messageController = require('./../controllers/messageController');
const router = express.Router();

router.post('/', tryCatch(messageController.createMessage));
router.get('/:conversationId', tryCatch(messageController.getMessages));

module.exports = router;
