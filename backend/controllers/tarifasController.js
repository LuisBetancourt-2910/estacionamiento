import { poolPromise, sql } from '../db/connection.js';

// Obtener todas las tarifas
export const obtenerTarifas = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Tarifas');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener las tarifas:', error);
    res.status(500).json({ error: 'Error al obtener las tarifas' });
  }
};

// Crear o actualizar una tarifa
export const guardarTarifa = async (req, res) => {
  const { tipo, tarifa } = req.body;

  try {
    const pool = await poolPromise;

    // Verificar si el tipo de vehículo ya existe
    const result = await pool
      .request()
      .input('tipo', sql.NVarChar, tipo)
      .query('SELECT * FROM Tarifas WHERE Tipo = @tipo');

    if (result.recordset.length > 0) {
      // Si existe, actualizar la tarifa
      await pool
        .request()
        .input('tipo', sql.NVarChar, tipo)
        .input('tarifa', sql.Decimal(10, 2), tarifa)
        .query('UPDATE Tarifas SET Tarifa = @tarifa WHERE Tipo = @tipo');
      res.json({ message: 'Tarifa actualizada correctamente' });
    } else {
      // Si no existe, crear una nueva tarifa
      await pool
        .request()
        .input('tipo', sql.NVarChar, tipo)
        .input('tarifa', sql.Decimal(10, 2), tarifa)
        .query('INSERT INTO Tarifas (Tipo, Tarifa) VALUES (@tipo, @tarifa)');
      res.json({ message: 'Tarifa creada correctamente' });
    }
  } catch (error) {
    console.error('Error al guardar la tarifa:', error);
    res.status(500).json({ error: 'Error al guardar la tarifa' });
  }
};

// Eliminar una tarifa
export const eliminarTarifa = async (req, res) => {
  const { tipo } = req.params;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input('tipo', sql.NVarChar, tipo)
      .query('DELETE FROM Tarifas WHERE Tipo = @tipo');
    res.json({ message: 'Tarifa eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la tarifa:', error);
    res.status(500).json({ error: 'Error al eliminar la tarifa' });
  }
};