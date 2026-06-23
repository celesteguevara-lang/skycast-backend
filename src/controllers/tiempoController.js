// ms_tiempo/src/controllers/tiempoController.js
// Esta capa de Controladores es la que recibe las peticiones HTTP
// Aquí NO hay lógica de negocio ni consultas SQL, solo recibe y responde
const tiempoService = require('../services/tiempoService');

// Esta función SOLO recibe la URL del navegador y responde con JSON
const obtenerTiempo = async (req, res) => {
    try {
        const id = req.params.id; // Capturamos el ID de la URL (ej: /api/tiempo/1)
        
        // Se lo pasamos al Servicio para que haga el trabajo duro
        const resultado = await tiempoService.calcularHoraPais(id);
        
        // Respondemos al usuario con los datos
        res.status(200).json(resultado);
    } catch (error) {
        // Si hay error (ej. el país no existe), devolvemos un error 404
        res.status(404).json({ error: error.message });
    }
};

module.exports = { obtenerTiempo };