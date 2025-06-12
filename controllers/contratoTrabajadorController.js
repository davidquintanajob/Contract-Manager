const ContratoTrabajadorService = require("../services/contratoTrabajadorService.js");

const ContratoTrabajadorController = {
  getAllContratoTrabajadores: async (req, res) => {
    try {
      const contratoTrabajadores = await ContratoTrabajadorService.getAll();
      res.status(200).json(contratoTrabajadores);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getContratoTrabajadorById: async (req, res) => {
    try {
      const { id } = req.params;
      const contratoTrabajador = await ContratoTrabajadorService.getById(id);
      if (contratoTrabajador) {
        res.status(200).json(contratoTrabajador);
      } else {
        res.status(404).json({ message: "Contrato-Trabajador no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createContratoTrabajador: async (req, res) => {
    try {
      const newContratoTrabajador = await ContratoTrabajadorService.create(req.body);
      res.status(201).json(newContratoTrabajador);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateContratoTrabajador: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedContratoTrabajador = await ContratoTrabajadorService.update(id, req.body);
      if (updatedContratoTrabajador) {
        res.status(200).json(updatedContratoTrabajador);
      } else {
        res.status(404).json({ message: "Contrato-Trabajador no encontrado" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteContratoTrabajador: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await ContratoTrabajadorService.delete(id);
      if (deleted) {
        res.status(204).send(); // No Content
      } else {
        res.status(404).json({ message: "Contrato-Trabajador no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = ContratoTrabajadorController; 