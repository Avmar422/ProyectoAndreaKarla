const fs = require("fs/promises");
const path = require("path");

const dataPath = path.join(__dirname, '../data/libros.json');

const leerJson = async (filePath, defaultValue = []) => {
  try {
    const contenido = await fs.readFile(filePath, "utf8"); 
    return JSON.parse(contenido);  
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw new Error(`No se pudo leer ${path.basename(filePath)}`);
    }

    return defaultValue;
  }
};

const escribirJson = async (filePath, data) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8"); 
};

module.exports = { leerJson, escribirJson, dataPath };