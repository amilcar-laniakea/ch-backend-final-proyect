const statusResponse = (res, data, message = null, status = 200, success = true) => {
  res.status(status).json({
    status,
    success,
    data,
    message,
  });
};

module.exports = { statusResponse };