const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database.js");

const Entidad = sequelize.define("entidad", {
  id_entidad: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  cuenta_bancaria: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tipo_entidad: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  codigo_reo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  codigo_nit: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

Entidad.associate = function(models) {
  Entidad.hasMany(models.Contrato, {
    foreignKey: 'id_entidad',
    onDelete: 'CASCADE',
  });
};

module.exports = Entidad; 