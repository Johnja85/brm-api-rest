const express = require('express');
const bcrypt = require('bcrypt')
const route = express.Router();
const Joi = require('joi');
const verifyToken = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const User = require('../models/user');
const Role = require('../models/role');

/**
 * @api {get} /api/users/ Get All users
 * @apiName GetUsers 
 * @apiGroup User
 * @apiPermission admin
 * @apiHeader {String} Authorization Bearer token
 * 
 * @apiSucces {Object[]} users list of users.
 */
route.get('/', verifyToken, authorize('1'), async (req, res) => {
    try {
        let users = await get();
        if (!users) {
            res.status(400).send('User is not found');
            return; 
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

/**
 * @api {get} /api/users/:id Get user by ID
 * @apiName GetUser
 * @apiGroup User
 * @apiPermission admin
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {Object} user User object.
 */
route.get('/:id', verifyToken, authorize('1'), async (req, res) => {
        let user = await get(req.params.id);
        if (!user) {
            res.status(400).send('User is not found');
            return;
        };
        res.status(200).json(user);
});

/**
* @api {post} /api/users Crear un nuevo usuario
* @apiName CreateUser
* @apiGroup User
* @apiParam {String} username Nombre de usuario.
* @apiParam {String} password Contraseña del usuario.
* @apiParam {Number} roleId ID del rol del usuario.
* @apiParamExample {json} Request-Example:
*     {
*       "username": "johndoe",
*       "password": "password123",
*       "roleId": 1
*     }
* @apiSuccess {Object} user Detalles del usuario creado.
* @apiSuccess {Number} user.id ID del usuario.
* @apiSuccess {String} user.username Nombre de usuario.
* @apiSuccess {Object} user.role Rol del usuario.
* @apiSuccess {String} user.role.name Nombre del rol.
*/
route.post('/', async (req, res) => {
    try {
       const { error, value } = validateUser(req.body);
       if (!error) {
            const roleExists = await Role.findByPk(value.roleId);
            if (!roleExists) {
                return res.status(400).send('Invalid roleId, does not exist');
            }
            const newUser = await create(value);
            res.status(201).json(newUser);
        } else {
            res.status(400).send(error.details[0].message);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});


/**
 * @api {put} /api/users/:id Put user by ID
 * @apiName PutUsers 
 * @apiGroup User
 * @apiPermission admin
 * @apiHeader {String} Authorization Bearer token
 * 
 * @apiSucces {Object[]} users list of users.
 */
route.put('/:id', verifyToken, authorize('1'), (req, res) => {
    let user = get(req.params.id);
    if (!user) {
        res.status(400).json('User is not found');
        return;
    };

    const {error, value} = validateUser(req.body);
    if (!error) {
        user.name = value.name;
        res.send(user);
    } else {
        res.status(400).send(error.details[0].message);
    }
    console.log(user);
});

route.delete('/:id', verifyToken, (req, res) => {
    let user = get(req.params.id);
    if (!user) {
        res.status(400).send('User is not found');
        return;
    };

    const index = user.indexOf(user);
    users.splice(index, 1);

    res.status(200).json(user);
});

function validateUser(body) {
    const schema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(10)
            .required(),
            
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

        roleId: Joi.number()
            .min(1)
            .max(10)
            .required()
    });
    return (schema.validate({ username: body.username, password: body.password, roleId: body.roleId }));
}

async function get(id) {
    try {
        let user = '';
        if (id) {
            user = await User.findByPk(id, {
                attributes: ['id','username'],
                include:[
                    {
                        model: Role,
                        attributes:['name']
                    }
                ]
            });
        } else {
            user = await User.findAll({
                attributes: ['id','username'],
                include:[
                    {
                        model: Role,
                        attributes:['name']
                    }
                ]
            });
        }
        
        return user;
    } catch (error) {
        return error;
    }
}

async function create(body) {
    
    const hashedPassword = bcrypt.hashSync(body.password, 10);
    const newUser = await User.create({
        username: body.username,
        password: hashedPassword,
        roleId: body.roleId
    });
    return newUser;
}

async function deleted(user){
    try {

        const index = await User.indexOf(user);
        User.splice(index, 1);
        let users = await User.findAll({
            attributes: ['id','username'],
            include:[
                {
                    model: Role,
                    attributes:['name']
                }
            ]
        });
        return users;
    } catch (error) {
        return error;
    }
}

module.exports = {
    route
}