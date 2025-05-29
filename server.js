// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.json());
const path = require('path');
app.use(express.static(path.join(__dirname, 'cliente-app')));


// Conexión a MySQL (XAMPP)
const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'empresa'
});

conexion.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('✅ Conectado a la base de datos MySQL');
});

// =================== CLIENTES ===================

//GET - Consultar cliente
app.get('/clientes', (req, res) => {
  console.log('🔍 Solicitando todos los clientes...');

  conexion.query('SELECT * FROM clientes', (err, results) => {
    if (err) {
      console.error('❌ Error al obtener los clientes:', err);
      res.status(500).send('Error al obtener los clientes');
    } else {
      console.log('✅ Clientes obtenidos correctamente:', results.length, 'registro(s) encontrados.');
      res.status(200).json(results);
    }
  });
});

//GET - consultar cliente individual
app.get('/clientes/:id', (req, res) => {
  const id = req.params.id;
  console.log(`🔍 Solicitando cliente con ID ${id}...`);

  const query = 'SELECT * FROM clientes WHERE id = ?';

  conexion.query(query, [id], (err, results) => {
    if (err) {
      console.error(`❌ Error al obtener el cliente ID ${id}:`, err);
      res.status(500).send(`Error al obtener el cliente ID ${id}`);
    } else {
      if (results.length === 0) {
        console.warn(`⚠️ Cliente ID ${id} no encontrado.`);
        res.status(404).send(`Cliente ID ${id} no encontrado`);
      } else {
        console.log(`✅ Cliente ID ${id} obtenido correctamente.`);
        res.status(200).json(results[0]); // Solo uno
      }
    }
  });
});

// POST - Crear cliente
app.post('/clientes', (req, res) => {
  const { nombre_completo, correo_electronico, telefono } = req.body;
  console.log('Datos recibidos para crear cliente:', req.body);

  const query = 'INSERT INTO clientes (nombre_completo, correo_electronico, telefono) VALUES (?, ?, ?)';
  
  conexion.query(query, [nombre_completo, correo_electronico, telefono], (err, result) => {
    if (err) {
      console.error('Error al crear el cliente:', err);
      res.status(500).send('Error al crear el cliente');
    } else {
      res.status(201).json({
        id: result.insertId,
        nombre_completo,
        correo_electronico,
        telefono
      });
    }
  });
});

// PUT - Actualizar cliente completo
app.put('/clientes/:id', (req, res) => {
  const id = req.params.id;
  const { nombre_completo, correo_electronico, telefono } = req.body;

  console.log(`Intentando actualizar cliente ID ${id}...`);
  console.log('Datos recibidos:', req.body);

  const query = 'UPDATE clientes SET nombre_completo = ?, correo_electronico = ?, telefono = ? WHERE id = ?';

  conexion.query(query, [nombre_completo, correo_electronico, telefono, id], (err, result) => {
    if (err) {
      console.error(`❌ Error al actualizar el cliente ID ${id}:`, err);
      res.status(500).send(`Error al actualizar el cliente ID ${id}`);
    } else {
      console.log(`✅ Cliente ID ${id} actualizado correctamente.`);
      res.status(200).json({ mensaje: `Cliente ID ${id} actualizado.` });
    }
  });
});
// DELETE - Eliminar cliente
app.delete('/clientes/:id', (req, res) => {
  const id = req.params.id;

  console.log(`🗑️ Solicitud para eliminar cliente ID ${id}...`);

  const query = 'DELETE FROM clientes WHERE id = ?';

  conexion.query(query, [id], (err, result) => {
    if (err) {
      console.error(`❌ Error al eliminar cliente ID ${id}:`, err);
      res.status(500).send(`Error al eliminar el cliente ID ${id}`);
    } else {
      if (result.affectedRows === 0) {
        console.warn(`⚠️ No se encontró ningún cliente con ID ${id} para eliminar.`);
        res.status(404).send(`Cliente con ID ${id} no encontrado.`);
      } else {
        console.log(`✅ Cliente ID ${id} eliminado correctamente.`);
        res.status(200).json({ mensaje: `Cliente ID ${id} eliminado.` });
      }
    }
  });
});


// =================== PRODUCTOS ===================

// GET - Obtener productos
app.get('/productos', (req, res) => {
  conexion.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST - Crear producto
app.post('/productos', (req, res) => {
  const { nombre_producto, serial } = req.body;
  conexion.query(
    'INSERT INTO productos (nombre_producto, serial) VALUES (?, ?)',
    [nombre_producto, serial],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Producto agregado', id: result.insertId });
    }
  );
});

// PUT - Actualizar producto
app.put('/productos/:id', (req, res) => {
  const id = req.params.id;
  const { nombre_producto, serial } = req.body;
  conexion.query(
    'UPDATE productos SET nombre_producto = ?, serial = ? WHERE id = ?',
    [nombre_producto, serial, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: `Producto ID ${id} actualizado.` });
    }
  );
});

// DELETE - Eliminar producto
app.delete('/productos/:id', (req, res) => {
  const id = req.params.id;
  conexion.query('DELETE FROM productos WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: `Producto ID ${id} eliminado.` });
  });
});

// =================== PEDIDOS ===================

// GET - Obtener pedidos
app.get('/pedidos', (req, res) => {
  conexion.query('SELECT * FROM pedido', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST - Crear pedido
app.post('/pedidos', (req, res) => {
  const { fecha_pedido, fecha_entrega } = req.body;
  conexion.query(
    'INSERT INTO pedido (fecha_pedido, fecha_entrega) VALUES (?, ?)',
    [fecha_pedido, fecha_entrega],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Pedido creado', id: result.insertId });
    }
  );
});

// PUT - Actualizar pedido
app.put('/pedidos/:id', (req, res) => {
  const id = req.params.id;
  const { fecha_pedido, fecha_entrega } = req.body;
  conexion.query(
    'UPDATE pedido SET fecha_pedido = ?, fecha_entrega = ? WHERE id = ?',
    [fecha_pedido, fecha_entrega, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: `Pedido ID ${id} actualizado.` });
    }
  );
});

// DELETE - Eliminar pedido
app.delete('/pedidos/:id', (req, res) => {
  const id = req.params.id;
  conexion.query('DELETE FROM pedido WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: `Pedido ID ${id} eliminado.` });
  });
});

// =================== RUTA DE PRUEBA ===================
app.get('/', (req, res) => {
  res.send('Servidor con CRUD completo para clientes, productos y pedidos');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
