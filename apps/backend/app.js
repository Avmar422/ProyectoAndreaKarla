const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


const librosRouter = require(path.join(process.cwd(), "src/routes/libros.routes"));

app.use('/api/libros', librosRouter);

app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

module.exports = app;