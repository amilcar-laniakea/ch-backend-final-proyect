const productSuccessCodes = {
  SUCCESS_CREATE: "success create product",
  SUCCESS_UPDATE: "success modify product",
  SUCCESS_DELETE: "success delete product",
};

const productErrorCodes = {
  INVALID_FORMAT: "invalid product id format",
  NOT_FOUND: "not found",
  UNEXPECTED_ERROR: "unexpected error",
};

module.exports = { productSuccessCodes, productErrorCodes };