// ms_tiempo/src/data/paisesData.js
const sql = require('mssql');
const { getConnection } = require('./db');

/**
 * Fallback local para Render/Vercel cuando no hay SQL Server configurado.
 * Nicaragua debe existir porque el sistema compara cada país contra Nicaragua.
 */
const paisesLocales = [
   {
    id: 1,
    nombre: 'Nicaragua',
    capital: 'Managua',
    ciudadClima: 'Managua',
    zonaHoraria: 'America/Managua'
},
    {
        id: 2,
        nombre: 'Costa Rica',
        capital: 'San José',
        ciudadClima: 'San José',
        zonaHoraria: 'America/Costa_Rica'
    },
    {
        id: 3,
        nombre: 'Honduras',
        capital: 'Tegucigalpa',
        zonaHoraria: 'America/Tegucigalpa'
    },
    {
        id: 4,
        nombre: 'El Salvador',
        capital: 'San Salvador',
        zonaHoraria: 'America/El_Salvador'
    },
    {
        id: 5,
        nombre: 'Guatemala',
        capital: 'Ciudad de Guatemala',
        zonaHoraria: 'America/Guatemala'
    },
    {
        id: 6,
        nombre: 'Panamá',
        capital: 'Ciudad de Panamá',
        zonaHoraria: 'America/Panama'
    },
    {
        id: 7,
        nombre: 'Belice',
        capital: 'Belmopán',
        zonaHoraria: 'America/Belize'
    },
    {
        id: 8,
        nombre: 'México',
        capital: 'Ciudad de México',
        zonaHoraria: 'America/Mexico_City'
    },
    {
        id: 9,
        nombre: 'Estados Unidos',
        capital: 'Washington D. C.',
        zonaHoraria: 'America/New_York'
    },
    {
        id: 10,
        nombre: 'Canadá',
        capital: 'Ottawa',
        zonaHoraria: 'America/Toronto'
    },
    {
        id: 11,
        nombre: 'Colombia',
        capital: 'Bogotá',
        zonaHoraria: 'America/Bogota'
    },
    {
        id: 12,
        nombre: 'Venezuela',
        capital: 'Caracas',
        zonaHoraria: 'America/Caracas'
    },
    {
        id: 13,
        nombre: 'Ecuador',
        capital: 'Quito',
        zonaHoraria: 'America/Guayaquil'
    },
    {
        id: 14,
        nombre: 'Perú',
        capital: 'Lima',
        zonaHoraria: 'America/Lima'
    },
    {
        id: 15,
        nombre: 'Bolivia',
        capital: 'Sucre',
        zonaHoraria: 'America/La_Paz'
    },
    {
        id: 16,
        nombre: 'Chile',
        capital: 'Santiago',
        zonaHoraria: 'America/Santiago'
    },
    {
        id: 17,
        nombre: 'Argentina',
        capital: 'Buenos Aires',
        zonaHoraria: 'America/Argentina/Buenos_Aires'
    },
    {
        id: 18,
        nombre: 'Uruguay',
        capital: 'Montevideo',
        zonaHoraria: 'America/Montevideo'
    },
    {
        id: 19,
        nombre: 'Paraguay',
        capital: 'Asunción',
        zonaHoraria: 'America/Asuncion'
    },
    {
        id: 20,
        nombre: 'Brasil',
        capital: 'Brasilia',
        zonaHoraria: 'America/Sao_Paulo'
    },
    {
        id: 21,
        nombre: 'Cuba',
        capital: 'La Habana',
        zonaHoraria: 'America/Havana'
    },
    {
        id: 22,
        nombre: 'República Dominicana',
        capital: 'Santo Domingo',
        zonaHoraria: 'America/Santo_Domingo'
    },
    {
        id: 23,
        nombre: 'Puerto Rico',
        capital: 'San Juan',
        zonaHoraria: 'America/Puerto_Rico'
    },
    {
        id: 24,
        nombre: 'Jamaica',
        capital: 'Kingston',
        zonaHoraria: 'America/Jamaica'
    },
    {
        id: 25,
        nombre: 'España',
        capital: 'Madrid',
        zonaHoraria: 'Europe/Madrid'
    },
    {
        id: 26,
        nombre: 'Reino Unido',
        capital: 'Londres',
        zonaHoraria: 'Europe/London'
    },
    {
        id: 27,
        nombre: 'Francia',
        capital: 'París',
        zonaHoraria: 'Europe/Paris'
    },
   {
    id: 28,
    nombre: 'Alemania',
    capital: 'Berlín',
    ciudadClima: 'Berlin',
    zonaHoraria: 'Europe/Berlin'
},
    {
        id: 29,
        nombre: 'Italia',
        capital: 'Roma',
        zonaHoraria: 'Europe/Rome'
    },
    {
        id: 30,
        nombre: 'Portugal',
        capital: 'Lisboa',
        zonaHoraria: 'Europe/Lisbon'
    },
    {
        id: 31,
        nombre: 'Países Bajos',
        capital: 'Ámsterdam',
        zonaHoraria: 'Europe/Amsterdam'
    },
    {
        id: 32,
        nombre: 'Suiza',
        capital: 'Berna',
        zonaHoraria: 'Europe/Zurich'
    },
    {
        id: 33,
        nombre: 'Bélgica',
        capital: 'Bruselas',
        zonaHoraria: 'Europe/Brussels'
    },
    {
        id: 34,
        nombre: 'Suecia',
        capital: 'Estocolmo',
        zonaHoraria: 'Europe/Stockholm'
    },
    {
        id: 35,
        nombre: 'Noruega',
        capital: 'Oslo',
        zonaHoraria: 'Europe/Oslo'
    },
    {
        id: 36,
        nombre: 'Dinamarca',
        capital: 'Copenhague',
        zonaHoraria: 'Europe/Copenhagen'
    },
    {
        id: 37,
        nombre: 'Irlanda',
        capital: 'Dublín',
        zonaHoraria: 'Europe/Dublin'
    },
    {
        id: 38,
        nombre: 'Polonia',
        capital: 'Varsovia',
        zonaHoraria: 'Europe/Warsaw'
    },
    {
        id: 39,
        nombre: 'Rusia',
        capital: 'Moscú',
        zonaHoraria: 'Europe/Moscow'
    },
    {
        id: 40,
        nombre: 'Ucrania',
        capital: 'Kiev',
        zonaHoraria: 'Europe/Kyiv'
    },
    {
        id: 41,
        nombre: 'China',
        capital: 'Pekín',
        zonaHoraria: 'Asia/Shanghai'
    },
    {
        id: 42,
        nombre: 'Japón',
        capital: 'Tokio',
        zonaHoraria: 'Asia/Tokyo'
    },
    {
        id: 43,
        nombre: 'Corea del Sur',
        capital: 'Seúl',
        zonaHoraria: 'Asia/Seoul'
    },
    {
        id: 44,
        nombre: 'India',
        capital: 'Nueva Delhi',
        zonaHoraria: 'Asia/Kolkata'
    },
    {
        id: 45,
        nombre: 'Indonesia',
        capital: 'Yakarta',
        zonaHoraria: 'Asia/Jakarta'
    },
    {
        id: 46,
        nombre: 'Tailandia',
        capital: 'Bangkok',
        zonaHoraria: 'Asia/Bangkok'
    },
    {
        id: 47,
        nombre: 'Filipinas',
        capital: 'Manila',
        zonaHoraria: 'Asia/Manila'
    },
    {
        id: 48,
        nombre: 'Vietnam',
        capital: 'Hanói',
        zonaHoraria: 'Asia/Ho_Chi_Minh'
    },
    {
        id: 49,
        nombre: 'Singapur',
        capital: 'Singapur',
        zonaHoraria: 'Asia/Singapore'
    },
    {
        id: 50,
        nombre: 'Emiratos Árabes Unidos',
        capital: 'Abu Dabi',
        zonaHoraria: 'Asia/Dubai'
    },
    {
        id: 51,
        nombre: 'Israel',
        capital: 'Jerusalén',
        zonaHoraria: 'Asia/Jerusalem'
    },
    {
        id: 52,
        nombre: 'Turquía',
        capital: 'Ankara',
        zonaHoraria: 'Europe/Istanbul'
    },
    {
        id: 53,
        nombre: 'Arabia Saudita',
        capital: 'Riad',
        zonaHoraria: 'Asia/Riyadh'
    },
    {
        id: 54,
        nombre: 'Qatar',
        capital: 'Doha',
        zonaHoraria: 'Asia/Qatar'
    },
    {
        id: 55,
        nombre: 'Australia',
        capital: 'Canberra',
        zonaHoraria: 'Australia/Sydney'
    },
    {
        id: 56,
        nombre: 'Nueva Zelanda',
        capital: 'Wellington',
        zonaHoraria: 'Pacific/Auckland'
    },
    {
        id: 57,
        nombre: 'Sudáfrica',
        capital: 'Pretoria',
        zonaHoraria: 'Africa/Johannesburg'
    },
    {
        id: 58,
        nombre: 'Egipto',
        capital: 'El Cairo',
        zonaHoraria: 'Africa/Cairo'
    },
    {
        id: 59,
        nombre: 'Marruecos',
        capital: 'Rabat',
        zonaHoraria: 'Africa/Casablanca'
    },
    {
        id: 60,
        nombre: 'Nigeria',
        capital: 'Abuya',
        zonaHoraria: 'Africa/Lagos'
    },
    {
        id: 61,
        nombre: 'Kenia',
        capital: 'Nairobi',
        zonaHoraria: 'Africa/Nairobi'
    }
];

// 1. Consulta individual por ID
const obtenerPaisPorId = async (id) => {
    try {
        if (!process.env.DB_SERVER) {
            return paisesLocales.find((pais) => Number(pais.id) === Number(id));
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

// 2. Trae todos los países registrados
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

// 3. Consulta individual por nombre
const obtenerPaisPorNombre = async (nombre) => {
    try {
        if (!process.env.DB_SERVER) {
            return paisesLocales.find(
                (pais) => pais.nombre.toLowerCase() === String(nombre).toLowerCase()
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