const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "root",
  database: "AbrahamEventSphere_Database",
  port: 3306,
  timezone: "-04:00",
  dialectOptions: {
    dateStrings: true,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log(
      `¡Database '${sequelize.getDatabaseName()}' Connected Successfully! ✅`
    );
  })
  .catch((error) => {
    console.error(
      `Unable to Connect to the Database '${sequelize.getDatabaseName()}': ${error}.`
    );
  });

module.exports = sequelize;
