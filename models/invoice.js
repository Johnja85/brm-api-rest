const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const User = require('./user');

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
},{
    timestamps: true,
    tableName: 'invioces'
});

Invoice.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Invoice, { foreignKey: 'userId'});

module.exports = Invoice;