const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');


const Product = sequelize.define('Produc', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    lotnumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    entrydate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
},{
    timestamps: true,
    tableName: 'products'
});

module.exports = Product;