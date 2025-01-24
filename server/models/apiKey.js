module.exports = (sequelize, DataTypes) => {
    const ApiKey = sequelize.define('ApiKey', {
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
        indexes: [
            {
                unique: true,
                fields: ['userId', 'provider']
            }
        ]
    });

    return ApiKey;
}; 