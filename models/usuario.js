const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database.js");

const Usuario = sequelize.define("usuario", {
  id_usuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombre_usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  cargo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contrasenna: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

Usuario.associate = function(models) {
  Usuario.hasMany(models.Oferta, {
    foreignKey: 'id_usuario',
    onDelete: 'CASCADE',
  });
};

module.exports = Usuario;