# Aplicación Backend E-Commerce para comision 70065 (Backend Avanzado) **CoderHouse**

# coderhouse_ecommerce

Primera entrega del proyecto final que tiene su foco en realizar un CRUD de productos y un CRUD para gestionar los carritos de compra

## Tabla de Contenidos
1. [Instalación](#instalación)
2. [Configuración](#configuración)
3. [Uso](#uso)
4. [Postman Collection](#postman)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Desarrollo](#desarrollo)
7. [Licencia](#licencia)
8. [Autores y Reconocimientos](#autores-y-reconocimientos)
9. [Contactos y Soporte](#contactos-y-soporte)

## Instalación
### Requisitos previos
- Node.js v20.16.0

### Instrucciones de instalación
1. Clonar el repositorio:
   ```sh
   git clone https://github.com/amilcar-laniakea/ch-backend-final-proyect.git

## Configuración
### Variables de entorno
En el archivo `.env.example` se encuentran las variables necesarias para poder usar la conexión correcta con mongodb:

`PORT`: El puerto se encuentra definido por default en el archivo principal del proyecto (app.js): 8080
`MONGO_DB_URI`: Dirección de la base de datos de mongodb
`DATABASE_NAME`: Nombre de la base de datos a conectar

### Colecciones de MongoDB

Las colecciones que usa este proyecto en mongo DB son las siguientes:
#### products
La estructura se encuentra en la carpeta `src/models/product.model.js`, aquí un json de respuesta de ejemplo:
nombre de la colección creada en la base de datos => `products`
```sh
   {
      "_id": "66932618b04352892ecd1ef7",
      "name": "Gorgeous Metal Keyboard",
      "description": "Principal",
      "price": 760,
      "code": 118,
      "status": true,
      "stock": 139,
      "category": "Awesome Rubber Mouse",
      "thumbnail": "",
      "createdAt": "2024-07-14T01:12:56.203Z",
      "updatedAt": "2024-07-14T01:12:56.203Z",
      "__v": 0
    }
```
#### carts
La estructura se encuentra en la carpeta `src/models/cart.model.js`, aquí un json de respuesta de ejemplo:
nombre de la colección creada en la base de datos => `carts`

`NOTA:` EL ATRIBUTO `id` PRESENTE REPRESENTA EL ID DEL PRODUCTO EN LA COLECCIÓN DE `products`, EL `_id` representa el id generado por mongodb de forma automática.

```sh
   {
      {
         "id": "66932618b04352892ecd1ef7",
         "quantity": 6,
         "_id": "66942fbd53693c1dbd5e3aa2"
      }
    }
```

### Package.json
Contiene las siguientes librerías necesarias para los requerimientos necesarios del trabajo final:

`express`: En su version 4.19.2.  
`multer`: En su version 1.4.5.

## Uso
### Iniciar Aplicación
   ```sh
      npm run start
   ```
Esto iniciara la aplicación en la dirección: [http://localhost:8080](http://localhost:8080/)

### Endpoints de la API
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
         "status": 400, # puede ser 400, para un error proveniente de parametros incorrectos, 404 para recursos no encontrados y 500 para excepciones
         "data": null,
         "message": "Product with requested ID 15: not found"
      }
   ```

Nótese los atributos comunes a la respuesta: `status` indica el código de la respuesta solicitada, `data` para la información generada por la respuesta, en caso de ser una excepción su valor sera `null` y acompañada de un `message` que detalla la información de la respuesta en caso de ser necesaria, de los contrario, su valor sera `null`.

#### Rutas de productos:  
**GET**  `/api/product`: Obtiene la lista de productos. Puede enviarse como parámetro opcional `limit` para limitar la cantidad en los resultados.  
**GET**  `/api/product/:id`: Obtiene un producto con el id (o código) del producto requerido por parámetro en ruta.  
**POST** `/api/product`: Crea un producto con un id autogenerado por mongodb, requiere los siguientes atributos enviados por el body (ejemplo de variables usadas en Postman para generar valores aleatorios de atributos):  
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
**POST** `/api/cart`: Genera un carrito de compras con un id secuencial único y lo incluye en la lita de carritos de compras, este es necesario para usar los servicios de  crear y gestionar los productos del mismo.  
**POST** `/api/cart/:cid/product/:pid`: Este servicio tiene como principal funcion agregar productos a un carrito de compras elegido, el parámetro `:cid` indica el carrito objetivo a ser gestionado, como segundo parámetro `:pid` que representa el id del producto a agregar, este se usa junto con el parámetro  por body `quantity` para verificar si el producto existe en la lista de productos en mongodb.

Como segunda funcion tiene la posibilidad de reducir la cantidad del producto elegida y pasada por el body con el parámetro opcional `isReduceQuantity`, en donde si este se encuentra en true reducirá la cantidad del producto del mismo en el carrito de compras, siempre y cuando la cantidad sera menor a la actualmente almacenada, de lo contrario, arrojara un 400 indicando la falta de stock.

El parámetro `quantity` debe ser enviado de la siguiente manera (ejemplo por Postman): 
   ```sh
      {
         "quantity": 3,
         "isReduceQuantity": true # opcional, por defecto es false
      }
   ```
**DELETE** `/api/cart/:cid/product/:pid`: Elimina un producto deseado por medio del id del carrito `:cid` y el id del producto `:pid`  
**DELETE** `/api/cart/:id`: Elimina un carrito de la lista de carrito de compras por medio del parámetro `:id`  

#### Rutas subir imágenes:
**POST** `/api/upload`: servicio para subir imágenes que se almacenan en la ruta `/data/` el cual incluye como titulo el timestamp de la imagen concatenado con su nombre original.  

## Postman Collection
En la ruta `/src/postman` se encuentra la colección de postman necesaria a importar en la aplicación de `Postman` y usar los recursos de la APP, el nombre del archivo es `collection_v1.json`
 
## Estructura del proyecto
```
proyecto/
├── postman/
│   └── collection_v1.json (colección que puede importarse a la aplicación de POSTMAN)
├── public/
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── models/
│   ├── routes/
|   ├── services/
|   ├── utils/
│   └── app.js
├── .gitignore
├── .env.example
├── package.json
├── package-lock.json
├── server.js
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