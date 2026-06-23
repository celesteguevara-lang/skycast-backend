// ms_tiempo/src/data/paisesData.js
const sql = require('mssql');
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
        throw error;
    }
};

// 2. Trae todos los países registrados con rastreador de errores
const obtenerTodosLosPaises = async () => {
    try {
        const pool = await getConnection();

        const result = await pool.request()
            .query('SELECT * FROM Paises');

        console.log("➡️ Filas crudas obtenidas de SQL Server:", result.recordset);

        return result.recordset;
    } catch (error) {
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