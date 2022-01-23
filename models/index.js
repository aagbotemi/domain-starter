const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    pool: {
      min: 0,
      max: 5,
      acquire: 5000,
      Idle: 1000,
    },
  }
);

sequelize
  .authenticate()
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("cannot connect" + err));

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./users")(sequelize, Sequelize);
db.roles = require("./roles")(sequelize, Sequelize);
db.partnerOrganisation = require("./partnerOrganisation")(sequelize, Sequelize);
db.states = require("./states")(sequelize, Sequelize);
db.cities = require("./cities")(sequelize, Sequelize);
db.trainingCategories = require("./trainingCategories")(sequelize, Sequelize);
db.beneficiaries = require("./beneficiaries")(sequelize, Sequelize);
db.trainingBatch = require("./trainingBatch")(sequelize, Sequelize);
db.geoPoliticalZones = require("./geoPoliticalZones")(sequelize, Sequelize);
db.auditTrail = require("./auditTrail")(sequelize, Sequelize);
// db.partnerorganisationcategory = require("./partnerorganisationcategory")(sequelize, Sequelize);



db.users.belongsToMany(db.roles, { through: "usersRoles" });
db.roles.belongsToMany(db.users, { through: "usersRoles" });

db.partnerOrganisation.hasMany(db.users);
db.users.belongsTo(db.partnerOrganisation);

db.partnerOrganisation.belongsToMany(db.trainingCategories, {
  through: "partnerorganisationcategory",
});
db.trainingCategories.belongsToMany(db.partnerOrganisation, {
  through: "partnerorganisationcategory",
});

db.states.hasOne(db.partnerOrganisation);
db.partnerOrganisation.belongsTo(db.states);

db.states.hasOne(db.cities);
db.cities.belongsTo(db.states);

db.geoPoliticalZones.hasOne(db.states);
db.states.belongsTo(db.geoPoliticalZones);

db.partnerOrganisation.hasOne(db.beneficiaries);
db.beneficiaries.belongsTo(db.partnerOrganisation);

db.trainingBatch.hasOne(db.beneficiaries);
db.beneficiaries.belongsTo(db.trainingBatch);

db.trainingCategories.hasOne(db.beneficiaries);
db.beneficiaries.belongsTo(db.trainingCategories);

db.partnerOrganisation.hasMany(db.trainingBatch);
db.trainingBatch.belongsTo(db.partnerOrganisation);

db.ROLES = ["user", "admin", "PO"]; // added newly

module.exports = db;
