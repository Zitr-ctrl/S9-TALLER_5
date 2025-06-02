const express = require('express');
const app = express();
const pool = require('./db');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM productos ORDER BY id');
  res.render('lista', { productos: result.rows });
});


app.get('/crear', (req, res) => {
  res.render('crear', { errores: [], nombre: '', descripcion: '', stock: '' });
});


app.post('/crear', async (req, res) => {
  const { nombre, descripcion, stock } = req.body;
  const errores = [];

  if (!nombre || /\d/.test(nombre)) errores.push("El nombre es obligatorio y no debe contener números.");
  if (!descripcion || descripcion.length < 5) errores.push("La descripción debe tener al menos 5 caracteres.");
  if (!stock || isNaN(stock) || parseInt(stock) <= 0) errores.push("El stock debe ser un número entero positivo.");

  if (errores.length > 0) {
    if (req.is('application/json')) {
      return res.status(400).json({ errores });
    }
    return res.render('crear', { errores, nombre, descripcion, stock });
  }

  const result = await pool.query(
    'INSERT INTO productos(nombre, descripcion, stock) VALUES($1, $2, $3) RETURNING *',
    [nombre, descripcion, parseInt(stock)]
  );

  if (req.is('application/json')) {
    return res.status(201).json(result.rows[0]);
  }

  res.redirect('/');
});

app.get('/editar/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM productos WHERE id = $1', [req.params.id]);
  res.render('editar', {
    producto: result.rows[0],
    errores: [],
    nombre: result.rows[0].nombre,
    descripcion: result.rows[0].descripcion,
    stock: result.rows[0].stock
  });
});


app.post('/editar/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, stock } = req.body;
  const errores = [];

  if (!nombre || /\d/.test(nombre)) errores.push("El nombre es obligatorio y no debe contener números.");
  if (!descripcion || descripcion.length < 5) errores.push("La descripción debe tener al menos 5 caracteres.");
  if (!stock || isNaN(stock) || parseInt(stock) <= 0) errores.push("El stock debe ser un número entero positivo.");

  if (errores.length > 0) {
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);

    if (req.is('application/json')) {
      return res.status(400).json({ errores });
    }

    return res.render('editar', {
      errores,
      producto: result.rows[0],
      nombre,
      descripcion,
      stock
    });
  }

  await pool.query(
    'UPDATE productos SET nombre = $1, descripcion = $2, stock = $3 WHERE id = $4',
    [nombre, descripcion, parseInt(stock), id]
  );

  if (req.is('application/json')) {
    const actualizado = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    return res.json(actualizado.rows[0]);
  }

  res.redirect('/');
});


app.get('/eliminar/:id', async (req, res) => {
  await pool.query('DELETE FROM productos WHERE id = $1', [req.params.id]);

  if (req.is('application/json')) {
    return res.json({ mensaje: 'Producto eliminado correctamente' });
  }

  res.redirect('/');
});


app.get('/api/productos', async (req, res) => {
  const result = await pool.query('SELECT * FROM productos ORDER BY id');
  res.json(result.rows);
});


app.put('/editar/:id', async (req, res) => {
  const { nombre, descripcion, stock } = req.body;
  const errores = [];

  if (!nombre || /\d/.test(nombre)) errores.push("El nombre es obligatorio y no debe contener números.");
  if (!descripcion || descripcion.length < 5) errores.push("La descripción debe tener al menos 5 caracteres.");
  if (!stock || isNaN(stock) || parseInt(stock) <= 0) errores.push("El stock debe ser un número entero positivo.");

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  await pool.query(
    'UPDATE productos SET nombre = $1, descripcion = $2, stock = $3 WHERE id = $4',
    [nombre, descripcion, parseInt(stock), req.params.id]
  );

  const actualizado = await pool.query('SELECT * FROM productos WHERE id = $1', [req.params.id]);
  res.json(actualizado.rows[0]);
});


app.delete('/eliminar/:id', async (req, res) => {
  await pool.query('DELETE FROM productos WHERE id = $1', [req.params.id]);
  res.json({ mensaje: 'Producto eliminado correctamente' });
});


app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
