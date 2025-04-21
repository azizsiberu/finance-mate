/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Convert regular error to ApiError
 * @param {Error} err - Original error
 * @param {number} statusCode - HTTP status code
 * @returns {ApiError} - Api error
 */
const convertToApiError = (err, statusCode = 500) => {
  if (err instanceof ApiError) return err;
  return new ApiError(
    statusCode,
    err.message || 'Internal Server Error',
    false,
    err.stack
  );
};

/**
 * Error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  console.error('Error:', err);

  // Convert to ApiError if not already
  const error = convertToApiError(err);

  // Send error response
  res.status(error.statusCode).json({
    error: {
      status: error.statusCode,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  });
};

/**
 * Not Found middleware
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Not found - ${req.originalUrl}`));
};

module.exports = {
  ApiError,
  errorHandler,
  notFound
};