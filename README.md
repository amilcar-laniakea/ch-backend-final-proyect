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

<span style="color:green;font-weight:700;font-size:20px">
    markdown color font styles
</span>

<p><green>hola verde</green></p>

> [!IMPORTANT]
> Estas rutas son para demostración de renderizado de contenido del lado der servidor para ser servido por frontend

Son las rutas usadas para renderizar del lado del servidor contenido que pueda ser visualizado y manipulado por el cliente, estas vistas permiten mostrar los productos que son devueltos anteriormente por el endpoint `/api/products` de forma gráfica.

1. **Ruta Estática**: `/home`: Esta muestra los productos almacenados en el archivo temporal `data/products.json` y los renderiza estaticamente en la vista de mayor `ID` a menor `ID`.
<p align="center">
   <image src="external_resourses/images/home.jpg" alt="Descripción de la imagen">
</p>

La estructura de información mostrada es la misma que la devuelta por el endpoint **GET** `api/product`

2. **Ruta Estática**: `/home`:

## Postman Collection
En la ruta `/src/postman` se encuentra la colección de postman necesaria a importar en la aplicación de `Postman` y usar los recursos de la APP, el nombre del archivo es `collection_v1.json`
 
## Estructura del proyecto
```
proyecto/
├── src/
│   ├── data/ (carpeta generada automáticamente al usar los servicios) 
│   ├── postman/
│   ├── public/
│   ├── routes/
|   ├── services/
|   ├── utils/
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