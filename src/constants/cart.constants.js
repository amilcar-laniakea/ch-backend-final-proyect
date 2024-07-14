const cartSuccessCodes = {
  SUCCESS_CREATE: "success create cart",
  SUCCESS_DELETE: "success delete cart",
  SUCCESS_ADD_PRODUCT: "success add product to cart",
  SUCCESS_DELETE_PRODUCT: "success delete product from cart",
};

const cartErrorCodes = {
  INVALID_FORMAT: "invalid cart id format",
  NOT_FOUND_PRODUCT: "product not found",
  NOT_ENOUGH_STOCK: "not enough stock",
  NOT_FOUND: "cart(s) not found",
  UNEXPECTED_ERROR: "unexpected",
};

module.exports = { cartSuccessCodes, cartErrorCodes };
