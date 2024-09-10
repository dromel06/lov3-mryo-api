const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(express.json());

// Habilitar CORS para todos los orígenes
app.use(cors());

// Ruta para recibir datos y guardarlos en un archivo
app.post('/click', (req, res) => {
  const clickData = Math.floor(new Date().getTime()); // Tiempo en segundos desde el 1 de enero de 1970

  // Guardar el dato en un archivo de texto
  fs.appendFile('clicks.txt', clickData + '\n', (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al guardar el dato' });
    }
    res.json({ message: 'Dato guardado exitosamente' });
  });
});

// Ruta para obtener los datos guardados
app.get('/clicks', (req, res) => {
  fs.readFile('clicks.txt', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error al leer los datos' });
    }
    const lines = data.split('\n').filter(line => line);
    const clicks = lines.map(line => {
      const value = parseInt(line, 10);
      if (isNaN(value)) {
        console.error(`Invalid value found: ${line}`);
      }
      return value;
    }); // Convertir cada línea a un número
    res.json({ data: clicks });
  });
});

// Ruta para reiniciar los datos
app.post('/reset', (req, res) => {
  fs.writeFile('clicks.txt', '', (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al reiniciar los datos' });
    }
    res.json({ message: 'Datos reiniciados exitosamente' });
  });
});

app.listen(3000, () => {
  console.log('API escuchando en http://localhost:3000');
});
