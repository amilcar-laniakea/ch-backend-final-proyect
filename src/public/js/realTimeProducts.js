const socket = io();

const createListItem = (label, value, strong = false) => {
  const li = document.createElement("li");
  li.style.margin = "0px";
  li.innerHTML = strong
    ? `${label}: <strong>${value}</strong>`
    : `${label}: ${value}`;
  return li;
};

const createDeleteButton = (id) => {
  const button = document.createElement("button");
  button.textContent = "Eliminar";
  button.style.margin = "70px 30px";
  button.style.position = "absolute";
  button.style.top = "0";
  button.style.bottom = "0";
  button.style.right = "0";
  button.style.border = "0";
  button.style.borderRadius = "4px";
  button.style.backgroundColor = "#e06666";
  button.style.color = "#ffffff";
  button.style.fontSize = "1em";
  button.style.padding = ".625em 1.1em";
  button.style.cursor = "pointer";
  button.onclick = () => deleteProductModal(id);

  return button;
}

socket.on("productAdded", (productAdded) => {
  const productList = document.getElementById("productList");
  const quantity = document.getElementById("productQuantity");

  const quantityValue = Number(quantity.textContent) + 1;

  quantity.textContent = quantityValue;

  const ul = document.createElement("ul");
  ul.style.border = "1px solid #a0a0a0";
  ul.style.paddingTop = "15px";
  ul.style.paddingBottom = "15px";
  ul.style.borderRadius = "8px";
  ul.style.position = "relative";

  const productInfo = [
    { label: "ID", value: productAdded?.id, strong: true },
    { label: "Título", value: productAdded?.title, strong: true },
    { label: "Descripción", value: productAdded?.description },
    { label: "Código", value: productAdded?.code },
    { label: "Precio", value: `$${productAdded?.price}`, strong: true },
    { label: "Status", value: productAdded?.status ? 'Activo' : 'Inactivo', strong: true },
    { label: "Stock", value: productAdded?.stock },
    { label: "Categoría", value: productAdded?.category, strong: true },
  ];

  productInfo.forEach((info) => {
    const { label, value, strong } = info;
    ul.appendChild(createListItem(label, value, strong));
  });

  ul.appendChild(createDeleteButton(productAdded.id));

  if (productList.firstChild) {
    productList.insertBefore(ul, productList.firstChild);
  } else {
    productList.appendChild(ul);
  }
});

socket.on('productDeleted', (productDeleted) => {
  const productList = document.getElementById("productList");
  const productItems = productList.querySelectorAll("ul");
  const quantity = document.getElementById("productQuantity");

  productItems.forEach((item) => {
    const id = item.querySelector("li").textContent.split(":")[1].trim();

    if (Number(id) === productDeleted.id) {
      item.remove();
    }
  });

  const quantityValue = Number(quantity.textContent) - 1;

  quantity.textContent = quantityValue;
});

socket.on('productUpdated', (productUpdated) => { 
  const productList = document.getElementById("productList");
  const productItems = productList.querySelectorAll("ul");

  productItems.forEach((item) => {
    const id = item.querySelector("li").textContent.split(":")[1].trim();

    if (Number(id) === productUpdated.id) {
      const productInfo = [
        { label: "ID", value: productUpdated?.id, strong: true },
        { label: "Titulo", value: productUpdated?.title, strong: true },
        { label: "Descripción", value: productUpdated?.description },
        { label: "Código", value: productUpdated?.code },
        { label: "Precio", value: `$${productUpdated?.price}`, strong: true },
        { label: "Status", value: productUpdated?.status ? 'Activo' : 'Inactivo', strong: true },
        { label: "Stock", value: productUpdated?.stock },
        { label: "Categoría", value: productUpdated?.category, strong: true },
      ];

      item.innerHTML = '';

      productInfo.forEach((info) => {
        const { label, value, strong } = info;
        item.appendChild(createListItem(label, value, strong));
      });

      item.appendChild(createDeleteButton(productUpdated.id));
    }
  });
});