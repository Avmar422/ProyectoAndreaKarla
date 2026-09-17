const express = require("express");
const router = express.Router();
const librosController = require("..controllers/libros.controller");

router.get("/", librosController.getLibros);
router.get("/:id", librosController.getLibroPorID);
router.post("/", librosController.createLibro);
router.put("/:id", librosController.updateLibro);
router.delete("/:id", librosController.deleteLibro);
router.borrow("/:id", librosController.borrowLibro);

module.exports = router;