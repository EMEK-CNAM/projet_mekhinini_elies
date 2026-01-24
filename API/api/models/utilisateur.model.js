module.exports = (sequelize, Sequelize) => {
  const Utilisateur = sequelize.define("utilisateur", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    nom: {
      type: Sequelize.STRING
    },
    prenom: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  });

  return Utilisateur;
}; 
