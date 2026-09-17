const express = require("express");
const cors = require("cors");
const librosRouter = require('./routes/libros.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/libros',librosRouter);

app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

module.exports = app;