const paisesData = require('../data/paisesData');
const climaService = require('./climaService');
const tiempoService = require('./tiempoService');

const PAIS_REFERENCIA = 'Nicaragua';

const construirEtiquetaDiferencia = (horas) => {
    if (horas === 0) return 'Misma hora que Nicaragua';

    const magnitud = Math.abs(horas);
    const unidad = magnitud === 1 ? 'hora' : 'horas';
    const direccion = horas > 0 ? 'adelante de Nicaragua' : 'detrás de Nicaragua';

    return `${magnitud} ${unidad} ${direccion}`;
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

    const tiempoSeleccionado = tiempoService.formatearHoraPais(paisSeleccionado);
    const tiempoNicaragua = tiempoService.formatearHoraPais(nicaragua);
    const diferenciaHoras = tiempoService.calcularDiferenciaHoras(
        paisSeleccionado.zona_horaria,
        nicaragua.zona_horaria
    );

    return {
        paisSeleccionado: {
            ...climaSeleccionado,
            hora: tiempoSeleccionado.fecha_y_hora,
            zonaHoraria: tiempoSeleccionado.zona_horaria
        },
        nicaragua: {
            ...climaNicaragua,
            hora: tiempoNicaragua.fecha_y_hora,
            zonaHoraria: tiempoNicaragua.zona_horaria
        },
        diferenciaHoraria: {
            horas: diferenciaHoras,
            descripcion: construirEtiquetaDiferencia(diferenciaHoras)
        }
    };
};

module.exports = { compararConNicaragua };
