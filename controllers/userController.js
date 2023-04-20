const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const AppError = require('./../utils/AppError');
const jwt = require('jsonwebtoken');

exports.getUsers = async (req, res, next) => {
  const users = await User.find();

  users.forEach((user) => (user.password = undefined));

  res.status(200).json({
    message: `${users.length} user(s) found`,
    users,
  });
};

exports.getMe = (req, res, next) => {
  const { user } = req;
  res.status(200).json({ message: 'User found', user });
};

exports.register = async (req, res, next) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    username,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

  res.status(201).json({
    message: 'User created successfully',
    token,
  });
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select('+password');
  if (!user) return next(new AppError(400, 'Incorrect email or password'));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new AppError(400, 'Incorrect email or password'));

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.status(201).json({
    message: 'User logged in successfully',
    token,
  });
};
