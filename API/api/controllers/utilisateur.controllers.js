const { v4: uuidv4 } = require("uuid");

const db = require("../models");
const e = require("express");
const Utilisateurs = db.utilisateurs;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
  Utilisateurs.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving utilisateurs.",
      });
    });
};

// Find a single Utilisateur with an email
exports.login = (req, res) => {
  const utilisateur = {
    email: req.body.email,
    password: req.body.password,
  };

  // Validate request
  if (!utilisateur.email || !utilisateur.password) {
    return res.status(400).send({
      message: "Email et password requis",
    });
  }

  Utilisateurs.findOne({ where: { email: utilisateur.email } })
    .then((data) => {
      if (data) {
        // Vérification simple du mot de passe (à améliorer avec bcrypt en production)
        if (data.password === utilisateur.password) {
          const user = {
            id: data.id,
            nom: data.nom,
            prenom: data.prenom,
            email: data.email,
          };
          res.send(user);
        } else {
          res.status(401).send({
            message: "Mot de passe incorrect",
          });
        }
      } else {
        res.status(404).send({
          message: `Utilisateur introuvable avec l'email ${utilisateur.email}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Erreur lors de la connexion: " + err.message,
      });
    });
};

// Create and Save a new Utilisateur
exports.register = (req, res) => {
  // Validate request
  if (!req.body.email || !req.body.password) {
    res.status(400).send({
      message: "Email et password requis",
    });
    return;
  }
  const utilisateur = {
    password: req.body.password,
    nom: req.body.nom,
    prenom: req.body.prenom,
    email: req.body.email,
  };
  // Save Utilisateur in the database
  Utilisateurs.create(utilisateur)
    .then((data) => {
      const response = {
        id: data.id,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
      };
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Erreur lors de la création de l'utilisateur",
      });
    });
};

// Retrieve profile utilisateur by id
exports.getProfile = (req, res) => {
  const id = req.params.id;
  Utilisateurs.findByPk(id)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: "Utilisateur not found",
        });
      }
      res.send(data);
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message,
      });
    });
};

// Delete a Utilisateur with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Utilisateurs.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Utilisateur was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Utilisateur with id=${id}. Maybe Utilisateur was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Utilisateur with id=" + id,
      });
    });
};