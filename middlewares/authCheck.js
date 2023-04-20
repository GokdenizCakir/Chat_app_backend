const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');

exports.authCheck = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return next(new AppError(400, 'No headers'));


  const accessToken = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError(401, 'No user found'));
    }

    user.password = undefined;
    req.user = user;
  } catch (error) {
    return next(new AppError(401, 'Invalid token'));
  }

  next();
};
