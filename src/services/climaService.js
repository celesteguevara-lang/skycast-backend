// ms_tiempo/src/services/climaService.js
require('dotenv').config();

const axios = require('axios');
const paisesData = require('../data/paisesData');

const API_KEY = process.env.WEATHER_API_KEY;

/**
 * Normaliza nombres de ciudades para OpenWeather.
 * La interfaz puede mostrar "Berlín", pero la API consulta "Berlin".
 */
const obtenerCiudadConsulta = (pais) => {
    if (!pais) return '';

    const equivalencias = {
        'Berlín': 'Berlin',
        'Pekín': 'Beijing',
        'Moscú': 'Moscow',
        'Nueva Delhi': 'New Delhi',
        'Ciudad de México': 'Mexico City',
        'Ciudad de Guatemala': 'Guatemala City',
        'Ciudad de Panamá': 'Panama City',
        'Washington D. C.': 'Washington',
        'Washington D.C.': 'Washington',
        'San José': 'San Jose',
        'Ámsterdam': 'Amsterdam',
        'París': 'Paris',
        'Abuya': 'Abuja',
        'Kiev': 'Kyiv',
        'Hanói': 'Hanoi',
        'Seúl': 'Seoul',
        'Tokio': 'Tokyo',
        'El Cairo': 'Cairo',
        'Riad': 'Riyadh',
        'Asunción': 'Asuncion',
        'Bogotá': 'Bogota',
        'México': 'Mexico',
        'São Paulo': 'Sao Paulo'
    };

    return pais.ciudadClima || equivalencias[pais.capital] || pais.capital;
};

/**
 * Genera hora local real usando la zona horaria IANA del país.
 * Ejemplo: Europe/Berlin, America/Managua.
 */
const obtenerHoraLocal = (zonaHoraria) => {
    if (!zonaHoraria) return '--';

    try {
        return new Intl.DateTimeFormat('es-NI', {
            timeZone: zonaHoraria,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).format(new Date());
    } catch (error) {
        console.error(`❌ Zona horaria inválida: ${zonaHoraria}`, error.message);
        return '--';
    }
};

/**
 * Mapea el estado del clima de OpenWeather a emojis.
 */
const obtenerEmojiClima = (climaPrincipal) => {
    switch (climaPrincipal) {
        case 'Clear':
            return '☀️';
        case 'Clouds':
            return '☁️';
        case 'Rain':
            return '🌧️';
        case 'Drizzle':
            return '🌦️';
        case 'Thunderstorm':
            return '⛈️';
        case 'Snow':
            return '❄️';
        case 'Mist':
        case 'Smoke':
        case 'Haze':
        case 'Dust':
        case 'Fog':
            return '🌫️';
        default:
            return '🌤️';
    }
};

/**
 * Consulta OpenWeather.
 * Si el país tiene latitud/longitud, usa coordenadas.
 * Si no tiene coordenadas, usa ciudad/capital.
 */
const consultarOpenWeather = async (pais) => {
    if (!API_KEY) {
        throw new Error('Falta configurar WEATHER_API_KEY en el archivo .env');
    }

    const params = {
        appid: API_KEY,
        units: 'metric',
        lang: 'es'
    };

    if (pais.latitud && pais.longitud) {
        params.lat = pais.latitud;
        params.lon = pais.longitud;
    } else {
        const ciudad = obtenerCiudadConsulta(pais);

        if (!ciudad) {
            throw new Error(`No se pudo determinar ciudad para consultar clima de ${pais.nombre}`);
        }

        params.q = ciudad;
    }

    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params
    });

    return response.data;
};

/**
 * Consulta clima actual para un país.
 */
