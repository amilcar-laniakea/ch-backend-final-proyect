
const generateId = products => {
  return products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1
}

module.exports = generateId;