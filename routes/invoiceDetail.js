const express = require('express');
const route = express.Router();
const verifyToken = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const InvoiceDetail = require('../models/invoiceDetail');

/**
 * @api {get} /invoiceDetail Retrieve all invoice details
 * @apiName GetInvoiceDetails
 * @apiGroup InvoiceDetails
 *
 * @apiPermission manager
 *
 * @apiSuccess {Object[]} details List of invoice details.
 * @apiSuccess {Number} details.id Detail's ID.
 * @apiSuccess {Number} details.invoiceId Invoice ID associated with the detail.
 * @apiSuccess {Number} details.productId Product ID associated with the detail.
 * @apiSuccess {String} details.description Description of the product in the detail.
 * @apiSuccess {Number} details.amount Amount of the product in the detail.
 * @apiSuccess {Number} details.price Price of the product in the detail.
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     [
 *       {
 *         "id": 1,
 *         "invoiceId": 1,
 *         "productId": 1,
 *         "description": "Product A",
 *         "amount": 2,
 *         "price": 100
 *       },
 *       {
 *         "id": 2,
 *         "invoiceId": 1,
 *         "productId": 2,
 *         "description": "Product B",
 *         "amount": 1,
 *         "price": 50.5
 *       }
 *     ]
 *
 * @apiError (Error 500) {String} error Error message.
 *
 * @apiErrorExample Error-Response:
 *     500 Internal Server Error
 *     {
 *       "error": "Internal Server Error"
 *     }
 */

route.get('/', verifyToken, authorize('2'), async (req, res) => {
    try {
        let detail = await get();
        if (!detail) {
            res.status(400).send('Products histoy not found');
            return; 
        }
        res.status(200).json(detail);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

/**
 * @api {get} /api/invoiceDetail/:id Retrieve invoice detail by ID
 * @apiName GetInvoiceDetailById
 * @apiGroup InvoiceDetails
 *
 * @apiPermission customer
 *
 * @apiParam {Number} id Detail's unique ID.
 *
 * @apiSuccess {Number} id Detail's ID.
 * @apiSuccess {Number} invoiceId Invoice ID associated with the detail.
 * @apiSuccess {Number} productId Product ID associated with the detail.
 * @apiSuccess {String} description Description of the product in the detail.
 * @apiSuccess {Number} amount Amount of the product in the detail.
 * @apiSuccess {Number} price Price of the product in the detail.
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     {
 *       "id": 1,
 *       "invoiceId": 1,
 *       "productId": 1,
 *       "description": "Product A",
 *       "amount": 2,
 *       "price": 100
 *     }
 *
 * @apiError (Error 400) {String} error Error message.
 *
 * @apiErrorExample Error-Response:
 *     400 Bad Request
 *     {
 *       "error": "Product history not found"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     500 Internal Server Error
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
route.get('/:id', verifyToken, authorize('2'), async (req, res) => {
    let detail = await get(req.params.id);
    if (detail === undefined || detail === null || detail.length === 0) {
        res.status(400).send('Product history not found');
        return;
    };
    res.status(200).json(detail);
});


async function get(id){

    try {
        let detail = '';
        if (id) {
            detail = await InvoiceDetail.findAll({ where: {productId: id} });
        } else {
            detail = await InvoiceDetail.findAll();
        }
        return detail;
    } catch (error) {
        return { error: error.message };
    }
}

module.exports = {
    route
}