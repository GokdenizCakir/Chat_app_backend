const express = require('express');
const { tryCatch } = require('../utils/tryCatch');
const conversationController = require('../controllers/conversationController');
const router = express.Router();

router.post('/', tryCatch(conversationController.createConversation));
router.get('/:userId', tryCatch(conversationController.getConversation));

module.exports = router;
