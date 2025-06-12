const TipoContrato = require("../models/tipo_contrato.js");

const TipoContratoService = {
  getAll: async () => {
    return await TipoContrato.findAll();
  },

  getById: async (id) => {
    return await TipoContrato.findByPk(id);
  },

  create: async (data) => {
    return await TipoContrato.create(data);
  },

  update: async (id, data) => {
    const tipoContrato = await TipoContrato.findByPk(id);
    if (tipoContrato) {
      return await tipoContrato.update(data);
    }
    return null;
  },

  delete: async (id) => {
    const tipoContrato = await TipoContrato.findByPk(id);
    if (tipoContrato) {
      await tipoContrato.destroy();
      return true;
    }
    return false;
  },
};

module.exports = TipoContratoService; 