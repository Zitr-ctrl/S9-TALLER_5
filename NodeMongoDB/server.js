const express = require('express');
const mongoose = require('mongoose');
const Producto = require('./models/Producto');
const methodOverride = require('method-override');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/crud_node_mongo');

// Ruta principal con vista EJS
app.get('/', async (req, res) => {
  const productos = await Producto.find();
  res.render('lista', { productos });
});

// Crear producto (formulario)
app.get('/crear', (req, res) => {
  res.render('crear', { errores: [], nombre: '', descripcion: '', stock: '' });
});

// POST /crear - Compatible con JSON y formulario
app.post('/crear', async (req, res) => {
  const { nombre, descripcion, stock } = req.body;
  const errores = [];

  if (!nombre || /\d/.test(nombre)) {
    errores.push("El nombre es obligatorio y no debe contener números.");
  }
  if (!descripcion || descripcion.length < 5) {
    errores.push("La descripción debe tener al menos 5 caracteres.");
  }
  if (!stock || isNaN(stock) || parseInt(stock) <= 0) {
    errores.push("El stock debe ser un número entero positivo.");
  }

  if (errores.length > 0) {
    if (req.is('application/json')) {
      return res.status(400).json({ errores });
    }
    return res.render('crear', { errores, nombre, descripcion, stock });
  }

  const producto = await Producto.create({
    nombre,
    descripcion,
    stock: parseInt(stock)
  });

  if (req.is('application/json')) {
    return res.status(201).json(producto);
  }

  res.redirect('/');
});

// Editar producto (formulario)
app.get('/editar/:id', async (req, res) => {
  const producto = await Producto.findById(req.params.id);
  res.render('editar', {
    producto,
    errores: [],
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    stock: producto.stock
  });
});

app.put('/editar/:id', async (req, res) => {
  const { nombre, descripcion, stock } = req.body;
  const errores = [];

  if (!nombre || /\d/.test(nombre)) {
    errores.push("El nombre es obligatorio y no debe contener números.");
  }

  if (!descripcion || descripcion.length < 5) {
    errores.push("La descripción debe tener al menos 5 caracteres.");
  }

  if (!stock || isNaN(stock) || parseInt(stock) <= 0) {
    errores.push("El stock debe ser un número entero positivo.");
  }

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  try {
    const actualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, stock: parseInt(stock) },
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el producto' });
  }
});


// Eliminar producto
app.delete('/eliminar/:id', async (req, res) => {
  try {
    const resultado = await Producto.findByIdAndDelete(req.params.id);

    if (!resultado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el producto' });
  }
});

// Inicio del servidor
app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
