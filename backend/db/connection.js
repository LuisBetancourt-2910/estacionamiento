import sql from 'mssql';

const dbConfig = {
    user: 'Luis Betancourt',
    password: 'Contraseña',
    server: 'LUIS-BETANCOURT',
    database: 'Estacionamiento',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Conexión a la base de datos exitosa');
        return pool;
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
        throw err;
    });

export { sql, poolPromise };