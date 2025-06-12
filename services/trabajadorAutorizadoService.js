const TrabajadorAutorizado = require("../models/trabajador_autorizado.js");

const TrabajadorAutorizadoService = {
  getAll: async () => {
    return await TrabajadorAutorizado.findAll();
  },

  getById: async (id) => {
    return await TrabajadorAutorizado.findByPk(id);
  },

  create: async (data) => {
    return await TrabajadorAutorizado.create(data);
  },

  update: async (id, data) => {
    const trabajadorAutorizado = await TrabajadorAutorizado.findByPk(id);
    if (trabajadorAutorizado) {
      return await trabajadorAutorizado.update(data);
    }
    return null;
  },

  delete: async (id) => {
    const trabajadorAutorizado = await TrabajadorAutorizado.findByPk(id);
    if (trabajadorAutorizado) {
      await trabajadorAutorizado.destroy();
      return true;
    }
    return false;
  },
};

module.exports = TrabajadorAutorizadoService; 