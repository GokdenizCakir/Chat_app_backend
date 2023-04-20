const Conversation = require('../models/conversationModel');
const AppError = require('../utils/AppError');
const User = require('../models/userModel');
const mongoose = require('mongoose');

exports.createConversation = async (req, res, next) => {
  const { senderId, receiverUsername } = req.body;
  if (!senderId || !receiverUsername)
    return next(
      new AppError(400, 'Please provide senderId and receiver username')
    );

  const receiver = await User.findOne({ username: receiverUsername });
  if (!receiver) return next(new AppError(400, 'Invalid username'));
  const receiverId = receiver._id;

  const conversation = new Conversation({
    members: [senderId, receiverId],
  });
  const newConversation = await conversation.save();
  res.status(201).json({
    message: 'Conversation created successfully',
    conversation: newConversation,
  });
};

exports.getConversation = async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) return next(new AppError(400, 'Please provide a user ID'));

  const conversation = await Conversation.find({
    members: userId,
  }).populate('members');

  res.status(200).json({
    message: conversation.length + ' conversation(s) found.',
    conversation,
  });
};
