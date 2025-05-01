import { poolPromise, sql } from '../db/connection.js';

export const obtenerVehiculos = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Vehiculos');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los vehículos');
    }
};

export const agregarVehiculo = async (req, res) => {
    const { Placa, Tipo } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('Placa', sql.NVarChar, Placa)
            .input('Tipo', sql.NVarChar, Tipo)
            .query('INSERT INTO Vehiculos (Placa, Tipo) VALUES (@Placa, @Tipo)');
        res.status(201).send('Vehículo agregado exitosamente');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al agregar el vehículo');
    }
};