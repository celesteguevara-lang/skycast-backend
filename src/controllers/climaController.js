// ms_tiempo/src/controllers/climaController.js
const climaService = require('../services/climaService'); 

const obtenerClima = async (req, res) => {
    try {
        const resultado = await climaService.obtenerClimaPorId(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el clima' });
    }
};

const obtenerClimaDestacado = async (req, res) => {
    try {
        const resultado = await climaService.obtenerClimaDestacado();
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el clima destacado' });
    }
};

const obtenerClimaGlobal = async (req, res) => {
    try {
        const resultado = await climaService.obtenerClimaGlobal();
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el clima global' });
    }
};

const obtenerListaBuscador = async (req, res) => {
    try {
        const resultado = await climaService.obtenerListaPaisesBuscador();
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la lista de países' });
    }
};

module.exports = { 
    obtenerClima, 
    obtenerClimaDestacado, 
    obtenerClimaGlobal,
    obtenerListaBuscador
};