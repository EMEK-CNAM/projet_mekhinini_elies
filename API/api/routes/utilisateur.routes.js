

module.exports = app => {
  const utilisateur = require("../controllers/utilisateur.controllers.js");

  var router = require("express").Router();


  // login utilisateur
  router.post("/login", utilisateur.login);
  router.post("/register", utilisateur.register);
  router.get("/profile/:id", utilisateur.getProfile);
  router.delete("/:id", utilisateur.delete);
  // all utilisateurs
  router.get("/", utilisateur.findAll);

  app.use('/api/utilisateur', router);
};
