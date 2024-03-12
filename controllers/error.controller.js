function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err, res) {
  // Operational error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming error (avoid any data leak)
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
}

export default (err, req, res, next) => {
  // const statusCode = err.statusCode || 500;
  // const message = err.message || "Internal Server Error";
  console.log(err);
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
};
