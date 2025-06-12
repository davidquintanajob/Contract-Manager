const Entidad = require("../models/entidad.js");

const EntidadService = {
  getAll: async () => {
    return await Entidad.findAll();
  },

  getById: async (id) => {
    return await Entidad.findByPk(id);
  },

  create: async (data) => {
    return await Entidad.create(data);
  },

  update: async (id, data) => {
    const entidad = await Entidad.findByPk(id);
    if (entidad) {
      return await entidad.update(data);
    }
    return null;
  },

  delete: async (id) => {
    const entidad = await Entidad.findByPk(id);
    if (entidad) {
      await entidad.destroy();
      return true;
    }
    return false;
  },
};

module.exports = EntidadService; 