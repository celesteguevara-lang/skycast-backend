// ms_tiempo/src/services/climaService.js
require('dotenv').config(); 
const axios = require('axios');
const paisesData = require('../data/paisesData'); // Importa la capa de datos

const API_KEY = process.env.WEATHER_API_KEY; 

// --- FUNCIÓN AUXILIAR (Lógica de negocio pura) ---
// Mapea el estado del clima de la API a los emojis exactos de tu interfaz visual
const obtenerEmojiClima = (climaPrincipal) => {
    switch(climaPrincipal) {
        case 'Clear': return "☀️";
        case 'Clouds': return "☁️";
        case 'Rain': return "🌧️";
        case 'Drizzle': return "🌦️";
        case 'Thunderstorm': return "⛈️";
        case 'Snow': return "❄️";
        case 'Mist': case 'Smoke': case 'Haze': case 'Dust': case 'Fog': return "🌫️";
        default: return "🌤️";
    }
};

const consultarClimaActual = async (pais) => {
    if (!API_KEY) {
        throw new Error('Falta configurar WEATHER_API_KEY en el archivo .env');
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${pais.latitud}&lon=${pais.longitud}&appid=${API_KEY}&units=metric&lang=es`;
    const response = await axios.get(url);
    const data = response.data;

    return {
        pais: pais.nombre,
        capital: pais.capital,
        temperatura: Number(data.main.temp.toFixed(1)),
        temperaturaTexto: `${Number(data.main.temp.toFixed(1))}°C`,
        descripcion: data.weather[0].description,
        humedad: data.main.humidity,
        icono: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    };
};

// --- 1. TU FUNCIÓN ORIGINAL (Se mantiene 100% idéntica) ---
const obtenerClimaPorId = async (id) => {
    const pais = await paisesData.obtenerPaisPorId(id);
    if (!pais) throw new Error('País no encontrado');

    return consultarClimaActual(pais);
};


// --- 2. NUEVA FUNCIÓN: Lógica para Ciudades Destacadas (Hero Section) ---
const obtenerClimaDestacado = async () => {
    // A) Le pedimos a la capa de datos la lista completa de la BD
    const todosLosPaises = await paisesData.obtenerTodosLosPaises();

    // B) Filtramos de la BD solo los 4 países que estructuran tu diseño superior
    // Nota: El campo 'nombre' debe coincidir con cómo los guardaste en tu BD (ej: 'Filipinas', 'Japón')
    const nombresDestacados = ['Filipinas', 'Estados Unidos', 'Japón', 'Australia'];
    const paisesFiltrados = todosLosPaises.filter(p => nombresDestacados.includes(p.nombre));

    // C) Mapeamos cada país para consultar su clima en tiempo real usando sus coordenadas de la BD
    const promesas = paisesFiltrados.map(async (pais, index) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${pais.latitud}&lon=${pais.longitud}&appid=${API_KEY}&units=metric&lang=es`;
        const response = await axios.get(url);
        const data = response.data;

        // Formateamos las etiquetas de texto tal cual se ven en tu diseño superior ("TOKIO, JAPÓN")
        let etiquetaCiudad = `${pais.capital.toUpperCase()},\n${pais.nombre.toUpperCase()}`;
        if (pais.nombre === 'Estados Unidos') etiquetaCiudad = "NUEVA YORK,\nEE.UU.";

        return {
            id: index + 1,
            city: etiquetaCiudad,
            desc: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1), 
            temp: `${Math.round(data.main.temp)}°C`, // Temperatura real redondeada
            icon: obtenerEmojiClima(data.weather[0].main) // Emoji dinámico según el clima real
        };
    });

    // Resolvemos todas las peticiones concurrentes a OpenWeather de golpe
    return await Promise.all(promesas);
};


// --- 3. NUEVA FUNCIÓN: Lógica para Condiciones Globales (Sección Blanca) ---
const obtenerClimaGlobal = async () => {
    // A) Traemos todos los países crudos de la BD
    const todosLosPaises = await paisesData.obtenerTodosLosPaises();

    // B) Filtramos los países que componen la cuadrícula inferior de tu pantalla
    const nombresGlobales = ['China', 'Argentina', 'Hong Kong', 'Reino Unido', 'Turquía', 'Rusia', 'España', 'India'];
    const paisesFiltrados = todosLosPaises.filter(p => nombresGlobales.includes(p.nombre));

    // C) Consultamos a la API con las coordenadas de la BD y estructuramos la respuesta para la cuadrícula
    const promesas = paisesFiltrados.map(async (pais, index) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${pais.latitud}&lon=${pais.longitud}&appid=${API_KEY}&units=metric&lang=es`;
        const response = await axios.get(url);
        const data = response.data;

        let etiquetaCiudad = `${pais.capital.toUpperCase()}, ${pais.nombre.toUpperCase()}`;
        if (pais.nombre === 'Hong Kong') etiquetaCiudad = "VICTORIA, HONG KONG";
        if (pais.nombre === 'Reino Unido') etiquetaCiudad = "INGLATERRA, REINO UNIDO";

        return {
            id: index + 1,
            city: etiquetaCiudad,
            temp: `${Math.round(data.main.temp)}°C`,
            icon: obtenerEmojiClima(data.weather[0].main)
        };
    });

    return await Promise.all(promesas);
};
// Al final de ms_tiempo/src/services/climaService.js

const obtenerListaPaisesBuscador = async () => {
    // Le pedimos a la base de datos todos los países crudos
    const todosLosPaises = await paisesData.obtenerTodosLosPaises();
    
    // Devolvemos solo lo necesario para que el buscador del frontend pueda sugerir nombres
    return todosLosPaises.map(pais => ({
        id: pais.id,
        nombre: pais.nombre,
        capital: pais.capital
    }));
};

module.exports = { 
    obtenerClimaPorId,
    consultarClimaActual,
    obtenerClimaDestacado,
    obtenerClimaGlobal,
    obtenerListaPaisesBuscador 
};
