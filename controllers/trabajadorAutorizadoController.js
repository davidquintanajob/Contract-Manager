const TrabajadorAutorizadoService = require("../services/trabajadorAutorizadoService.js");

const TrabajadorAutorizadoController = {
  getAllTrabajadoresAutorizados: async (req, res) => {
    try {
      const trabajadoresAutorizados = await TrabajadorAutorizadoService.getAll();
      res.status(200).json(trabajadoresAutorizados);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTrabajadorAutorizadoById: async (req, res) => {
    try {
      const { id } = req.params;
      const trabajadorAutorizado = await TrabajadorAutorizadoService.getById(id);
      if (trabajadorAutorizado) {
        res.status(200).json(trabajadorAutorizado);
      } else {
        res.status(404).json({ message: "Trabajador autorizado no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createTrabajadorAutorizado: async (req, res) => {
    try {
      const newTrabajadorAutorizado = await TrabajadorAutorizadoService.create(req.body);
      res.status(201).json(newTrabajadorAutorizado);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateTrabajadorAutorizado: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTrabajadorAutorizado = await TrabajadorAutorizadoService.update(id, req.body);
      if (updatedTrabajadorAutorizado) {
        res.status(200).json(updatedTrabajadorAutorizado);
      } else {
        res.status(404).json({ message: "Trabajador autorizado no encontrado" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteTrabajadorAutorizado: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await TrabajadorAutorizadoService.delete(id);
      if (deleted) {
        res.status(204).send(); // No Content
      } else {
        res.status(404).json({ message: "Trabajador autorizado no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = TrabajadorAutorizadoController; 