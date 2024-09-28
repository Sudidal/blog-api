function errorHandler(err, req, res, next) {
  console.log(err.stack);
  return res.status(500).json({ message: "Internal Server Error!" });
}

export default errorHandler;
