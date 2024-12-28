import express from 'express';
import mysql from 'mysql';
import path from 'path';
import { fileURLToPath } from 'url';

// Calling express
const app = express();

// __dirname config
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../public')));

// Middleware config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// New SQL Connection
const cnn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'trucksnglory',
})

// Connection verify
cnn.connect((err) => {
    if(err){
        console.log('No conectados a la BD')
        return;
    }
    console.log('Conectados a la BD')
})

// Principal route
app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  });

// Route to the game
app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/views', 'game.html'));
});

// ROUTE: process register form in index.html
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
  
    // SQL QUERY
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  
    cnn.query(query, [username, email, password], (err, result) => {
      if (err) {
        console.error('Error al insertar los datos:', err);
        return res.status(500).send('Error al registrar el usuario');
      }
      res.send('Usuario registrado exitosamente');
    });
  });

// ROUTE: process login form in index.html
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // SQL QUERY
  const query = 'SELECT * from users WHERE email = ? AND password = ?';

  cnn.query(query, [email, password], (err, result) => {
    if (err) {
      console.error('Error al buscar al usuario:', err);
      return res.status(500).send('Error al encontrar al usuario.');
    }
    if (result.length > 0) {
      res.redirect('/game');
    } else {
      res.status(401).send('Email o contraseña incorrectos');
    }
  });
});

// Listening the server
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
  });