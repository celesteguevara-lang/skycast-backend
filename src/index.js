require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const { getConnection } = require('./data/db'); 
const { obtenerTiempo } = require('./controllers/tiempoController');
const { obtenerComparacionConNicaragua } = require('./controllers/comparacionController');
const { 
    obtenerClima, 
    obtenerClimaDestacado, 
    obtenerClimaGlobal, 
    obtenerListaBuscador 
} = require('./controllers/climaController');

const app = express();

app.use(cors());
app.use(express.json());

// ==============================================================================
// --- CONFIGURACIÓN SWAGGER (CORREGIDA) ---
// ==============================================================================
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Tiempo y Clima',
            version: '1.0.0',
            description: 'Documentación de la API para consulta de tiempo y clima'
        },
        // Aquí agregamos TODAS tus rutas, tanto las nuevas como las viejas
        paths: {
            '/api/clima/featured': {
                get: {
                    summary: 'Obtiene el clima de las ciudades destacadas (Hero Section)',
                    responses: {
                        200: { description: 'Lista de clima destacado obtenida exitosamente' }
                    }
                }
            },
            '/api/clima/global': {
                get: {
                    summary: 'Obtiene el clima a nivel global (Sección Inferior)',
                    responses: {
                        200: { description: 'Lista de clima global obtenida exitosamente' }
                    }
                }
            },
            '/api/clima/list': {
                get: {
                    summary: 'Obtiene la lista de ciudades para el buscador',
                    responses: {
                        200: { description: 'Lista para el buscador obtenida exitosamente' }
                    }
                }
            },
            '/api/tiempo/{id}': {
                get: {
                    summary: 'Obtiene la hora actual de un país',
                    parameters: [{
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'integer' },
                        description: 'ID del país en la base de datos'
                    }],
                    responses: {
                        200: { description: 'Hora obtenida exitosamente' },
                        500: { description: 'Error interno del servidor' }
                    }
                }
            },
            '/api/clima/{id}': {
                get: {
                    summary: 'Obtiene el clima actual de un país',
                    parameters: [{
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'integer' },
                        description: 'ID del país en la base de datos'
                    }],
                    responses: {
                        200: { description: 'Clima obtenido exitosamente' },
                        500: { description: 'Error interno del servidor' }
                    }
                }
            },
            '/api/comparacion/nicaragua/{id}': {
                get: {
                    summary: 'Compara hora y clima de un país contra Nicaragua',
                    parameters: [{
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'integer' },
                        description: 'ID del país seleccionado'
                    }],
                    responses: {
                        200: { description: 'Comparación obtenida exitosamente' },
                        400: { description: 'País no encontrado o Nicaragua no registrada' }
                    }
                }
            }
        }
    },
    apis: [], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// ==============================================================================
// DECLARACIÓN DE RUTAS 
// ==============================================================================

// 1️⃣ PRIMERO LAS RUTAS FIJAS 
app.get('/api/clima/featured', obtenerClimaDestacado); 
app.get('/api/clima/global', obtenerClimaGlobal);      
app.get('/api/clima/list', obtenerListaBuscador);      

// 2️⃣ AL FINAL LAS RUTAS DINÁMICAS (las que tienen :id)
app.get('/api/tiempo/:id', obtenerTiempo);
app.get('/api/clima/:id', obtenerClima);
app.get('/api/comparacion/nicaragua/:id', obtenerComparacionConNicaragua);

app.get('/api/prueba', (req, res) => {
    res.json({ ok: true, mensaje: 'Backend correcto' });
});

const PORT = 3001; 

// ==============================================================================
// INICIO DEL SERVIDOR 
// ==============================================================================
app.listen(PORT, async () => {
    console.log(`✅ Servidor de Skycast Backend corriendo en: http://localhost:${PORT}`);
    console.log(`📄 Documentación Swagger disponible en: http://localhost:${PORT}/api-docs`);
    
    try {
        if (typeof getConnection === 'function') {
            await getConnection();
            console.log('🛢️  Base de datos conectada correctamente.');
        }
    } catch (error) {
        console.log('⚠️  No se pudo conectar a la base de datos.', error.message);
    }
});
