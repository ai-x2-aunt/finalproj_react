const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

const db = {};

// ApiKey 모델 정의
const ApiKey = config.define('ApiKey', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: false
    },
    encryptedKey: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    iv: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'ApiKeys',
    indexes: [
        {
            unique: true,
            fields: ['userId', 'provider']
        }
    ]
});

db.sequelize = config;
db.Sequelize = Sequelize;
db.ApiKey = ApiKey;

module.exports = db; 