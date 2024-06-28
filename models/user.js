const {Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Role = require('./role');

const User = sequelize.define('User', {
    id: {
       type: DataTypes.INTEGER,
       primaryKey: true,
       autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    roleId: {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: 'id'
        }
    }
},{
    timestamps: true,
    tableName: 'users'
});

User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

module.exports = User;