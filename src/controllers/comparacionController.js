const comparacionService = require('../services/comparacionService');

const obtenerComparacionConNicaragua = async (req, res) => {
    try {
        const resultado = await comparacionService.compararConNicaragua(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { obtenerComparacionConNicaragua };
