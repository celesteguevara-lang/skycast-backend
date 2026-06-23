// ms_tiempo/src/services/tiempoService.js
// Esta es la capa de Servicios, aquí va toda la lógica de negocio, cálculos, transformaciones, etc.
// No sabe nada de HTTP ni de SQL puro, solo de lógica de negocio
const paisesData = require('../data/paisesData');

const obtenerFechaEnZona = (fecha, timeZone) => {
    const partes = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).formatToParts(fecha);

    const valor = (tipo) => Number(partes.find(parte => parte.type === tipo).value);

    return Date.UTC(
        valor('year'),
        valor('month') - 1,
        valor('day'),
        valor('hour') === 24 ? 0 : valor('hour'),
        valor('minute'),
        valor('second')
    );
};

const calcularDiferenciaHoras = (zonaA, zonaB) => {
    const ahora = new Date();
    const fechaA = obtenerFechaEnZona(ahora, zonaA);
    const fechaB = obtenerFechaEnZona(ahora, zonaB);
    return Math.round((fechaA - fechaB) / 3600000);
};

const formatearHoraPais = (pais) => {
    const opciones = {
        timeZone: pais.zona_horaria,
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const formatter = new Intl.DateTimeFormat('es-NI', opciones);

    return {
        pais: pais.nombre,
        capital: pais.capital,
        zona_horaria: pais.zona_horaria,
        fecha_y_hora: formatter.format(new Date())
    };
};

// Esta función calcula la hora real, no sabe nada de HTTP ni de SQL puro
const calcularHoraPais = async (id) => {
    // 1. Le pedimos a la capa de Datos que busque el país
    const pais = await paisesData.obtenerPaisPorId(id);
    
    if (!pais) {
        throw new Error('El país solicitado no existe en la base de datos.');
    }

    return formatearHoraPais(pais);
};

module.exports = { 
    calcularHoraPais,
    calcularDiferenciaHoras,
    formatearHoraPais
};
