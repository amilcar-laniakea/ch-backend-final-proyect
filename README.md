# Aplicación Backend E-Commerce para comision 70065 (Backend Avanzado) **CoderHouse**

# coderhouse_ecommerce

Primera entrega del proyecto final que tiene su foco en realizar un CRUD de productos y un CRUD para gestionar los carritos de compra

## Tabla de Contenidos
1. [Instalación](#instalación)
2. [Configuración](#configuración)
3. [Uso](#uso)
4. [Websocket Integración](#websocket)
5. [Uso de Handlebars](#handlebars)
6. [Postman Collection](#postman)
7. [Estructura del Proyecto](#estructura-del-proyecto)
8. [Desarrollo](#desarrollo)
9. [Licencia](#licencia)
10. [Autores y Reconocimientos](#autores-y-reconocimientos)
11. [Contactos y Soporte](#contactos-y-soporte)

## Instalación
### Requisitos previos
- Node.js v20.16.0

### Instrucciones de instalación
1. Clonar el repositorio:
   ```sh
   git clone https://github.com/amilcar-laniakea/ch-backend-final-proyect.git
   ```

## Configuración
### Variables de entorno
`PORT`: El puerto se encuentra definido por default en el archivo principal del proyecto (app.js): 8080
### Package.json
Contiene las siguientes librerías necesarias para los requerimientos necesarios del trabajo final:

`express`: En su version 4.19.2.  
`multer`: En su version 1.4.5.  
`express-handlebars`: En su version 7.1.3  
`socket.io`: En su version 4.7.5  

**Importante:** las versiones descritas con anterioridad fueron o son las usadas al momento de hacer el desarrollo del proyecto.

## Uso
### Iniciar Aplicación
   ```sh
      npm run start
   ```
Esto iniciara la aplicación en la dirección: [http://localhost:8080](http://localhost:8080/)

### Carpeta de recursos estaticos:
AL utilizar cada uno de los endpoints de la aplicación, se generan la carpeta y ruta correspondiente a los archivos necesarios:  
`data/carts.json` o `data/products.json`  
Si al invocar un endpoint la carpeta no existe y tampoco el archivo, por ejemplo, ver todos los productos, esta generara la carpeta data y el archivo correspondiente de forma automática, de lo contrario, la aplicación procederá a leerlo y mostrara el contenido del mismo en el resultado del servicio.

La carpeta de igual forma sirve como bucket de imágenes para el servicio de subir las mismas que se explicaran en los endpoints routes.

### Endpoints de la API

> [!IMPORTANT]
> Los endpoints para productos de CREAR `POST => /api/product`, ACTUALIZAR `PUT => /api/product:id` y BORRAR `DELETE => /api/product/:id` se le agrego en las rutas luego del `try => catch` la condición `finally`; allí es donde se invoca toda la lógica relacionada con websockets requerida por medio de la funcion `socketDataResponse()`, el cual tiene como primer parámetro el nombre del evento emit, el segundo la data a enviar y el tercero el objeto invocado Producto***.

> [!NOTE]
> el método `socketDataResponse()` mencionado anteriormente posee temporalmente `dos` mecánicas de eventos emit para las vistas estáticas `real-time-products => productAdded, productDeleted y productUpdated` y `real-time-products-v2 => listProductUpdated`, estas para ilustrar 2 formas en las que pueden manejarse los eventos en las vistas estáticas.

Los endpoints se dividen en tres archivos de rutas, las cuales manejar sus respectivos métodos de consulta: 

Los servicios de la APP responderán  la siguiente estructura:
>Ejemplo de respuesta exitosa:  
   ```sh
      {
         "status": 200,
         "data": {
            "title": "Practical Steel Shirt",
            "description": "Corporate",
            "code": 338,
            "price": 144,
            "status": true,
            "stock": 942,
            "category": "Licensed Steel Shirt",
            "thumbnail": "",
            "id": 5
         },
         "message": "Product with requested ID 5: updated successfully."
      }
   ```
>Ejemplo de respuesta en excepción o error: 
   ```sh
      {
         "status": 200,
         "data": null,
         "message": "Product with requested ID 15: not found"
      }
   ```

Nótese los atributos comunes a la respuesta: `status` indica el código de la respuesta solicitada, `data` para la información generada por la respuesta, en caso de ser una excepción su valor sera `null` y acompañada de un `message` que detalla la información de la respuesta en caso de ser necesaria, de los contrario, su valor sera `null`.

#### Rutas de productos:  
**GET**  `/api/product`: Obtiene la lista de productos. Puede enviarse como parámetro opcional `limit` para limitar la cantidad en los resultados.  
**GET**  `/api/product/:id`: Obtiene un producto con el id requerido por parámetro en ruta.  
**POST** `/api/product`: Crea un producto con un id autogenerado, requiere los siguientes atributos enviados por el body (ejemplo de variables usadas en Postman para generar valores aleatorios de atributos):  
   ```sh
      {
         "title": "{{$randomProductName}}",
         "description": "{{$randomJobDescriptor}}",
         "category": "{{$randomProductName}}",
         "code": {{$randomInt}},
         "price": {{$randomInt}},
         "stock": {{$randomInt}}
      }
   ```
**PUT** `/api/product/:id`: actualiza el producto requerido, pueden enviarse los mismos parametros que en el ejemplo de crear un producto, sin embargo, son de manera opcional, y pueden editarse uno por individual por request o todos a la vez, ejemplos:
   ```sh
      {
         "title": "{{$randomProductName}}",
      }
   ```
   ```sh
      {
         "title": "{{$randomProductName}}",
         "description": "{{$randomJobDescriptor}}",
      }
   ```
**DELETE** `/api/product/:id`: borra el producto requerido

#### Rutas de Carrito de compras:
**GET**  `/api/cart`: Obtiene la lista de carrito de compras creados.  
**GET**  `/api/cart/:id`: Obtiene un carrito de compras con el id requerido por parámetro en ruta.  
**POST** `/api/cart`: Genera un carrito de compras con un id secuencial único y lo incluye en la lista de carritos de compras, este es necesario para usar los servicios de  crear y gestionar los productos del mismo.  
**POST** `/api/cart/:cid/product/:pid`: Este servicio tiene como principal funcion agregar productos a un carrito de compras elegido, el parámetro `:cid` indica el carrito objetivo a ser gestionado, como segundo parámetro `:pid` que representa el id del producto a agregar, este se usa junto con el parámetro  por body `quantity` para verificar si el producto existe en la lista de productos generada y almacenada en `data/products.json` cuenta con la existencia de ese producto y tiene un stock suficiente para ser agregado.

El parámetro `quantity` debe ser enviado de la siguiente manera (ejemplo por Postman): 
   ```sh
      {
         "quantity": 3
      }
   ```
**DELETE** `/api/cart/:cid/product/:pid`: Elimina un producto deseado por medio del id del carrito `:cid` y el id del producto `:pid`  
**DELETE** `/api/cart/:id`: Elimina un carrito de la lista de carrito de compras por medio del parámetro `:id`  
**PUT** `/api/cart/:cid/product/:pid`: Reduce la cantidad deseada de un producto ya agregado al carrito de compras por medio del id del producto `:pid`, el id del carrito de compras `:pid`, ademas debe enviarse por parámetro en el body la cantidad deseada a disminuir:  
   ```sh
      {
         "quantity": 3
      }
   ```
#### Rutas subir imágenes:
**POST** `/api/upload`: servicio para subir imágenes que se almacenan en la ruta `/data/` el cual incluye como titulo el timestamp de la imagen concatenado con su nombre original.

> [!IMPORTANT]
> Estas rutas son para demostración de renderizado de contenido del lado der servidor para ser servido por frontend

> [!NOTE]
> Cada vista presenta en su mecánica un archivo JS vinculado a su lógica ubicado en la ruta `/public/js`

#### Rutas estáticas:

Son las rutas usadas para renderizar del lado del servidor contenido que pueda ser visualizado y manipulado por el cliente, estas vistas permiten mostrar los productos que son devueltos anteriormente por el endpoint `/api/products` de forma gráfica.

$${\color{green}Rutas \space Estáticas:}$$ 

$${\color{lightgreen}/views/home:}$$

Esta muestra los productos almacenados en el archivo temporal `data/products.json` y los renderiza estaticamente en la vista de mayor `ID` a menor `ID`.

<p align="center">
   <image src="external_resources/images/home.jpg" alt="Descripción de la imagen">
</p>

La estructura de información mostrada es la misma que la devuelta por el endpoint **GET** `api/product`

$${\color{lightgreen}/views/real-time-products:}$$

Esta vista muestra contenido de los productos de igual manera que la vista anterior, ademas de usar una conexión de websocket que escucha en **tiempo real** las actualizaciones de los endpoints de las api para **Crear, Actualizar y Borrar** productos, ademas cuenta con  diferencias importantes:

- El ordenamiento de la lista esta de mayor ID a menor id, esto por motivos prácticos para ver la actualización de la misma en tiempo real sin necesidad de hacer scroll hasta el ultimo producto de la lista.
- Presenta botones de acción para crear un producto y borrar un producto, estas acciones se comunican por medio del protocolo **HTTP** a los servicios **PUT** y **POST** de creación y actualización de data.
- Tiene los eventos en tiempo real por medio de `socket.io` en `socket.on` => `productAdded`, `productDeleted` y `productUpdated` los cuales actualizan dependiendo de la acción realizada, estas con orquestadas en los endpoints **CREAR**, **ACTUALIZAR** y **BORRAR**.

> [!NOTE]
> Esta vista presenta una mecánica de actualización que si bien es basada en websocket, esta usa un una forma de actualizar o re-renderizar la vista en base a 3 métodos diferentes, ubicados en el archivo `/public/js/realTimeProducts.js` (eficiente en tiempo de renderizado, pero no recomendada)

$${\color{lightgreen}/views/real-time-products-v2:}$$

Esta vista presenta las mismas características que la vista de anterior; a diferencia de la `real-time-products` esta usa un único método para actualizar la información de la lista de los productos por medio del método `socket.on` en el id `listProductUpdated` el cual es invocado por los endpoints de **CREAR**, **ACTUALIZAR** y **BORRAR** producto por medio de un evento `emit`.

> [!NOTE]
> Esta vista presenta una mecánica de actualización única para las 3 acciones llamada `listProductUpdated` ubicada en `/public/js/realTimeProductsv2.js` (recomendada)

<p align="center">
   <image src="external_resources/images/real-time-products.jpg" alt="Descripción de la imagen">
</p>

$${\color{lightblue}Modal \space Crear \space Producto:}$$

<p align="center">
   <image src="external_resources/images/modal-add.jpg" alt="Descripción de la imagen">
</p>

$${\color{lightblue}Modal \space Eliminar \space Producto:}$$

<p align="center">
   <image src="external_resources/images/modal-delete.jpg" alt="Descripción de la imagen">
</p>

## Websocket

La seccion de websocket por medio de la librería `socket.io` fue integrada en conjunto con la funcionalidad de la entrega anterior, de forma que conviven el servidor de NodeJs en conjunto con la mecánica de escucha de los sockets, esta se logro mediante la incorporación de una funcion que orquesta de forma separada el servicio de websockets:

   ```sh
      const { Server } = require("socket.io");

      let io;

      const webSocketServer = (server) => {
      io = new Server(server);

      io.on("connection", (socket) => {
         console.log("client has been connected!");

         socket.on("disconnect", () => {
            console.log("client has been disconnected!");
         });
      });
      };

      module.exports = { webSocketServer, getIo: () => io };

   ```

- La variable io se declara fuera de la funcion de forma de que esta pueda ser usada en los eventos de productos `CREAR`, `ACTUALIZAR` y `BORRAR` y es exportada mediante un método llamada `getIo`, se realizo de esta forma ya que al exportar la variable directamente esta era llenada con el valor  `undefined` debido a la naturaleza de la misma.
- el método `webSocketServer` es el usado en el archivo `app.js` para orquestar la inicializacion del servidor de websocket de forma correcta.

## Handlebars

La carpeta `views` contiene toda la estructura del proyecto en lo referente a la librería `handlebars`, tiene como carpeta principal `layout` en donde se encuentra el esqueleto general de la estructura html, y la carpeta `partials` que incluye el archivo `productList` que es compartido con todas las vistas estáticas.

- Cada plantilla tiene sus dependencias que son invocadas por medios de CDN's
- Cada plantilla su archivo `.js` ubicado en la ruta `/src/public/js` que contienen la lógica necesaria para su funcionamiento
- La configuración de la librería `handlebars` se encuentra ubicada en el archivo `app.js`, donde están declaradas la ubicación de la carpeta `partials` detalles como extension personalizada: 

   ```sh
      const hbs = create({ extname: "hbs", partialsDir: path.join(__dirname, "views", "partials")});
   ```

## Postman
En la ruta `/postman` se encuentra la colección de postman necesaria a importar en la aplicación de `Postman` y usar los recursos de la APP, el nombre del archivo es `collection_v1.json`
 
## Estructura del proyecto
```
proyecto/
├── external_resources/ (recursos ajenos a la aplicación)
│   ├── images/ (imágenes del README.md) 
│   └──  postman/ (colección de postman)
├── src/
│   ├── data/ (carpeta temporal generada automáticamente al usar los servicios)
│   ├── public/
│   │   └── js/ (recursos para paginas de handlebars)
│   ├── routes/
|   ├── services/
|   ├── utils/
|   ├── views/ (vistas de handlebars)
│   │   ├── layouts/
│   │   └── partials/
│   ├── websockets/
│   └── app.js
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```
## Desarrollo
### Guías de estilo
No disponible

### Procedimientos de desarrollo
1. Crea una rama nueva: `git checkout -b feature/nueva-feature`
1. Realiza tus cambios y realiza commits.

### Código de conducta
Este proyecto sigue el Código de Conducta.
## Licencia
Este proyecto está bajo la licencia MIT. Ver el archivo LICENSE para más detalles.
## Autores y reconocimientos
* Amilcar Barahona - Desarrollador principal - amilcar-laniakea
## Contacto y soporte
Para preguntas o soporte, contacta a amilcar.laniakea@gmail.com.

### Notas Adicionales
Cualquier otra información relevante.