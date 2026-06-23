// ms_tiempo/src/data/db.js
// Esta capa de Datos es la que se encarga de hablar con la base de datos
// Aquí SOLO hay lógica de conexión a SQL Server, nada de lógica de negocio ni HTTP
const sql = require('mssql/msnodesqlv8');

const dbConfig = {
    connectionString: process.env.SQLSERVER_CONNECTION_STRING
        || 'Driver={SQL Server};Server=localhost\\SQLEXPRESS;Database=ProyectoClimaHora;Trusted_Connection=yes;'
};

const getConnection = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        return pool;
    } catch (error) {
        console.error('❌ Error conectando a SQL Server:', error);
        throw error;
    }
};

module.exports = { getConnection };
