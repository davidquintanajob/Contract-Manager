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
    logging: false
  }
);

// Prueba de conexión
if (String(process.env.NODE_ENV) !== 'test') {
  sequelize.authenticate()
    .then(() => console.log('✅ Conexión a PostgreSQL establecida'))
    .catch(err => console.error('❌ Error de conexión a la BD:', err));
} else {
  console.log('⚠️ Test environment detected: skipping DB authenticate');
}

module.exports = sequelize;