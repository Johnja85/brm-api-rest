const express = require('express');
const config = require('config');
// const logger = require('./logger');
const app = express();
const Joi = require('joi');

app.use(express.json());
// app.use(express.urlencoded({extende:true}));
// app.use(logger.log);


// Configuración de entornos
console.log('Aplicación: ' + config.get('nombre'));
console.log('DB server: ' + config.get('configDB.host'));
console.log('Variable de entorno: ' + app.get('env'));



const users = [
    {
        id: 1,
        name: 'Melissa',
    },
    {
        id: 2,
        name: 'Jander',
    }
];

app.get('/', (req, res) => {
    res.send('Hola Mundo desde Express ' + req.params);
});

app.get('/api/users', (req, res) => {
    res.send(users);
});

app.get('/api/users/:id', (req, res) => {
    let user = getUser(req.params.id);
    if (!user) {
        res.status(400).send('User is not found');
        return;
    };
    res.send(user);
});

app.post('/api/users', (req, res) => {

    const {error, value} = validateUser(req.body.name);
    if (!error) {
        const user = {
            id: users.length + 1,
            name: value.name
        };
        users.push(user);
        res.send(users);
    } else {
        res.status(400).send(error.details[0].message);
    }
});

app.put('/api/users/:id', (req, res) => {
    let user = getUser(req.params.id);
    if (!user) {
        res.status(400).send('User is not found');
        return;
    };

    const {error, value} = validateUser(req.body.name);
    if (!error) {
        user.name = value.name;
        res.send(user);
    } else {
        res.status(400).send(error.details[0].message);
    }
    console.log(user);
});

app.delete('/api/users/:id', (req, res) => {
    let user = getUser(req.params.id);
    if (!user) {
        res.status(400).send('User is not found');
        return;
    };

    const index = users.indexOf(user);
    users.splice(index, 1);

    res.send(user);
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port} ...`);
});

function getUser(id) {
    return (users.find(user => user.id === parseInt(id)));
}

function validateUser(nameBody) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(10)
            .required()
    });

    return (schema.validate({ name: nameBody }));
}

// app.post();
// app.delete();
// app.put();