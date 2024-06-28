const express = require('express');
const config = require('config');
const users = require('./routes/users');
const roles = require('./routes/roles');
const auth = require('./routes/auth');
const products = require('./routes/products');
const invoices = require('./routes/invoices');
const invoiceDetail = require('./routes/invoiceDetail');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());


app.use('/api/auth', auth.route);
app.use('/api/roles', roles.route);
app.use('/api/users', users.route);
app.use('/api/products', products.route);
app.use('/api/invoices', invoices.route);
app.use('/api/producthistory', invoiceDetail.route);

sequelize.sync({ alter: true }).then(() => {
    console.log('Sincronización de modelos exitosa');
    app.listen(PORT, () => {
        console.log(`Escuchando en el puerto ${PORT} ...`);
    });
}).catch(error => {
    console.error('Error al sincronizar los modelos:', error);
});
