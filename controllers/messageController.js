const Message = require('../models/messageModel');
const AppError = require('../utils/AppError');

exports.createMessage = async (req, res, next) => {
  const { conversationId, senderId, text } = req.body;
  if (!conversationId || !senderId || !text)
    return next(new AppError(400, 'Invalid message request.'));

  const newMessage = await Message.create({
    conversationId,
    senderId,
    text: text.trim(),
  });

  res.status(201).json({
    message: 'Message successfully created.',
    messageData: newMessage,
  });
};

exports.getMessages = async (req, res, next) => {
  const { conversationId } = req.params;
  const messages = await Message.find({ conversationId });
  res.status(200).json({
    message: messages.length + ' message(s) found.',
    messages,
  });
};
