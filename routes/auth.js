
const express = require('express');
const config = require('config');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const route = express.Router();

/**
 * @api {post} /api/auth Authenticate a user
 * @apiName AuthenticateUser
 * @apiGroup Authentication
 *
 * @apiParam {String} username User's username.
 * @apiParam {String} password User's password.
 *
 * @apiSuccess {Object} data User's data.
 * @apiSuccess {String} jwtoken JSON Web Token for authenticated user.
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     {
    "data": {
        "username": "prueba",
        "roleId": 1
    },
    "jwtoken": "eyJhbGciOiJIUzI1NiIsInR5c....
}
 *
 * @apiError (Error 400) {String} error Error message.
 * @apiError (Error 400) {String} msj Error details.
 *
 * @apiErrorExample Error-Response:
 *     400 Bad Request
 *     {
 *       "error": "Ok",
 *       "msj": "Incorrect Username or password"
 *     }
 */
route.post('/', (req, res) => {

    const { username, password } = req.body;

    User.findOne({
        where: { username }
    })
    .then(data => {
        if (data) {
            const validPassword = bcrypt.compareSync(password, data.password);
            // console.log("data de autenticación... ", data);
            if (!validPassword) {
                res.status(400).json({
                    error: 'Ok',
                    msj: "Incorrect Username or password"
                });
            }
            const jwtoken = jwt.sign({
                data: { _id: data._id, username: data.username, roleId: data.roleId }
              }, config.get('configToken.SEED'), { expiresIn: config.get('configToken.expiration') });
                            
            res.status(200).json({
                data: {
                    _id: data._id, 
                    username: data.username,
                    roleId: data.roleId
                },
                jwtoken
            });
        } else {
            res.status(400).json({
                error: 'Ok',
                msj: "Incorrect Username or password"
            });
        }
    })
    .catch(err => {
        res.status(400).json({
            error: 'ok',
            msj: 'Error server' + err
        })
    });


})


function authUser(username, password) {
    User.findOne({
        where: { username }
    })
    .then(data => {
        if (data) {
            res.status(201).json(data);
        } else {
            res.status(400).json({
                error: 'Ok',
                msj: "Incorrect Username or password"
            });
        }
    })
    .catch(err => {
        res.status(400).json({
            error: 'ok',
            msj: 'Error server' + err
        })
    });
}

module.exports = {
    route
}