const consultarClimaActual = async (pais) => {
    if (!pais) {
        throw new Error('País no encontrado');
    }

    try {
        const data = await consultarOpenWeather(pais);
        const temperatura = Number(data.main.temp.toFixed(1));
        const horaLocal = obtenerHoraLocal(pais.zonaHoraria);

        return {
            pais: pais.nombre,
            nombre: pais.nombre,
            capital: pais.capital,

            zonaHoraria: pais.zonaHoraria || '--',
            zona_horaria: pais.zonaHoraria || '--',
            timezone: pais.zonaHoraria || '--',

            horaLocal,
            hora_local: horaLocal,
            localTime: horaLocal,

            temperatura,
            temperaturaTexto: `${temperatura}°C`,
            descripcion: data.weather[0].description,
            humedad: data.main.humidity,
            icono: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,

            climaPrincipal: data.weather[0].main,
            emoji: obtenerEmojiClima(data.weather[0].main)
        };
    } catch (error) {
        console.error(`❌ ERROR consultando clima para ${pais.nombre} - ${pais.capital}:`, {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        throw error;
    }
};

/**
 * Clima por ID de país.
 */
const obtenerClimaPorId = async (id) => {
    const pais = await paisesData.obtenerPaisPorId(id);

    if (!pais) {
        throw new Error('País no encontrado');
    }

    return consultarClimaActual(pais);
};

/**
 * Ciudades destacadas para la sección superior.
 */
const obtenerClimaDestacado = async () => {
    const todosLosPaises = await paisesData.obtenerTodosLosPaises();

    const nombresDestacados = [
        'Filipinas',
        'Estados Unidos',
        'Japón',
        'Australia'
    ];

    const paisesFiltrados = todosLosPaises.filter((pais) =>
        nombresDestacados.includes(pais.nombre)
    );

    const promesas = paisesFiltrados.map(async (pais, index) => {
        const data = await consultarOpenWeather(pais);

        let etiquetaCiudad = `${pais.capital.toUpperCase()},\n${pais.nombre.toUpperCase()}`;

        if (pais.nombre === 'Estados Unidos') {
            etiquetaCiudad = 'NUEVA YORK,\nEE.UU.';
        }

        return {
            id: index + 1,
            city: etiquetaCiudad,
            desc: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
            temp: `${Math.round(data.main.temp)}°C`,
            icon: obtenerEmojiClima(data.weather[0].main)
        };
    });

    return Promise.all(promesas);
};

/**
 * Condiciones globales para la sección inferior.
 */
const obtenerClimaGlobal = async () => {
    const todosLosPaises = await paisesData.obtenerTodosLosPaises();

    const nombresGlobales = [
        'China',
        'Argentina',
        'Hong Kong',
        'Reino Unido',
        'Turquía',
        'Rusia',
        'España',
        'India'
    ];

    const paisesFiltrados = todosLosPaises.filter((pais) =>
        nombresGlobales.includes(pais.nombre)
    );

    const promesas = paisesFiltrados.map(async (pais, index) => {
        const data = await consultarOpenWeather(pais);

        let etiquetaCiudad = `${pais.capital.toUpperCase()}, ${pais.nombre.toUpperCase()}`;

        if (pais.nombre === 'Hong Kong') {
            etiquetaCiudad = 'VICTORIA, HONG KONG';
        }

        if (pais.nombre === 'Reino Unido') {
            etiquetaCiudad = 'INGLATERRA, REINO UNIDO';
        }

        return {
            id: index + 1,
            city: etiquetaCiudad,
            temp: `${Math.round(data.main.temp)}°C`,
            icon: obtenerEmojiClima(data.weather[0].main)
        };
    });

    return Promise.all(promesas);
};

/**
 * Lista de países para el buscador/select del frontend.
 */
const obtenerListaPaisesBuscador = async () => {
    const todosLosPaises = await paisesData.obtenerTodosLosPaises();

    return todosLosPaises.map((pais) => ({
        id: pais.id,
        nombre: pais.nombre,
        capital: pais.capital,
        zonaHoraria: pais.zonaHoraria || '--',
        zona_horaria: pais.zonaHoraria || '--'
    }));
};

module.exports = {
    obtenerClimaPorId,
    consultarClimaActual,
    obtenerClimaDestacado,
    obtenerClimaGlobal,
    obtenerListaPaisesBuscador
};