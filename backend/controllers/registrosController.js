import { poolPromise, sql } from '../db/connection.js';

export const registrarEntrada = async (req, res) => {
    const { plateNumber, type } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('Placa', sql.NVarChar, plateNumber)
            .input('Tipo', sql.NVarChar, type)
            .input('HoraEntrada', sql.DateTime, new Date())
            .query('INSERT INTO Registros (Placa, Tipo, HoraEntrada) VALUES (@Placa, @Tipo, @HoraEntrada)');
        res.status(201).send('Entrada registrada exitosamente');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al registrar la entrada');
    }
};

export const registrarSalida = async (req, res) => {
    const { plateNumber } = req.body;
  
    try {
      const pool = await poolPromise;
  
      // Buscar el registro activo por placa
      const registroResult = await pool
        .request()
        .input('plateNumber', sql.NVarChar, plateNumber)
        .query('SELECT * FROM Registros WHERE Placa = @plateNumber AND HoraSalida IS NULL');
  
      if (registroResult.recordset.length === 0) {
        return res.status(404).json({ error: 'No se encontró un registro activo para esta placa.' });
      }
  
      const registro = registroResult.recordset[0];
      const horaSalida = new Date();
      const horaEntrada = new Date(registro.HoraEntrada);
  
      // Calcular el tiempo estacionado en minutos
      const tiempoEstacionadoMinutos = Math.ceil((horaSalida - horaEntrada) / 60000);
  
      // Obtener la tarifa desde la tabla Tarifas
      const tarifaResult = await pool
        .request()
        .input('tipo', sql.NVarChar, registro.Tipo)
        .query('SELECT Tarifa FROM Tarifas WHERE Tipo = @tipo');
  
      if (tarifaResult.recordset.length === 0) {
        return res.status(404).json({ error: 'No se encontró una tarifa para este tipo de vehículo.' });
      }
  
      const tarifa = tarifaResult.recordset[0].Tarifa;
  
      // Calcular el monto total
      const montoTotal = tarifa * tiempoEstacionadoMinutos;
  
      // Actualizar el registro en la base de datos
      await pool
        .request()
        .input('registroID', sql.Int, registro.RegistroID)
        .input('horaSalida', sql.DateTime, horaSalida)
        .input('tiempoEstacionadoMinutos', sql.Int, tiempoEstacionadoMinutos)
        .input('tarifa', sql.Decimal(10, 2), montoTotal)
        .query(`
          UPDATE Registros
          SET HoraSalida = @horaSalida,
              TiempoEstacionadoMinutos = @tiempoEstacionadoMinutos,
              Tarifa = @tarifa
          WHERE RegistroID = @registroID
        `);
  
      res.json({
        message: 'Salida registrada correctamente',
        Placa: registro.Placa,
        Tipo: registro.Tipo,
        HoraEntrada: registro.HoraEntrada,
        HoraSalida: horaSalida,
        TiempoEstacionadoMinutos: tiempoEstacionadoMinutos,
        Tarifa: montoTotal,
      });
    } catch (error) {
      console.error('Error al registrar la salida:', error);
      res.status(500).json({ error: 'Error al registrar la salida', details: error.message });
    }
  };
  

export const obtenerVehiculosActivos = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT r.RegistroID, r.Placa, r.Tipo, r.HoraEntrada, v.Tipo AS TipoVehiculo
                FROM Registros r
                LEFT JOIN Vehiculos v ON r.Placa = v.Placa
                WHERE r.HoraSalida IS NULL
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los vehículos activos');
    }
};

export const obtenerVehiculos = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT RegistroID, Placa, Tipo, HoraEntrada, HoraSalida, TiempoEstacionadoMinutos, Tarifa
            FROM Registros
        `);
        res.json(result.recordset); // Enviar los datos al frontend
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los registros');
    }
};

export const obtenerTarifasDelDia = async (req, res) => {
    try {
        const pool = await poolPromise;

        // Sumar las tarifas del día actual ajustando la zona horaria
        const result = await pool.request()
            .query(`
                SELECT COALESCE(SUM(Tarifa), 0) AS TotalTarifas
                FROM Registros
                WHERE CAST(SWITCHOFFSET(HoraSalida, '-06:00') AS DATE) = CAST(GETDATE() AS DATE);
            `);

        const totalTarifas = result.recordset[0].TotalTarifas; // Obtener el total
        res.json({ totalTarifas }); // Enviar el total al frontend
    } catch (err) {
        console.error('Error al obtener las tarifas del día:', err);
        res.status(500).send('Error al obtener las tarifas del día');
    }
};

export const obtenerSalidasDelDia = async (req, res) => {
    console.log('Llamada a obtenerSalidasDelDia');
    try {
        const pool = await poolPromise;

        // Ajustar la hora restando 6 horas a HoraSalida
        const result = await pool.request().query(`
            SELECT COUNT(*) AS TotalSalidasHoy
            FROM Registros
            WHERE CONVERT(DATE, DATEADD(HOUR, -6, HoraSalida)) = CONVERT(DATE, GETDATE());
        `);

        console.log('Resultado de la consulta:', result.recordset);

        const totalSalidasHoy = result.recordset[0].TotalSalidasHoy;
        res.json({ totalSalidasHoy });
    } catch (err) {
        console.error('Error al obtener las salidas del día:', err);
        res.status(500).send('Error al obtener las salidas del día');
    }
};