module.exports = app => {
  const pollution = require("../controllers/pollution.controllers.js");

  var router = require("express").Router();





  app.use('/api/pollution', router);
  router.get("/", pollution.get);
  router.get("/:id", pollution.findOne);
  router.post("/", pollution.create);
  router.put("/:id", pollution.update);
  router.delete("/:id", pollution.delete);
};