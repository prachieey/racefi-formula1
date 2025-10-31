class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorResponse);
    }

    this.name = this.constructor.name;
  }

  // Static method to create a new ErrorResponse
  static create(message, statusCode = 500) {
    return new ErrorResponse(message, statusCode);
  }

  // Format error for response
  toJSON() {
    return {
      success: false,
      error: this.message,
      statusCode: this.statusCode,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined,
    };
  }

  // Handle async/await errors
  static catchAsync(fn) {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  }

  // Handle 404 Not Found errors
  static notFound(resource = 'Resource') {
    return new ErrorResponse(`${resource} not found`, 404);
  }

  // Handle validation errors
  static validationError(errors) {
    const error = new ErrorResponse('Validation Error', 400);
    error.errors = errors;
    return error;
  }

  // Handle unauthorized errors
  static unauthorized(message = 'Not authorized to access this route') {
    return new ErrorResponse(message, 401);
  }

  // Handle forbidden errors
  static forbidden(message = 'Forbidden') {
    return new ErrorResponse(message, 403);
  }

  // Handle duplicate key errors
  static duplicateField(field) {
    return new ErrorResponse(`Duplicate field value: ${field}`, 400);
  }

  // Handle cast errors (invalid ObjectId, etc.)
  static castError() {
    return new ErrorResponse('Resource not found', 404);
  }
}

export default ErrorResponse;
