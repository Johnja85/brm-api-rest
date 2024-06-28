const express = require('express');
const route = express.Router();
const Joi = require('joi');
const verifyToken = require('../middlewares/auth');
const Role = require('../models/role');

/**
 * @api {get} /api/role Retrieve all roles
 * @apiName GetRoles
 * @apiGroup Role
 *
 * @apiPermission admin
 *
 * @apiSuccess {Object[]} roles List of roles.
 * @apiSuccess {String} roles.id Role's ID.
 * @apiSuccess {String} roles.name Role's name.
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     [
 *          {
 *              "id": 1,
 *              "name": "admin",
 *              "createdAt": "2024-06-28T09:14:15.000Z",
 *              "updatedAt": "2024-06-28T09:14:15.000Z"
 *          },
 *          {
 *              "id": 2,
 *              "name": "customer",
 *              "createdAt": "2024-06-28T09:14:23.000Z",
 *              "updatedAt": "2024-06-28T09:14:23.000Z"
 *          }
 *      ]
 *
 * @apiError (Error 500) {String} error Error message.
 *
 * @apiErrorExample Error-Response:
 *     500 Internal Server Error
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
route.get('/', verifyToken, async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json(roles)
    }catch (error){
        res.status(500).json({error: error.message });
    }
});

/**
 * @api {post} /api/role Create a new role
 * @apiName CreateRole
 * @apiGroup Role
 *
 * @apiParam {String} name Role's name.
 *
 * @apiSuccess {Object} role Newly created role.
 * @apiSuccess {String} role.id Role's ID.
 * @apiSuccess {String} role.name Role's name.
 *
 * @apiSuccessExample Success-Response:
 *     201 Created
 *     {
 *       "name": "customer"
 *     }
 *
 * @apiError (Error 400) {String} error Error message.
 *
 * @apiErrorExample Error-Response:
 *     400 Bad Request
 *     {
 *       "error": "Invalid role name"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     500 Internal Server Error
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
route.post('/', async (req, res) => {
    try {
       const { error, value } = validateRole(req.body);
       if (!error) {
            const roleExists = await Role.findOne({ where: {name: value.name}});
            if (roleExists) {
                return res.status(400).send('Invalid role name');
            }
            const newRole = await Role.create(value);
            res.status(201).json(newRole);
        } else {
            res.status(400).send(error.details[0].message);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});


function validateRole(body) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(10)
            .required(),
        }
    )
    return (schema.validate({ name: body.name }));
}

module.exports = {
    route
};
