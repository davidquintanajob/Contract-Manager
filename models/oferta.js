const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database.js");

const Oferta = sequelize.define("oferta", {
  id_oferta: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isAfterStart(value) {
        if (this.fecha_inicio && value <= this.fecha_inicio) {
          throw new Error("La fecha de fin debe ser posterior a la fecha de inicio");
        }
      },
    },
  },
  id_contrato: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

Oferta.associate = function(models) {
  Oferta.belongsTo(models.Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario',
  });
  Oferta.belongsTo(models.Contrato, {
    foreignKey: 'id_contrato',
    as: 'contrato',
  });
};

module.exports = Oferta;