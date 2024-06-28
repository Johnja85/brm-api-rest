# Api

Breve descripción de lo que hace el proyecto y su propósito.

## Requisitos

- Node.js (versión 21.6.1)
- MyslSQL (versión 8.3.0)
- Sequelize (versión 6.37.3)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Johnja85/brm-api-rest.git
   cd tu-repositorio

2. Instala las dependencias
    npm install express
    npm install jsonwebtoken
    npm install bcrypt
    npm install config
    npm install mysql2
    npm install sequelize
    npm install joi

3. Configura la base de datos:

    Crea una base de datos en MyslSQL.
    Configura el archivo config/connection.js con tus credenciales de base de datos.

4. Inicio de proyecto:
    nodemon app.js

## USO
* Para autenticación
    POS /api/auth/

* Para usuario
    POS /api/users
    GET /api/users
    GET /api/users/:id

* Para productos
    POS /api/products
    GET /api/products
    GET /api/products/:id
    DELETE /api/products/:id
    PUT /api/products/:id

* Para facturas
    POS /api/invoices
    GET /api/invoices
    GET /api/invoices/:id

* Para historico de productos
    GET /api/producthistory
    GET /api/producthistory/:id


# Contribuir
Si deseas contribuir, por favor sigue estos pasos:

Haz un fork del repositorio.
Crea una rama con tu nueva funcionalidad (git checkout -b feature/nueva-funcionalidad).
Haz commit de tus cambios (git commit -m 'Añadir nueva funcionalidad').
Sube tu rama (git push origin feature/nueva-funcionalidad).
Crea un nuevo Pull Request.
