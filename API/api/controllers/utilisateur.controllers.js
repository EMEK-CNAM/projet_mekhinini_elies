const { v4: uuidv4 } = require("uuid");


const db = require("../models");
const e = require("express");
const Utilisateurs = db.utilisateurs;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
  Utilisateurs.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving utilisateurs."
      });
    });
};

// Find a single Utilisateur with an login
exports.login = (req, res) => {
  const utilisateur = {
    login: req.body.login,
    password: req.body.password
  };

  // Test
  let pattern = /^[A-Za-z0-9]{1,20}$/;
  if (pattern.test(utilisateur.login) && pattern.test(utilisateur.password)) {
    Utilisateurs.findOne({ where: { login: utilisateur.login } })
      .then(data => {
        if (data) {
          const user = {
            id: data.id,
            name: data.nom,
            email: data.email
          };

          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Utilisateur with login=${utilisateur.login}.`
          });
        }
      })
      .catch(err => {
        res.status(400).send({
          message: "Error retrieving Utilisateur with login=" + utilisateur.login
        });
      });
  } else {
    res.status(400).send({
      message: "Login ou password incorrect"
    });
  }
};

// Create and Save a new Utilisateur
exports.register = (req, res) => {
  // Validate request
  if (!req.body.login || !req.body.password) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  const utilisateur = {
    id: uuidv4(),
    login: req.body.login,
    password: req.body.password,
    nom: req.body.nom,
    prenom: req.body.prenom,
    email: req.body.email
  };
  // Save Utilisateur in the database
  Utilisateurs.create(utilisateur)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Utilisateur."
      });
    });
};

// Retrieve profile utilisateur by id
exports.getProfile = (req, res) => {
  const id = req.params.id;
  Utilisateurs.findByPk(id)
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: "Utilisateur not found"
        });
      }
      res.send(data);
    })
    .catch(err => {
      res.status(400).send({
        message: err.message
      });
    });
};

// Delete a Utilisateur with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Utilisateurs.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Utilisateur was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Utilisateur with id=${id}. Maybe Utilisateur was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Utilisateur with id=" + id
      });
    });
};
