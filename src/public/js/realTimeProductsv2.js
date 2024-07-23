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
};

socket.on("listProductUpdated", (products) => {
  const productList = document.getElementById("productList");
  const quantity = document.getElementById("productQuantity");

  const productsSort = products.reverse();

  quantity.textContent = products.length;

  productList.innerHTML = "";

  productsSort.forEach((product) => {
    const ul = document.createElement("ul");
    ul.style.border = "1px solid #a0a0a0";
    ul.style.paddingTop = "15px";
    ul.style.paddingBottom = "15px";
    ul.style.borderRadius = "8px";
    ul.style.position = "relative";

    const productInfo = [
      { label: "ID", value: product?.id, strong: true },
      { label: "Título", value: product?.title, strong: true },
      { label: "Descripción", value: product?.description },
      { label: "Código", value: product?.code },
      { label: "Precio", value: `$${product?.price}`, strong: true },
      {
        label: "Status",
        value: product?.status ? "Activo" : "Inactivo",
        strong: true,
      },
      { label: "Stock", value: product?.stock },
      { label: "Categoría", value: product?.category, strong: true },
    ];

    productInfo.forEach((info) => {
      const { label, value, strong } = info;
      ul.appendChild(createListItem(label, value, strong));
    });

    ul.appendChild(createDeleteButton(product.id));

    productList.appendChild(ul);
  });
});
