const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database.js");

const Contrato = sequelize.define("contrato", {
  id_contrato: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_entidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_tipo_contrato: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  num_consecutivo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  clasificacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nota: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

Contrato.associate = function(models) {
  Contrato.belongsTo(models.Entidad, {
    foreignKey: 'id_entidad',
    as: 'entidad',
  });
  Contrato.belongsTo(models.TipoContrato, {
    foreignKey: 'id_tipo_contrato',
    as: 'tipoContrato',
  });
  Contrato.hasMany(models.Oferta, {
    foreignKey: 'id_contrato',
    onDelete: 'CASCADE',
  });
  Contrato.belongsToMany(models.TrabajadorAutorizado, {
    through: models.ContratoTrabajador,
    foreignKey: 'id_contrato',
    otherKey: 'id_trabajador_autorizado',
    as: 'trabajadoresAutorizados',
  });
};

module.exports = Contrato;