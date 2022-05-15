module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define("book", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        userId:{
         type:DataTypes.INTEGER,
         references: {
             model: 'users',
             key: 'id'
         }
        },
        title: {
            type: DataTypes.STRING,
            required:true
        },
        author: {
            type: DataTypes.STRING,
            required:true
        },
        ISBN:{
            type: DataTypes.BIGINT(1),
            required:true
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
    return Book;
};