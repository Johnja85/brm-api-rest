const express = require('express');
const route = express.Router();
const Joi = require('joi');
const verifyToken = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const Invoice = require('../models/invoice');
const InvoiceDetail = require('../models/invoiceDetail');
const User = require('../models/user');
const Product = require('../models/product');

/**
 * @api {get} /api/invoices Retrieve all invoices
 * @apiName GetInvoices
 * @apiGroup Invoices
 *
 * @apiSuccess {Object[]} invoices List of invoices.
 * @apiSuccess {String} invoices.id Invoice's ID.
 * @apiSuccess {Number} invoices.userId User ID associated with the invoice.
 * @apiSuccess {String} invoices.username Username associated with the invoice.
 * @apiSuccess {Number} invoices.total Total amount of the invoice.
 * @apiSuccess {Object[]} invoices.products List of products associated with the invoice.
 * @apiSuccess {Number} invoices.products.productId Product's ID.
 * @apiSuccess {String} invoices.products.description Product's description.
 * @apiSuccess {Number} invoices.products.amount Amount of the product in the invoice.
 * @apiSuccess {Number} invoices.products.price Price of the product in the invoice.
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     [
 *       {
 *         "id": "1",
 *         "userId": 1,
 *         "username": "user1",
 *         "total": 250.5,
 *         "InvoiceDetails": [
 *           {
 *             "productId": 1,
 *             "description": "Product A",
 *             "amount": 2,
 *             "price": 100
 *           },
 *           {
 *             "productId": 2,
 *             "description": "Product B",
 *             "amount": 1,
 *             "price": 50.5
 *           }
 *         ]
 *       },
 *       {
 *         "id": "2",
 *         "userId": 2,
 *         "username": "user2",
 *         "total": 150,
 *         "InvoiceDetails": [
 *           {
 *             "productId": 3,
 *             "description": "Product C",
 *             "amount": 3,
 *             "price": 50
 *           }
 *         ]
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
route.get('/', verifyToken, async (req, res) => {
    try {
        let invoice = await get();
        if (!invoice) {
            res.status(400).send('Invoice is not found');
            return; 
        }
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

/**
 * @api {get} /api/invoices/:id Retrieve an invoice by ID
 * @apiName GetInvoiceById
 * @apiGroup Invoices
 *
 * @apiParam {Number} id Invoice's unique ID.
 *
 * @apiSuccess {String} id Invoice's ID.
 * @apiSuccess {Number} userId User ID associated with the invoice.
 * @apiSuccess {String} username Username associated with the invoice.
 * @apiSuccess {Number} total Total amount of the invoice.
 * @apiSuccess {Object[]} products List of products associated with the invoice.
 * @apiSuccess {Number} products.productId Product's ID.
 * @apiSuccess {String} products.description Product's description.
 * @apiSuccess {Number} products.amount Amount of the product in the invoice.
 * @apiSuccess {Number} products.price Price of the product in the invoice.
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     {
 *       "invoice": {
 *         "id": "1",
 *         "userId": 1,
 *         "username": "user1",
 *         "total": 250.5,
 *         "products": [
 *           {
 *             "id": 1
 *             "productId": 1,
 *             "description": "Product A",
 *             "amount": 2,
 *             "price": 100
 *           },
 *           {
 *             "id": 3
 *             "productId": 2,
 *             "description": "Product B",
 *             "amount": 1,
 *             "price": 50.5
 *           }
 *         ]
 *       }
 *     }
 *
 * @apiError (Error 400) {String} error Error message.
 *
 * @apiErrorExample Error-Response:
 *     400 Bad Request
 *     {
 *       "error": "Invoice is not found"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     500 Internal Server Error
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
route.get('/:id', verifyToken, async (req, res) => {
    let invoice = await get(req.params.id);
    if (!invoice) {
        res.status(400).send('User is not found');
        return;
    };
    res.status(200).json(invoice);
});

/**
 * @api {post} /api/invoices Create a new invoice
 * @apiName CreateInvoice
 * @apiGroup Invoices
 *
 * @apiPermission customer
 *
 * @apiParam {Number} userId User ID associated with the invoice.
 * @apiParam {String} username Username associated with the invoice.
 * @apiParam {Object[]} products Array of products to be included in the invoice.
 * @apiParam {Number} products.productId Product's ID.
 * @apiParam {String} products.description Product's description.
 * @apiParam {Number} products.amount Amount of the product in the invoice.
 *
 * @apiSuccess {Object} invoice Newly created invoice.
 * @apiSuccess {String} invoice.id Invoice's ID.
 * @apiSuccess {Number} invoice.userId User ID associated with the invoice.
 * @apiSuccess {String} invoice.username Username associated with the invoice.
 * @apiSuccess {Number} invoice.total Total amount of the invoice.
 * @apiSuccess {Object[]} invoice.products List of products associated with the invoice.
 * @apiSuccess {Number} invoice.products.productId Product's ID.
 * @apiSuccess {String} invoice.products.description Product's description.
 * @apiSuccess {Number} invoice.products.amount Amount of the product in the invoice.
 * @apiSuccess {Number} invoice.products.price Price of the product in the invoice.
 *
 * @apiSuccessExample Success-Response:
 *     201 Created
 *     {
 *       "invoice": {
 *         "id": "1",
 *         "userId": 1,
 *         "username": "user1",
 *         "total": 250.5,
 *         "products": [
 *           {
 *             "id": 1
 *             "productId": 1,
 *             "description": "Product A",
 *             "amount": 2,
 *             "price": 100
 *           },
 *           {
 *             "id": 3
 *             "productId": 2,
 *             "description": "Product B",
 *             "amount": 1,
 *             "price": 50.5
 *           }
 *         ]
 *       }
 *     }
 *
 * @apiError (Error 400) {String} error Error message.
 *
 * @apiErrorExample Error-Response:
 *     400 Bad Request
 *     {
 *       "error": "Validation error: Missing required field 'userId'"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     500 Internal Server Error
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
route.post('/', verifyToken, authorize('2'), async (req, res) => {
    try {
        const { products, ...invoiceHeader } = req.body;
        const { error, value } = validateInvoice(invoiceHeader);

        if (!error) {
            const valueProducts = validateProducts(products);
            valueProducts.map(product => {
                if (product.error) {
                   res.status(400).json(product.error);
                }
            });
            
            const newInvoice = await create(value, valueProducts);
            res.status(201).json(newInvoice);
            
        } else {
            res.status(400).send(error.details[0].message);
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
});

async function get(id){

    try {
        let invoice = '';
        if (id) {
            invoice = await Invoice.findByPk(id, {
                include: [
                    {
                        model: InvoiceDetail,
                        attributes: ['productId', 'description', 'amount', 'price']
                    }
                ] 
            });
        } else {
            invoice = await Invoice.findAll({
                include: [
                    {
                        model: InvoiceDetail,
                        attributes: ['productId', 'description', 'amount', 'price']
                    }
                ] 
            });
        }
        return invoice;
    } catch (error) {
        return { error: error.message };
    }
}

async function create(invoice, products) {
    try { 

        const userExists = await User.findByPk(invoice.userId);
        if (!userExists) {
            throw new Error('UserID does not exist: ' + invoice.userId);
        }
        
        let total = 0;
        const validProducts = await Promise.all(products.map(async (product) => {
            let validatedproduct = await Product.findByPk(product.value.productId);
            if (!validatedproduct) {
                throw new Error('ProductID does not exist: ' + invoice.value.userId);
            }
            if (validatedproduct.dataValues.stock <= product.value.amount) {
                throw new Error('Not enough stock for product: ' + validatedproduct.dataValues.description )
            }
            let newStock = validatedproduct.dataValues.stock - product.value.amount;
            await validatedproduct.update({
                stock: newStock
            });
            // await validatedproduct.save({ transaction: t });

            total += validatedproduct.dataValues.price * product.value.amount;
            return {
                ...product,
                price: validatedproduct.dataValues.price
            };
        }));

        const newInvoice = await Invoice.create({
            userId: invoice.userId,
            username: invoice.username,
            total: total
        });

        const invoiceDetails = await Promise.all(validProducts.map(async (product) => {
            const newProductsDetail = await InvoiceDetail.create({
                invoiceId: newInvoice.id,
                productId: product.value.productId,
                description: product.value.description,
                amount: product.value.amount,
                price: product.price
            });
            return newProductsDetail;
        }));

        return { 
            invoice: newInvoice,
            products: invoiceDetails
        }
    } catch (error) {
        return { error: error.message };
    }
}

async function putStockProduct(validatedproduct, product) {
    const newStock = validatedproduct.dataValues.stock - product.value.amount;

    validatedproduct.dataValues.stock = newStock;
    await validatedproduct.save();
}
function validateInvoice(body) {
    const schema = Joi.object({
        userId: Joi.number()
            .max(10)
            .required(),
            
        username: Joi.string()
            .min(3)
            .max(10)
            .required()
    });
    return (schema.validate({ userId: body.userId, username: body.username }));
}

function validateProducts(products) {
    const schema = Joi.object({
        productId: Joi.number()
            .max(10)
            .required(),
            
        description: Joi.string()
            .min(3)
            .max(255)
            .required(),
        
        amount: Joi.number()
            .required()
    });
    let validatedProducts = products.map(product => {
        const { error, value } = schema.validate({ 
            productId: product.productId,
            description: product.description, 
            amount: product.amount 

        });
        return { error, value };
    });

    return validatedProducts;
}

module.exports = {
    route
}