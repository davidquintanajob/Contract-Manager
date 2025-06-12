const Oferta = require("../models/oferta.js");

const OfertaService = {
  getAll: async () => {
    return await Oferta.findAll();
  },

  getById: async (id) => {
    return await Oferta.findByPk(id);
  },

  create: async (data) => {
    return await Oferta.create(data);
  },

  update: async (id, data) => {
    const oferta = await Oferta.findByPk(id);
    if (oferta) {
      return await oferta.update(data);
    }
    return null;
  },

  delete: async (id) => {
    const oferta = await Oferta.findByPk(id);
    if (oferta) {
      await oferta.destroy();
      return true;
    }
    return false;
  },
};

module.exports = OfertaService; 