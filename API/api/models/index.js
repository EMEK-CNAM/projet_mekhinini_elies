const { Sequelize } = require("sequelize");
const { BDD } = require("../config");

const normalizeJdbcToUri = (jdbc) => {
  if (!jdbc) return "";
  const trimmed = jdbc.trim();
  if (!trimmed.startsWith("jdbc:")) return trimmed;
  return trimmed.replace(/^jdbc:/, "");
};

const dbUrl = normalizeJdbcToUri(BDD.jdbc);

const sequelize = new Sequelize(dbUrl, {
  dialect: BDD.dialect || "mariadb",
  define: { timestamps: false }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.pollution = require("./pollution.model.js")(sequelize, Sequelize);
db.utilisateurs = require("./utilisateur.model.js")(sequelize, Sequelize);

module.exports = db;
