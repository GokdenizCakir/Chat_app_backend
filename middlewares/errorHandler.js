const AppError = require('../utils/AppError');

const handleCastErrorDB = (error) => {
  return new AppError(400, error.message);
};

const handleDuplicateFieldsDB = (error) => {
  console.log(error);
  const message = `Duplicate field value`;
  return new AppError(400, message);
};

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);

  const message = 'Invalid input data.' + errors.join('. ');
  return new AppError(400, message);
};

const handleJWTError = (error) => {
  const message = 'Invalid token';
  return new AppError(401, message);
};

const handleTypeError = (error) => {
  const message = 'Invalid type';
  return new AppError(400, error);
};

exports.errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  // console.log(error.stack);
  let err = {
    message: error.message,
    statusCode: error.statusCode,
  };

  if (error.name === 'CastError') err = handleCastErrorDB(err);
  if (error.code === 11000) err = handleDuplicateFieldsDB(err);
  if (error.name === 'ValidationError') err = handleValidationErrorDB(err);
  if (error.name === 'JsonWebTokenError') err = handleJWTError(err);
  if (error.name === 'TypeError') err = handleTypeError(err);

  return res.status(err.statusCode).json({ message: err.message });
};
