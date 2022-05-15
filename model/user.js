module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        username: {
            type: DataTypes.STRING,
            required:true,
            unique:true
        },
        email: {
            type: DataTypes.STRING,
            required:true
        },
        password: {
            type: DataTypes.STRING,
        },
        dob: {
            type: DataTypes.DATE
        },
        createdAt: {
            allowNull: true,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: true,
            type: DataTypes.DATE
        }
    });
    return User;
};