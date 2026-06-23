// ms_tiempo/src/data/paisesData.js
const sql = require('mssql/msnodesqlv8');
const { getConnection } = require('./db');

// 1. Consulta individual por ID con rastreador de errores
const obtenerPaisPorId = async (id) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id) 
            .query('SELECT * FROM Paises WHERE id = @id');
            
        return result.recordset[0]; 
    } catch (error) {
        console.error("❌ ERROR EN obtenerPaisPorId:", error);
        throw error; // Re-lanzamos para que el controlador responda
    }
};

// 2. Trae todo el universo de países registrados con rastreador de errores
const obtenerTodosLosPaises = async () => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .query('SELECT * FROM Paises'); 
            
        // Si todo sale bien, veremos las filas en la consola del backend
        console.log("➡️ Filas crudas obtenidas de SQL Server:", result.recordset);
        
        return result.recordset; 
    } catch (error) {
        // 🔥 ¡AQUÍ SE VA A IMPRIMIR EL VERDADERO RESPONSABLE EN TU TERMINAL!
        console.error("❌ ERROR REAL EN obtenerTodosLosPaises:", error);
        throw error;
    }
};

const obtenerPaisPorNombre = async (nombre) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('nombre', sql.NVarChar, nombre)
            .query('SELECT TOP 1 * FROM Paises WHERE LOWER(nombre) = LOWER(@nombre)');

        return result.recordset[0];
    } catch (error) {
        console.error("❌ ERROR EN obtenerPaisPorNombre:", error);
        throw error;
    }
};

module.exports = { 
    obtenerPaisPorId,
    obtenerTodosLosPaises,
    obtenerPaisPorNombre 
};
