const express = require('express');
const route = express.Router();
const Joi = require('joi');
const verifyToken = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const Product = require('../models/product');

/**
 * @api {get} /api/products Retrieve all products
 * @apiName GetProducts
 * @apiGroup Products
 *
 * @apiPermission admin
 *
 * @apiSuccess {Object[]} products List of products.
 * @apiSuccess {String} products.id Product's ID.
 * @apiSuccess {String} products.description Product's description.
 * @apiSuccess {String} products.lotnumber Product's lot number.
 * @apiSuccess {Number} products.price Product's price.
 * @apiSuccess {Number} products.stock Product's stock quantity.
 * @apiSuccess {Date} products.entrydate Product's entry date.
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     [
 *       {
 *         "id": "1",
 *         "description": "Product A",
 *         "lotnumber": "AB123",
 *         "price": 10.99,
 *         "stock": 100,
 *         "active": true,
 *         "entrydate": "2023-01-01T00:00:00.000Z"
 *       },
 *       {
 *         "id": "2",
 *         "description": "Product B",
 *         "lotnumber": "CD456",
 *         "price": 15.75,
 *         "stock": 50,
 *         "active": true,
 *         "entrydate": "2023-01-02T00:00:00.000Z"
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
route.get('/', verifyToken, authorize('1'), async (req, res) => {
    try {
        let products = await get();
        if (!products) {
            res.status(400).send('Product is not found');
            return; 
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

/**
 * @api {get} /api/products/:id Retrieve a product by ID
 * @apiName GetProductById
 * @apiGroup Products
 *
 * @apiPermission admin
 *
 * @apiParam {Number} id Product's unique ID.
 *
 * @apiSuccess {String} id Product's ID.
 * @apiSuccess {String} description Product's description.
 * @apiSuccess {String} lotnumber Product's lot number.
 * @apiSuccess {Number} price Product's price.
 * @apiSuccess {Number} stock Product's stock quantity.
 * @apiSuccess {Date} entrydate Product's entry date.
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     {
 *       "id": "1",
 *       "description": "Product A",
 *       "lotnumber": "AB123",
 *       "price": 10.99,
 *       "stock": 100,
 *       "active": true,
 *     }
 *
 * @apiError (Error 400) {String} error Error message.
 *
 * @apiErrorExample Error-Response:
 *     400 Bad Request
 *     {
 *       "error": "Product is not found"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     500 Internal Server Error
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
route.get('/:id', verifyToken, authorize('1'), async (req, res) => {
    let product = await get(req.params.id);
    if (!product) {
        res.status(400).send('Product is not found');
        return;
    };
    res.status(200).json(product);
});

/**
 * @api {post} /api/products Create a new product
 * @apiName CreateProduct
 * @apiGroup Products
 *
 * @apiPermission admin
 *
 * @apiParam {String} description Product's description.
 * @apiParam {String} lotnumber Product's lot number.
 * @apiParam {Number} price Product's price.
 * @apiParam {Number} stock Product's stock quantity.
 * @apiParam {Date} entrydate Product's entry date.
 *
 * @apiSuccess {Object} product Newly created product.
 * @apiSuccess {String} product.id Product's ID.
 * @apiSuccess {String} product.description Product's description.
 * @apiSuccess {String} product.lotnumber Product's lot number.
 * @apiSuccess {Number} product.price Product's price.
 * @apiSuccess {Number} product.stock Product's stock quantity.
 * @apiSuccess {Date} product.entrydate Product's entry date.
 *
 * @apiSuccessExample Success-Response:
 *     201 Created
 *     {
 *       "description": "New Product",
 *       "lotnumber": "XY789",
 *       "price": 20.5,
 *       "stock": 75,
 *     }
 *
 * @apiError (Error 400) {String} error Error message.
 *
 * @apiErrorExample Error-Response:
 *     400 Bad Request
 *     {
 *       "error": "Validation error: Description must be between 3 and 20 characters"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     500 Internal Server Error
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
route.post('/', verifyToken, authorize('1'), async (req, res) => {
    try {
        const { error, value } = validateProduct(req.body);
        if (!error) {
            const newProduct = await create(value);
            res.status(201).json(newProduct);
        } else {
            res.status(400).send(error.details[0].message);
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
});

/**
 * @api {put} /api/products/:id Update a product
 * @apiName UpdateProduct
 * @apiGroup Products
 *
 * @apiPermission admin
 *
 * @apiParam {Number} id Product's unique ID.
 * @apiParam {String} description Product's description.
 * @apiParam {String} lotnumber Product's lot number.
 * @apiParam {Number} price Product's price.
 * @apiParam {Number} stock Product's stock quantity.
 * @apiParam {Date} entrydate Product's entry date.
 *
 * @apiSuccess {Object} product Updated product.
 * @apiSuccess {String} product.id Product's ID.
 * @apiSuccess {String} product.description Product's description.
 * @apiSuccess {String} product.lotnumber Product's lot number.
 * @apiSuccess {Number} product.price Product's price.
 * @apiSuccess {Number} product.stock Product's stock quantity.
 * @apiSuccess {Date} product.entrydate Product's entry date.
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     {
 *       "description": "Updated Product A",
 *       "lotnumber": "AB123",
 *       "price": 12.99,
 *       "stock": 90,
 *       "entrydate": "2023-01-01"
 *     }
 *
 * @apiError (Error 400) {String} error Error message.
 *
 * @apiErrorExample Error-Response:
 *     400 Bad Request
 *     {
 *       "error": "Product not found"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     500 Internal Server Error
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
route.put('/:id', verifyToken, authorize('1'), async(req, res) => {
    try {
        const {error, value} = validateProduct(req.body);
        if (error) {
            res.status(400).json(error);
            return;
        }
        const productId = req.params.id;
        let product = await Product.findByPk(productId);
        if (!product) {
            res.status(400).json({error: 'Product not found'});
            return;
        }

        await product.update({
            description: value.description,
            lotnumber: value.lotnumber,
            price: value.price,
            stock: value.stock,
            entrydate: value.entrydate,
        });
    
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @api {delete} /api/products/:id Deactivate a product
 * @apiName DeactivateProduct
 * @apiGroup Products
 *
 * @apiPermission admin
 *
 * @apiParam {Number} id Product's unique ID.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiSuccessExample Success-Response:
 *     204 No Content
 *     {
 *       "message": "Product deactivated successfully"
 *     }
 *
 * @apiError (Error 404) {String} error Error message.
 *
 * @apiErrorExample Error-Response:
 *     404 Not Found
 *     {
 *       "error": "Product not found"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     500 Internal Server Error
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
route.delete('/:id', verifyToken, authorize('1'), async(req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        product.active = false;
        await product.save();

        res.status(204).json({ message: 'Product deactivated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function get(id){

    try {
        let products = '';
        if (id) {
            products = await Product.findByPk(id,{
                where: { active: true }
            });
        } else {
            products = await Product.findAll({
                where: { active: true } 
            });
        }
        return products;
    } catch (error) {
        return error;
    }
}

async function create(body){
    try {
        let products = await Product.create(body);
        return products;
    } catch (error) {
        return error;
    }
}

function validateProduct(body) {
    const schema = Joi.object({
        description: Joi.string()
            .min(3)
            .max(20)
            .required(),

        lotnumber: Joi.string()
            .required(),  
        
        price: Joi.number()
            .required(),
        
        stock: Joi.number()
            .required(),
        
        entrydate: Joi.date()
            .required()
    });

    return (schema.validate({ 
        description: body.description, 
        lotnumber: body.lotnumber, 
        price: body.price, 
        stock: body.stock, 
        entrydate: body.entrydate 
    }));

}

module.exports = {
    route
}