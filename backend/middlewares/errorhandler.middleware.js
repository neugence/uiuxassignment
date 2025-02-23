const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        details: Object.values(err.errors).map(error => error.message)
      });
    }
  
    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID format'
      });
    }
  
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Duplicate key error',
        field: Object.keys(err.keyPattern)[0]
      });
    }
  
    return res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  };
  
export default errorHandler;