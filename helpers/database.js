/* global process */
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
    pool: {
      max: parseInt(process.env.SEQUELIZE_POOL_MAX),
      min: parseInt(process.env.SEQUELIZE_POOL_MIN),
      acquire: parseInt(process.env.SEQUELIZE_POOL_ACQUIRE),
      idle: parseInt(process.env.SEQUELIZE_POOL_IDLE)
    }
  }
);

// Prueba de conexión
sequelize.authenticate()
  .then(() => console.log('✅ Conexión a PostgreSQL establecida'))
  .catch(err => console.error('❌ Error de conexión a la BD:', err));

module.exports = sequelize;