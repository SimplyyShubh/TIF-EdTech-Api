require("dotenv").config();

const { Sequelize, DataTypes } = require("sequelize");

//create new instance of sequelize using creds from env file
const sequelizeInstance = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  dialect: "postgres",
  logging: false,
});

//Connect to the DB
sequelizeInstance
  .authenticate()
  .then(() => {
    console.log("Connection to DB successfull.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

//Create a DB object to export with all the models
const db = {};

db.Sequelize = Sequelize;
db.sequelizeInstance = sequelizeInstance;

db.users = require("./userModel.js")(sequelizeInstance, DataTypes);
db.roles = require("./roleModel.js")(sequelizeInstance, DataTypes);
db.students = require("./studentModel.js")(sequelizeInstance, DataTypes);
db.schools = require("./schoolModel.js")(sequelizeInstance, DataTypes);

//Associations
db.roles.hasMany(db.users) ;
db.users.belongsTo(db.roles) ;

db.students.belongsTo(db.users) ;
db.users.hasMany(db.students) ;

db.students.belongsTo(db.schools) ;
db.schools.hasMany(db.students) ;

//Sync the Models with the Db
db.sequelizeInstance.sync({ }).then(() => {
  console.log("Syncing done");
});

//export the db object
module.exports = db;
