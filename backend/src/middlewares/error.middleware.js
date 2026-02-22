
/**
 * Global Error Handler Middleware
 * Catches all errors and returns a formatted JSON response
 */
const errorHandler = (err, req, res, next) => {
    // Log error for developers (with stack-trace if not in production)
    if (process.env.NODE_ENV !== 'production') {
        console.error(' [ERROR] ', err.stack || err.message);
    } else {
        console.error(' [ERROR] ', err.message);
    }

    // Default status code and message
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific Mongoose Errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }
    
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyPattern)[0];
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    }

    if (err.name === 'CastError') {
        statusCode = 404;
        message = `Resource not found with id of ${err.value}`;
    }

    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

export default errorHandler;
