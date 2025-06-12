const Contrato = require("../models/contrato.js");

const ContratoService = {
  getAll: async () => {
    return await Contrato.findAll();
  },

  getById: async (id) => {
    return await Contrato.findByPk(id);
  },

  create: async (data) => {
    return await Contrato.create(data);
  },

  update: async (id, data) => {
    const contrato = await Contrato.findByPk(id);
    if (contrato) {
      return await contrato.update(data);
    }
    return null;
  },

  delete: async (id) => {
    const contrato = await Contrato.findByPk(id);
    if (contrato) {
      await contrato.destroy();
      return true;
    }
    return false;
  },
};

module.exports = ContratoService; 