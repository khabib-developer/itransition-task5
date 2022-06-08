const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: "localhost",
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
    port: "8889",
  }
);

const User = require("./User.js")(sequelize);
const Message = require("./Message.js")(sequelize);

User.hasMany(Message, {
  foreignKey: "sender",
});

User.hasMany(Message, {
  foreignKey: "recipient",
});

module.exports = {
  sequelize,
  User,
  Message,
};
