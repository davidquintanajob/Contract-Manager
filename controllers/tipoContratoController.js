const TipoContratoService = require("../services/tipoContratoService.js");

const TipoContratoController = {
  getAllTipoContratos: async (req, res) => {
    try {
      const tipoContratos = await TipoContratoService.getAll();
      res.status(200).json(tipoContratos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTipoContratoById: async (req, res) => {
    try {
      const { id } = req.params;
      const tipoContrato = await TipoContratoService.getById(id);
      if (tipoContrato) {
        res.status(200).json(tipoContrato);
      } else {
        res.status(404).json({ message: "Tipo de contrato no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createTipoContrato: async (req, res) => {
    try {
      const newTipoContrato = await TipoContratoService.create(req.body);
      res.status(201).json(newTipoContrato);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateTipoContrato: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTipoContrato = await TipoContratoService.update(id, req.body);
      if (updatedTipoContrato) {
        res.status(200).json(updatedTipoContrato);
      } else {
        res.status(404).json({ message: "Tipo de contrato no encontrado" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteTipoContrato: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await TipoContratoService.delete(id);
      if (deleted) {
        res.status(204).send(); // No Content
      } else {
        res.status(404).json({ message: "Tipo de contrato no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = TipoContratoController; 