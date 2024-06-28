const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Invoice = require('./invoice');
const Product = require('./product');

const InvoiceDetail = sequelize.define('InvoiceDetail', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    invoiceId: {
        type: DataTypes.INTEGER,
        references: {
            model: Invoice,
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id'
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'invoicedetail'
});

Invoice.hasMany(InvoiceDetail, { foreignKey: 'invoiceId' });
InvoiceDetail.belongsTo(Invoice, { foreignKey: 'invoiceId' });

Product.hasMany(InvoiceDetail, { foreignKey: 'productId' });
InvoiceDetail.belongsTo(Product, { foreignKey: 'productId' });

module.exports = InvoiceDetail;
