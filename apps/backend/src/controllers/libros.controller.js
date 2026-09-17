const path = require("path");
const { leerJson, escribirJson } = require("..utils/fileStorage");

const librosPath = path.join(__dirname, "..data/libros.json");

// GET
const getLibros = async (req, res) => {
  try {
    const libros = await leerJson(librosPath);
    res.json(libros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ID
const getLibroPorID = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "El ID debe ser un número entero válido" });
  }

  try {
    const libros = await leerJson(librosPath);
    const libro = libros.find((item) => item.id === id);

    if (!libro) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    res.json(libro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST 
const createLibro = async (req, res) => {
  const { titulo, autor, genero, sinopsis, estado, disponibilidad } = req.body || {};

  if (typeof titulo !== "string" || !titulo.trim()) {
    return res.status(400).json({ error: "El campo Titulo es obligatorio" });
  }

  if (typeof autor !== "string" || !autor.trim()) {
    return res.status(400).json({ error: "El campo Autor es obligatorio" });
  }

  if (/^\d+$/.test(autor.trim())) {
    return res.status(400).json({ error: "El Autor no puede contener números" });
  }

  if (typeof genero !== "string" || !genero.trim()) {
    return res.status(400).json({ error: "El campo Genero es obligatorio" });
  }

  if (typeof sinopsis !== "string" || !sinopsis.trim()) {
    return res.status(400).json({ error: "El campo Sinopsis es obligatorio" });
  }

  const estadosValidos = ["Bueno", "Malo", "Delicado"];
  if (typeof estado !== "string" || !estado.trim() || !estadosValidos.includes(estado.trim())) {
    return res.status(400).json({ error: `Estado incorrecto, los estados correctos son: ${estadosValidos.join(", ")}` });
  }

  if (typeof disponibilidad !== "string" || !disponibilidad.trim()) {
    return res.status(400).json({ error: "El campo Disponibilidad es obligatorio" });
  }

  try {
    let libros = await leerJson(librosPath);
    const newId = libros.length > 0 ? Math.max(...libros.map(l => l.id)) + 1 : 1;

    const nuevoLibro = {
      id: newId,
      titulo: titulo.trim(),
      autor: autor.trim(),
      genero: genero.trim(),
      sinopsis: sinopsis.trim(),
      estado: estado.trim(),
      disponibilidad: disponibilidad.trim(),
      prestamos: []
    };

    libros.push(nuevoLibro);
    await escribirJson(librosPath, libros);

    res.status(201).json({ message: 'Libro creado con éxito', libro: nuevoLibro });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el libro' });
  }
};

//POST PRESTAMO 

const borrowLibro = async (req, res) => {
  try {
    const libroId = parseInt(req.params.id);

    if (!Number.isInteger(libroId) || libroId < 1) {
      return res.status(400).json({ error: "El ID debe ser un número entero válido" });
    }

    const { usuario } = req.body || {};
    let libros = await leerJson(librosPath);

    const libro = libros.find(l => l.id === libroId);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    if (libro.disponibilidad !== 'Disponible') {
      return res.status(400).json({ error: 'El libro no está disponible para préstamo' });
    }

    libro.disponibilidad = 'No disponible';
    
    if (!libro.prestamos) {
      libro.prestamos = [];
    }

    libro.prestamos.push({
      usuario: usuario ? usuario.trim() : 'Anónimo',
      fecha_prestamo: new Date().toISOString().split('T')[0]
    });

    await escribirJson(librosPath, libros);
    res.json({ message: 'Préstamo registrado con éxito', libro });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar el préstamo' });
  }
};

// PUT 
const updateLibro = async (req, res) => {
  const id = Number(req.params.id);
  const { titulo, autor, genero, sinopsis, estado, disponibilidad } = req.body || {};

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "El ID debe ser un número entero válido" });
  }

  if (titulo === undefined && autor === undefined && genero === undefined && sinopsis === undefined && estado === undefined && disponibilidad === undefined) {
    return res.status(400).json({ error: "Debe enviar al menos un campo para actualizar" });
  }

  if (titulo !== undefined && (typeof titulo !== "string" || !titulo.trim())) {
    return res.status(400).json({ error: "El campo Titulo debe contener texto válido" });
  }

  if (autor !== undefined && (typeof autor !== "string" || !autor.trim())) {
    return res.status(400).json({ error: "El campo Autor debe contener texto válido" });
  }

  if (genero !== undefined && (typeof genero !== "string" || !genero.trim())) {
    return res.status(400).json({ error: "El campo Genero debe contener texto válido" });
  }

  if (sinopsis !== undefined && (typeof sinopsis !== "string" || !sinopsis.trim())) {
    return res.status(400).json({ error: "El campo Sinopsis debe contener texto válido" });
  }

  const estadosValidos = ["Bueno", "Malo", "Delicado"];
  if (estado !== undefined && (typeof estado !== "string" || !estado.trim() || !estadosValidos.includes(estado.trim()))) {
    return res.status(400).json({ error: `Estado incorrecto, los estados correctos son: ${estadosValidos.join(", ")}` });
  }

  if (disponibilidad !== undefined && (typeof disponibilidad !== "string" || !disponibilidad.trim())) {
    return res.status(400).json({ error: "El campo Disponibilidad debe contener texto válido" });
  }

  try {
    const libros = await leerJson(librosPath);
    const libro = libros.find((item) => item.id === id);

    if (!libro) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    if (titulo !== undefined) libro.titulo = titulo.trim();
    if (autor !== undefined) libro.autor = autor.trim();
    if (genero !== undefined) libro.genero = genero.trim();
    if (sinopsis !== undefined) libro.sinopsis = sinopsis.trim();
    if (estado !== undefined) libro.estado = estado.trim();
    if (disponibilidad !== undefined) libro.disponibilidad = disponibilidad.trim();

    await escribirJson(librosPath, libros);
    res.json(libro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
const deleteLibro = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "El ID debe ser un número entero válido" });
  }

  try {
    const libros = await leerJson(librosPath);
    const indice = libros.findIndex((item) => item.id === id);

    if (indice === -1) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    libros.splice(indice, 1);
    await escribirJson(librosPath, libros);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getLibros,
  getLibroPorID,
  createLibro,
  updateLibro,
  deleteLibro,
  borrowLibro,
};