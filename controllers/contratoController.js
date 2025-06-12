const ContratoService = require("../services/contratoService.js");

const ContratoController = {
  getAllContratos: async (req, res) => {
    try {
      const contratos = await ContratoService.getAll();
      res.status(200).json(contratos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getContratoById: async (req, res) => {
    try {
      const { id } = req.params;
      const contrato = await ContratoService.getById(id);
      if (contrato) {
        res.status(200).json(contrato);
      } else {
        res.status(404).json({ message: "Contrato no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createContrato: async (req, res) => {
    try {
      const newContrato = await ContratoService.create(req.body);
      res.status(201).json(newContrato);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateContrato: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedContrato = await ContratoService.update(id, req.body);
      if (updatedContrato) {
        res.status(200).json(updatedContrato);
      } else {
        res.status(404).json({ message: "Contrato no encontrado" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteContrato: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await ContratoService.delete(id);
      if (deleted) {
        res.status(204).send(); // No Content
      } else {
        res.status(404).json({ message: "Contrato no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = ContratoController; 