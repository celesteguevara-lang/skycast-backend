// ms_tiempo/src/services/tiempoService.js

/**
 * Devuelve la hora local real según zona horaria IANA.
 * Ejemplos:
 * America/Managua
 * Europe/Berlin
 * Asia/Riyadh
 */
const obtenerHoraLocal = (zonaHoraria) => {
    if (!zonaHoraria || zonaHoraria === '--') {
        return '--';
    }

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
        console.error(`❌ Error obteniendo hora local para ${zonaHoraria}:`, error.message);
        return '--';
    }
};

/**
 * Obtiene el offset de una zona horaria respecto a UTC en minutos.
 * Esto permite comparar correctamente zonas con horario de verano.
 */
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

    const fechaZona = Date.UTC(
        Number(valores.year),
        Number(valores.month) - 1,
        Number(valores.day),
        Number(valores.hour),
        Number(valores.minute),
        Number(valores.second)
    );

    return (fechaZona - fecha.getTime()) / 60000;
};

/**
 * Calcula diferencia horaria entre dos zonas.
 * Base por defecto: Nicaragua.
 */
const calcularDiferenciaHoraria = (
    zonaPais,
    zonaReferencia = 'America/Managua'
) => {
    if (!zonaPais || zonaPais === '--') {
        return {
            horas: null,
            texto: '--'
        };
    }

    try {
        const offsetPais = obtenerOffsetMinutos(zonaPais);
        const offsetReferencia = obtenerOffsetMinutos(zonaReferencia);

        const diferencia = Math.round((offsetPais - offsetReferencia) / 60);

        let texto = 'Misma hora que Nicaragua';

        if (diferencia > 0) {
            texto = `${diferencia} hora${diferencia === 1 ? '' : 's'} más que Nicaragua`;
        }

        if (diferencia < 0) {
            const abs = Math.abs(diferencia);
            texto = `${abs} hora${abs === 1 ? '' : 's'} menos que Nicaragua`;
        }

        return {
            horas: diferencia,
            texto
        };
    } catch (error) {
        console.error('❌ Error calculando diferencia horaria:', error.message);

        return {
            horas: null,
            texto: '--'
        };
    }
};

module.exports = {
    obtenerHoraLocal,
    calcularDiferenciaHoraria,
    obtenerOffsetMinutos
};