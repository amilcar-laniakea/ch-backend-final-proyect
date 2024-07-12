const validateProductData = (name, type, value) => {
  if (!value || typeof value !== type)
    return `${name} is required or must be a ${type}, `;
  return '';
}

const validateTypeProductData = (name, type, value) => {
  if (value && typeof value !== type)
    return `${name} must be a ${type}, `;
  return "";
};

module.exports = { validateProductData, validateTypeProductData };