const {Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    timestamps: true,
    tableName: 'roles'
});

module.exports = Role;