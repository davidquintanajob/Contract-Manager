const EntidadService = require("../services/entidadService.js");

const EntidadController = {
  getAllEntidades: async (req, res) => {
    try {
      const entidades = await EntidadService.getAll();
      res.status(200).json(entidades);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getEntidadById: async (req, res) => {
    try {
      const { id } = req.params;
      const entidad = await EntidadService.getById(id);
      if (entidad) {
        res.status(200).json(entidad);
      } else {
        res.status(404).json({ message: "Entidad no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createEntidad: async (req, res) => {
    try {
      const newEntidad = await EntidadService.create(req.body);
      res.status(201).json(newEntidad);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateEntidad: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedEntidad = await EntidadService.update(id, req.body);
      if (updatedEntidad) {
        res.status(200).json(updatedEntidad);
      } else {
        res.status(404).json({ message: "Entidad no encontrada" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteEntidad: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await EntidadService.delete(id);
      if (deleted) {
        res.status(204).send(); // No Content
      } else {
        res.status(404).json({ message: "Entidad no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = EntidadController; 