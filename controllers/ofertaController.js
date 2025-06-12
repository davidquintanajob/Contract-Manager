const OfertaService = require("../services/ofertaService.js");

const OfertaController = {
  getAllOfertas: async (req, res) => {
    try {
      const ofertas = await OfertaService.getAll();
      res.status(200).json(ofertas);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getOfertaById: async (req, res) => {
    try {
      const { id } = req.params;
      const oferta = await OfertaService.getById(id);
      if (oferta) {
        res.status(200).json(oferta);
      } else {
        res.status(404).json({ message: "Oferta no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createOferta: async (req, res) => {
    try {
      const newOferta = await OfertaService.create(req.body);
      res.status(201).json(newOferta);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateOferta: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedOferta = await OfertaService.update(id, req.body);
      if (updatedOferta) {
        res.status(200).json(updatedOferta);
      } else {
        res.status(404).json({ message: "Oferta no encontrada" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteOferta: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await OfertaService.delete(id);
      if (deleted) {
        res.status(204).send(); // No Content
      } else {
        res.status(404).json({ message: "Oferta no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = OfertaController; 