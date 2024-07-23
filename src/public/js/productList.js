
function addProductModal() {
  Swal.fire({
    title: "Agregar Producto",
    html: `
            <label for="productTitle">Título del producto:</label>
            <input type="text" id="productTitle" class="swal2-input" style="margin-top: 5px; margin-bottom:15px; height: 2em" placeholder="Título del producto">
            <br/>
            <label for="productDescription">Descripción del producto:</label>
            <input type="text" id="productDescription" class="swal2-input" style="margin-top: 5px; margin-bottom:15px; height: 2em" placeholder="Descripción del producto"></input>
            <br/>
            <label for="productCategory">Categoría del producto:</label>
            <input type="text" id="productCategory" class="swal2-input" style="margin-top: 5px; margin-bottom:15px; height: 2em" placeholder="Categoría del producto"></input>
            <br/>
            <label for="productCode">Código del producto:</label>
            <input type="number" id="productCode" class="swal2-input" style="margin-top: 5px; margin-bottom:15px; height: 2em" placeholder="Código del producto">
            <br/>
            <label for="productPrice">Precio del producto:</label>
            <input type="number" id="productPrice" class="swal2-input" style="margin-top: 5px; margin-bottom:15px; height: 2em" placeholder="Precio del producto">
            <br/>
            <label for="productStock">Stock del producto:</label>
            <input type="number" id="productStock" class="swal2-input" style="margin-top: 5px; margin-bottom:15px; height: 2em" placeholder="Stock del producto">    
          `,
    showCancelButton: true,
    allowOutsideClick: false,
    confirmButtonText: "Agregar",
    cancelButtonText: "Cancelar",
    preConfirm: async () => {
      const productTitle = Swal.getPopup().querySelector("#productTitle").value;
      const productDescription = Swal.getPopup().querySelector(
        "#productDescription"
      ).value;
      const productCategory =
        Swal.getPopup().querySelector("#productCategory").value;
      const productCode = Swal.getPopup().querySelector("#productCode").value;
      const productPrice = Swal.getPopup().querySelector("#productPrice").value;
      const productStock = Swal.getPopup().querySelector("#productStock").value;

      if (
        !productTitle ||
        !productPrice ||
        !productDescription ||
        !productCategory ||
        !productCode ||
        !productStock
      ) {
        Swal.showValidationMessage(
          "Por favor, complete todos los campos requeridos"
        );

        return false;
      }

      const codeNumber = Number(productCode);
      const priceNumber = Number(productPrice);
      const stockNumber = Number(productStock);

      if (isNaN(codeNumber) || isNaN(priceNumber) || isNaN(stockNumber)) {
        Swal.showValidationMessage(
          "Por favor, ingrese un valor numérico en los campos de código, precio y stock"
        );

        return false;
      }

      try {
        const response = await axios.post("http://localhost:8080/api/product", {
          title: productTitle,
          description: productDescription,
          category: productCategory,
          code: codeNumber,
          price: priceNumber,
          stock: stockNumber,
        });

        return response.data;
      } catch (error) {
        console.log("error", error);
        Swal.showValidationMessage(
          "Error al agregar el producto: " + error.response.data.message
        );
        return false;
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: `${result.value.data.title}`,
        text: `${result.value.message}`,
        timer: 10000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    }
  });
}

function deleteProductModal(id) {
  Swal.fire({
    title: `¿Estás seguro de eliminar el producto ${id}?`,
    text: "Esta acción es irreversible...",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    allowOutsideClick: false,
    preConfirm: async () => {
      try {
        const response = await axios.delete(
          `http://localhost:8080/api/product/${id}`
        );

        return response.data;
      } catch (error) {
        console.log("error", error);
        Swal.showValidationMessage(
          "Error al eliminar el producto: " + error.response.data.message
        );
        return false;
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: `${result.value.message}`,
        timer: 10000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    }
  });
}