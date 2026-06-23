const sql = require('mssql');
const { getConnection } = require('./db');

const paisesLocales = [
    {
        id: 1,
        nombre: 'Costa Rica',
        capital: 'San José',
        zonaHoraria: 'America/Costa_Rica'
    },
    {
        id: 2,
        nombre: 'Estados Unidos',
        capital: 'Washington D. C.',
        zonaHoraria: 'America/New_York'
    },
    {
        id: 3,
        nombre: 'España',
        capital: 'Madrid',
        zonaHoraria: 'Europe/Madrid'
    },
    {
        id: 4,
        nombre: 'México',
        capital: 'Ciudad de México',
        zonaHoraria: 'America/Mexico_City'
    },
    {
        id: 5,
        nombre: 'Argentina',
        capital: 'Buenos Aires',
        zonaHoraria: 'America/Argentina/Buenos_Aires'
    }
];

const obtenerPaisPorId = async (id) => {
    try {
        if (!process.env.DB_SERVER) {
            return paisesLocales.find(pais => Number(pais.id) === Number(id));
        }

        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Paises WHERE id = @id');

        return result.recordset[0];
    } catch (error) {
        console.error('❌ ERROR EN obtenerPaisPorId:', error);
        throw error;
    }
};

const obtenerTodosLosPaises = async () => {
    try {
        if (!process.env.DB_SERVER) {
            console.log('➡️ Usando países locales porque DB_SERVER no está definido.');
            return paisesLocales;
        }

        const pool = await getConnection();

        const result = await pool.request()
            .query('SELECT * FROM Paises');

        console.log('➡️ Filas crudas obtenidas de SQL Server:', result.recordset);

        return result.recordset;
    } catch (error) {
        console.error('❌ ERROR REAL EN obtenerTodosLosPaises:', error);
        throw error;
    }
};

const obtenerPaisPorNombre = async (nombre) => {
    try {
        if (!process.env.DB_SERVER) {
            return paisesLocales.find(
                pais => pais.nombre.toLowerCase() === String(nombre).toLowerCase()
            );
        }

        const pool = await getConnection();

        const result = await pool.request()
            .input('nombre', sql.NVarChar, nombre)
            .query('SELECT TOP 1 * FROM Paises WHERE LOWER(nombre) = LOWER(@nombre)');

        return result.recordset[0];
    } catch (error) {
        console.error('❌ ERROR EN obtenerPaisPorNombre:', error);
        throw error;
    }
};

module.exports = {
    obtenerPaisPorId,
    obtenerTodosLosPaises,
    obtenerPaisPorNombre
};