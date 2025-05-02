import { sql, getPool } from '../db/connection.js';
import jwt from 'jsonwebtoken';

// Registrar nuevo usuario
export const registrarUsuario = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Se requieren nombre de usuario y contraseña' });
  }

  try {
    const pool = await getPool();

    // Verificar si el usuario ya existe
    const userCheck = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Usuarios WHERE username = @username');

    if (userCheck.recordset.length > 0) {
      return res.status(400).json({ error: 'El nombre de usuario ya existe' });
    }

    // Insertar el nuevo usuario
    await pool.request()
      .input('username', sql.NVarChar, username)
      .input('password', sql.NVarChar, password)
      .query('INSERT INTO Usuarios (username, password) VALUES (@username, @password)');

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario en la base de datos' });
  }
};

// Login de usuario
export const loginUsuario = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Se requieren nombre de usuario y contraseña' });
  }

  try {
    const pool = await getPool();

    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Usuarios WHERE username = @username');

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      'esteeselsecretosecretosomassecretodetodoslossecretosjajajaaversifunciona',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      username: user.username,
      message: 'Inicio de sesión exitoso'
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor durante el login' });
  }
};

// Obtener lista de usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT username FROM Usuarios');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

// Eliminar un usuario por username
export const eliminarUsuario = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: 'Se requiere el nombre de usuario' });
  }

  try {
    const pool = await getPool();

    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('DELETE FROM Usuarios WHERE username = @username');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario en la base de datos' });
  }
};
