const dbConfig = require("../config/db.config");

const {Sequelize,DataTypes} = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

sequelize.authenticate()
.then(()=>{
  console.log("connection successfull")
})
.catch(err=>{
  console.log("error")
})

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require('./user')(sequelize, DataTypes);
db.book = require('./book')(sequelize, DataTypes);




// sync
db.sequelize.sync({force:false})
.then(()=>{
  console.log("yes re-sync")
})

module.exports = db;