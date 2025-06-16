const OfertaService = require("../services/ofertaService.js");

/**
 * Controlador para la gestión de ofertas
 * Implementa el patrón MVC
 * Sigue los principios SOLID:
 * - Single Responsibility: Cada método tiene una única responsabilidad
 * - Open/Closed: Extensible para nuevas funcionalidades sin modificar el código existente
 * - Interface Segregation: Métodos específicos para cada operación
 * - Dependency Inversion: Depende de abstracciones (servicios) no de implementaciones concretas
 */
const OfertaController = {
  /**
   * Obtiene todas las ofertas
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  getAllOfertas: async (req, res) => {
    try {
      const ofertas = await OfertaService.getAllOfertas();
      res.status(200).json({
        message: "Ofertas obtenidas exitosamente",
        data: ofertas
      });
    } catch (error) {
      console.error('Error en el controlador al obtener ofertas:', error);
      res.status(500).json({
        message: "Error al obtener ofertas",
        error: error.message
      });
    }
  },

  /**
   * Obtiene una oferta por su ID
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  getOfertaById: async (req, res) => {
    try {
      const { id } = req.params;
      const oferta = await OfertaService.getOfertaById(id);
      
      res.status(200).json({
        message: "Oferta encontrada exitosamente",
        data: oferta
      });
    } catch (error) {
      console.error('Error en el controlador al obtener oferta:', error);
      if (error.message === 'Oferta no encontrada') {
        res.status(404).json({
          message: "Oferta no encontrada",
          error: error.message
        });
      } else {
        res.status(500).json({
          message: "Error al obtener oferta",
          error: error.message
        });
      }
    }
  },

  /**
   * Crea una nueva oferta
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  createOferta: async (req, res) => {
    try {
      const ofertaData = req.body;
      const oferta = await OfertaService.createOferta(ofertaData);
      
      res.status(201).json({
        message: "Oferta creada exitosamente",
        data: oferta
      });
    } catch (error) {
      console.error('Error en el controlador al crear oferta:', error);
      res.status(400).json({
        message: "Error al crear oferta",
        error: error.message
      });
    }
  },

  /**
   * Actualiza una oferta existente
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  updateOferta: async (req, res) => {
    try {
      const { id } = req.params;
      const ofertaData = req.body;
      const oferta = await OfertaService.updateOferta(id, ofertaData);
      
      res.status(200).json({
        message: "Oferta actualizada exitosamente",
        data: oferta
      });
    } catch (error) {
      console.error('Error en el controlador al actualizar oferta:', error);
      if (error.message === 'Oferta no encontrada') {
        res.status(404).json({
          message: "Oferta no encontrada",
          error: error.message
        });
      } else {
        res.status(400).json({
          message: "Error al actualizar oferta",
          error: error.message
        });
      }
    }
  },

  /**
   * Elimina una oferta
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  deleteOferta: async (req, res) => {
    try {
      const { id } = req.params;
      await OfertaService.deleteOferta(id);
      
      res.status(200).json({
        message: "Oferta eliminada exitosamente"
      });
    } catch (error) {
      console.error('Error en el controlador al eliminar oferta:', error);
      if (error.message === 'Oferta no encontrada') {
        res.status(404).json({
          message: "Oferta no encontrada",
          error: error.message
        });
      } else {
        res.status(500).json({
          message: "Error al eliminar oferta",
          error: error.message
        });
      }
    }
  },

  /**
   * Filtra ofertas según criterios específicos
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  filterOfertas: async (req, res) => {
    try {
      const filters = req.query;
      const ofertas = await OfertaService.filterOfertas(filters);
      res.json(ofertas);
    } catch (error) {
      console.error('Error en filterOfertas:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = OfertaController; 