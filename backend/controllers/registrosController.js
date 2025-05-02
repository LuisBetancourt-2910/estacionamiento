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

        // Obtener el registro activo del vehículo
        const registroResult = await pool.request()
            .input('Placa', sql.NVarChar, plateNumber)
            .query(`
                SELECT TOP 1 *
                FROM Registros
                WHERE Placa = @Placa AND HoraSalida IS NULL
                ORDER BY HoraEntrada DESC
            `);

        if (registroResult.recordset.length === 0) {
            return res.status(404).send('No se encontró un registro activo para esta placa');
        }

        const registro = registroResult.recordset[0];
        const horaSalida = new Date(); // Hora actual
        const horaEntrada = new Date(registro.HoraEntrada); // Hora de entrada desde la base de datos

        // Calcular el tiempo estacionado en minutos
        const tiempoEstacionadoMinutos = Math.ceil((horaSalida - horaEntrada) / (1000 * 60)); // Diferencia en milisegundos, convertida a minutos

        // Calcular la tarifa según el tipo de vehículo
        let tarifa = 0;
        if (registro.Tipo === 'Residente') {
            tarifa = tiempoEstacionadoMinutos * 1; // $1.00 MXN por minuto
        } else if (registro.Tipo === 'No Residente') {
            tarifa = tiempoEstacionadoMinutos * 3; // $3.00 MXN por minuto
        }
        // Vehículos Oficiales no pagan, tarifa permanece en 0

        // Actualizar el registro con la hora de salida, tiempo estacionado y tarifa
        await pool.request()
            .input('HoraSalida', sql.DateTime, horaSalida)
            .input('TiempoEstacionadoMinutos', sql.Int, tiempoEstacionadoMinutos)
            .input('Tarifa', sql.Decimal(10, 2), tarifa)
            .input('RegistroID', sql.Int, registro.RegistroID)
            .query(`
                UPDATE Registros
                SET HoraSalida = @HoraSalida,
                    TiempoEstacionadoMinutos = @TiempoEstacionadoMinutos,
                    Tarifa = @Tarifa
                WHERE RegistroID = @RegistroID
            `);

        // Devolver el registro actualizado
        res.json({
            ...registro,
            HoraSalida: horaSalida,
            TiempoEstacionadoMinutos: tiempoEstacionadoMinutos,
            Tarifa: tarifa,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al registrar la salida');
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