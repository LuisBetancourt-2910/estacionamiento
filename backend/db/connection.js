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
    port: 1433
};

// Crear un pool global que podemos reutilizar
let pool = null;

// Función para obtener o crear el pool de conexiones
const getPool = async () => {
    try {
        if (pool) {
            return pool;
        }
        
        pool = await new sql.ConnectionPool(dbConfig).connect();
        console.log('Conexión a la base de datos exitosa');
        return pool;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        throw error;
    }
};

// Se crea la promesa del pool para mantener compatibilidad con código existente
const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Conexión a la base de datos exitosa (poolPromise)');
        return pool;
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos (poolPromise):', err);
        throw err;
    });

export { sql, getPool, poolPromise };