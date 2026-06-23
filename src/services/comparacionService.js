// ms_tiempo/src/services/comparacionService.js

const paisesData = require('../data/paisesData');
const climaService = require('./climaService');

const PAIS_REFERENCIA = 'Nicaragua';

const obtenerZonaHoraria = (pais) => {
    return pais.zonaHoraria || pais.zona_horaria || pais.timezone || '--';
};

const formatearHoraPais = (pais) => {
    const zonaHoraria = obtenerZonaHoraria(pais);

    if (!zonaHoraria || zonaHoraria === '--') {
        return {
            fecha_y_hora: '--',
            zona_horaria: '--',
            zonaHoraria: '--'
        };
    }

    try {
        const fechaHora = new Intl.DateTimeFormat('es-NI', {
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

        return {
            fecha_y_hora: fechaHora,
            zona_horaria: zonaHoraria,
            zonaHoraria: zonaHoraria
        };
    } catch (error) {
        console.error(`❌ Zona horaria inválida para ${pais.nombre}:`, zonaHoraria, error.message);

        return {
            fecha_y_hora: '--',
            zona_horaria: '--',
            zonaHoraria: '--'
        };
    }
};

const obtenerOffsetMinutos = (zonaHoraria) => {
    const fecha = new Date();

    const partes = new Intl.DateTimeFormat('en-US', {
        timeZone: zonaHoraria,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).formatToParts(fecha);

    const valores = {};

    for (const parte of partes) {
        if (parte.type !== 'literal') {
            valores[parte.type] = parte.value;
        }
    }

    const fechaEnZona = Date.UTC(
        Number(valores.year),
        Number(valores.month) - 1,
        Number(valores.day),
        Number(valores.hour),
        Number(valores.minute),
        Number(valores.second)
    );

    return Math.round((fechaEnZona - fecha.getTime()) / 60000);
};

const calcularDiferenciaHoras = (zonaPais, zonaReferencia) => {
    if (!zonaPais || !zonaReferencia || zonaPais === '--' || zonaReferencia === '--') {
        return 0;
    }

    try {
        const offsetPais = obtenerOffsetMinutos(zonaPais);
        const offsetReferencia = obtenerOffsetMinutos(zonaReferencia);

        return Math.round((offsetPais - offsetReferencia) / 60);
    } catch (error) {
        console.error('❌ Error calculando diferencia horaria:', {
            zonaPais,
            zonaReferencia,
            message: error.message
        });

        return 0;
    }
};

const construirEtiquetaDiferencia = (horas) => {
    if (horas === 0) {
        return 'Misma hora que Nicaragua';
    }

    const magnitud = Math.abs(horas);
    const unidad = magnitud === 1 ? 'hora' : 'horas';

    if (horas > 0) {
        return `${magnitud} ${unidad} adelante de Nicaragua`;
    }

    return `${magnitud} ${unidad} detrás de Nicaragua`;
};

const compararConNicaragua = async (idPais) => {
    const paisSeleccionado = await paisesData.obtenerPaisPorId(idPais);

    if (!paisSeleccionado) {
        throw new Error('El país solicitado no existe en la base de datos.');
    }

    const nicaragua = await paisesData.obtenerPaisPorNombre(PAIS_REFERENCIA);

    if (!nicaragua) {
        throw new Error('Nicaragua debe estar registrada en la tabla Paises para realizar la comparación.');
    }

    const [climaSeleccionado, climaNicaragua] = await Promise.all([
        climaService.consultarClimaActual(paisSeleccionado),
        climaService.consultarClimaActual(nicaragua)
    ]);

    const zonaPaisSeleccionado = obtenerZonaHoraria(paisSeleccionado);
    const zonaNicaragua = obtenerZonaHoraria(nicaragua);

    const tiempoSeleccionado = formatearHoraPais(paisSeleccionado);
    const tiempoNicaragua = formatearHoraPais(nicaragua);

    const diferenciaHoras = calcularDiferenciaHoras(
        zonaPaisSeleccionado,
        zonaNicaragua
    );

    return {
        paisSeleccionado: {
            ...climaSeleccionado,

            hora: tiempoSeleccionado.fecha_y_hora,
            horaLocal: tiempoSeleccionado.fecha_y_hora,
            hora_local: tiempoSeleccionado.fecha_y_hora,
            localTime: tiempoSeleccionado.fecha_y_hora,

            zonaHoraria: zonaPaisSeleccionado,
            zona_horaria: zonaPaisSeleccionado,
            timezone: zonaPaisSeleccionado
        },

        nicaragua: {
            ...climaNicaragua,

            hora: tiempoNicaragua.fecha_y_hora,
            horaLocal: tiempoNicaragua.fecha_y_hora,
            hora_local: tiempoNicaragua.fecha_y_hora,
            localTime: tiempoNicaragua.fecha_y_hora,

            zonaHoraria: zonaNicaragua,
            zona_horaria: zonaNicaragua,
            timezone: zonaNicaragua
        },

        diferenciaHoraria: {
            horas: diferenciaHoras,
            descripcion: construirEtiquetaDiferencia(diferenciaHoras)
        }
    };
};

module.exports = {
    compararConNicaragua
};