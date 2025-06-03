const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');
const path = require('path');


function getShows() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'shows.json')));
}

app.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenido al catálogo de Series con Express!' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

//ruta para obtener todas las series
app.get('/shows/all', (req, res) => {
  res.json(shows);
});


// ruta para obtener una serie por su ID
app.get('/shows/id/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const serie = shows.find(s => s.id === id);

  if (!serie) {
    return res.status(404).json({ error: `Serie con ID ${id} no encontrada` });
  }

  res.json(serie);
});

//ruta para obtener una serie por su título
app.get('/shows/titulo/:titulo', (req, res) => {
  const tituloBuscado = req.params.titulo.toLowerCase();

  const resultados = shows.filter(serie =>
    serie.titulo.toLowerCase().includes(tituloBuscado)
  );

  res.json(resultados);
});


app.get('/shows/existe/:titulo', (req, res) => {
  const tituloBuscado = req.params.titulo.toLowerCase();

  const existe = shows.some(serie => serie.titulo.toLowerCase() === tituloBuscado);

  res.json({
    titulo: tituloBuscado,
    existe
  });
});


// Middleware para rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware para errores internos (500)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log para debugging
  res.status(500).json({ error: 'Error interno del servidor' });
});
