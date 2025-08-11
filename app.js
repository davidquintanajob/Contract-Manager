/* global process */
const express = require("express");
const cors = require('cors');
const logger = require("./helpers/logger.js");
const sequelize = require("./helpers/database.js");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_OPTIONS || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logger de solicitudes
app.use((req, res, next) => {
  logger.info(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Gestión de Contratos y Ofertas",
      version: "1.0.0",
      description: "Documentación de la API para gestionar contratos, ofertas y entidades",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {},
    },
    security: [{
      bearerAuth: []
    }],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Importar rutas
const usuarioRoutes = require("./routes/usuarioRouts");
const tipoContratoRoutes = require("./routes/tipoContratoRouts");
const entidadRoutes = require("./routes/entidadRouts");
const contratoRoutes = require("./routes/contratoRouts");
const ofertaRoutes = require("./routes/ofertaRouts");
const ofertaDescripcionRoutes = require("./routes/ofertaDescripcionRouts");
const trabajadorAutorizadoRoutes = require("./routes/trabajadorAutorizadoRouts");
const contratoTrabajadorRoutes = require("./routes/contratoTrabajadorRouts");

// Montar rutas
app.use("/", usuarioRoutes);
app.use("/", tipoContratoRoutes);
app.use("/", entidadRoutes);
app.use("/", contratoRoutes);
app.use("/", ofertaRoutes);
app.use("/", ofertaDescripcionRoutes);
app.use("/", trabajadorAutorizadoRoutes);
app.use("/", contratoTrabajadorRoutes);

// Importar modelos en ORDEN CORRECTO (modelos base primero)
const TipoContrato = require("./models/tipo_contrato.js");
const Entidad = require("./models/entidad.js");
const Usuario = require("./models/usuario.js");

// Luego modelos que dependen de los anteriores
const Contrato = require("./models/contrato.js");
const Oferta = require("./models/oferta.js");
const OfertaDescripcion = require("./models/oferta_descripcion.js");
const TrabajadorAutorizado = require("./models/trabajador_autorizado.js");
const ContratoTrabajador = require("./models/contrato_trabajador.js");

// Verificación de modelos cargados (DEBUG)
console.log("Modelos registrados en Sequelize:", Object.keys(sequelize.models));

// Configurar relaciones después de cargar todos los modelos
function setupRelations() {
  try {
    // Asegurarnos de que todos los modelos estén disponibles
    const models = {
      TipoContrato,
      Entidad,
      Usuario,
      Contrato,
      Oferta,
      OfertaDescripcion,
      TrabajadorAutorizado,
      ContratoTrabajador,
    };
    
    // 1. Modelos sin dependencias externas
    TipoContrato.associate(models);
    
    // 2. Modelos que solo dependen de los básicos
    Entidad.associate(models);
    Usuario.associate(models);
    
    // 3. Modelos con dependencias más complejas
    Contrato.associate(models);
    Oferta.associate(models);
    OfertaDescripcion.associate(models);
    
    // 4. Modelos de unión/intermediarios
    TrabajadorAutorizado.associate(models);
    ContratoTrabajador.associate(models);
    
  } catch (error) {
    console.error("❌ Error al establecer relaciones:", error);
    throw error;
  }
}

// Iniciar servidor y sincronizar BD
const startApp = async () => {
  try {
    // Establecer relaciones antes de sincronizar
    setupRelations();

    // Sincronizar modelos con la base de datos
    await sequelize.sync({ alter: true }); // O { force: true } si quieres recrear las tablas en cada inicio
    console.log("✅ Tablas sincronizadas correctamente");

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Documentación API: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("❌ Error crítico al iniciar la aplicación:", error);
    process.exit(1); // Termina el proceso con código de error
  }
};

// Manejo de cierre limpio
process.on('SIGINT', async () => {
  await sequelize.close();
  process.exit(0);
});

startApp();

module.exports = app;