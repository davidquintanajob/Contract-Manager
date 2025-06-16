const Oferta = require("../models/oferta.js");
const Contrato = require("../models/contrato.js");
const Usuario = require("../models/usuario.js");
const { Op } = require('sequelize');

/**
 * Servicio para la gestión de ofertas
 * Implementa el patrón Repository para el acceso a datos
 * Sigue los principios SOLID:
 * - Single Responsibility: Cada método tiene una única responsabilidad
 * - Open/Closed: Extensible para nuevas funcionalidades sin modificar el código existente
 * - Interface Segregation: Métodos específicos para cada operación
 * - Dependency Inversion: Depende de abstracciones (modelos) no de implementaciones concretas
 */
const OfertaService = {
  /**
   * Valida los datos de una oferta antes de crearla o actualizarla
   * @param {Object} data - Datos de la oferta a validar
   * @param {number} [excludeId] - ID de la oferta a excluir en validaciones (para actualizaciones)
   * @returns {Promise<Array>} Lista de errores encontrados
   */
  validateOferta: async (data) => {
    const errors = [];

    // Validar fecha_inicio
    if (!data.fecha_inicio) {
      errors.push('La fecha de inicio es requerida');
    } else {
      const fechaInicio = new Date(data.fecha_inicio);
      if (isNaN(fechaInicio.getTime())) {
        errors.push('La fecha de inicio debe ser una fecha válida');
      }
    }

    // Validar fecha_fin
    if (!data.fecha_fin) {
      errors.push('La fecha de fin es requerida');
    } else {
      const fechaFin = new Date(data.fecha_fin);
      if (isNaN(fechaFin.getTime())) {
        errors.push('La fecha de fin debe ser una fecha válida');
      }
    }

    // Validar que fecha_inicio sea menor o igual que fecha_fin
    if (data.fecha_inicio && data.fecha_fin) {
      const fechaInicio = new Date(data.fecha_inicio);
      const fechaFin = new Date(data.fecha_fin);
      if (fechaInicio > fechaFin) {
        errors.push('La fecha de inicio debe ser menor o igual que la fecha de fin');
      }
    }

    // Validar id_contrato
    if (!data.id_contrato) {
      errors.push('El ID del contrato es requerido');
    } else {
      const idContrato = parseInt(data.id_contrato);
      if (isNaN(idContrato) || !Number.isInteger(idContrato) || idContrato <= 0) {
        errors.push('El ID del contrato debe ser un número entero positivo');
      } else {
        const contrato = await Contrato.findByPk(idContrato);
        if (!contrato) {
          errors.push('El contrato especificado no existe');
        }
      }
    }

    // Validar id_usuario
    if (!data.id_usuario) {
      errors.push('El ID del usuario es requerido');
    } else {
      const idUsuario = parseInt(data.id_usuario);
      if (isNaN(idUsuario) || !Number.isInteger(idUsuario) || idUsuario <= 0) {
        errors.push('El ID del usuario debe ser un número entero positivo');
      } else {
        const usuario = await Usuario.findByPk(idUsuario);
        if (!usuario) {
          errors.push('El usuario especificado no existe');
        }
      }
    }

    // Validar descripcion
    if (!data.descripcion) {
      errors.push('La descripción es requerida');
    } else if (typeof data.descripcion !== 'string' || data.descripcion.trim().length === 0) {
      errors.push('La descripción debe ser un texto no vacío');
    }

    return errors;
  },

  /**
   * Valida que un ID sea un número entero válido
   * @param {string|number} id - ID a validar
   * @returns {boolean} true si el ID es válido
   */
  validateId: (id) => {
    const idNum = parseInt(id);
    return !isNaN(idNum) && Number.isInteger(idNum) && idNum > 0;
  },

  /**
   * Obtiene todas las ofertas con información relacionada
   * @returns {Promise<Array>} Lista de ofertas
   */
  getAllOfertas: async () => {
    try {
      return await Oferta.findAll({
        include: [
          {
            model: Contrato,
            as: 'contrato'
          },
          {
            model: Usuario,
            as: 'usuario'
          }
        ],
        order: [['fecha_inicio', 'DESC']]
      });
    } catch (error) {
      console.error('Error al obtener ofertas:', error);
      throw new Error(`Error al obtener ofertas: ${error.message}`);
    }
  },

  /**
   * Obtiene una oferta por su ID con información relacionada
   * @param {number} id - ID de la oferta
   * @returns {Promise<Object>} Oferta encontrada
   * @throws {Error} Si la oferta no existe o el ID es inválido
   */
  getOfertaById: async (id) => {
    try {
      if (!OfertaService.validateId(id)) {
        throw new Error('ID de oferta inválido');
      }

      const oferta = await Oferta.findByPk(id, {
        include: [
          {
            model: Contrato,
            as: 'contrato'
          },
          {
            model: Usuario,
            as: 'usuario'
          }
        ]
      });

      if (!oferta) {
        throw new Error('Oferta no encontrada');
      }

      return oferta;
    } catch (error) {
      console.error('Error al obtener oferta:', error);
      throw new Error(`Error al obtener oferta: ${error.message}`);
    }
  },

  /**
   * Crea una nueva oferta
   * @param {Object} ofertaData - Datos de la oferta a crear
   * @returns {Promise<Object>} Oferta creada
   * @throws {Error} Si hay errores de validación
   */
  createOferta: async (ofertaData) => {
    try {
      // Validar datos
      const errors = await OfertaService.validateOferta(ofertaData);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Crear oferta
      const oferta = await Oferta.create(ofertaData);
      return await OfertaService.getOfertaById(oferta.id_oferta);
    } catch (error) {
      console.error('Error al crear oferta:', error);
      throw new Error(`Error al crear oferta: ${error.message}`);
    }
  },

  /**
   * Actualiza una oferta existente
   * @param {number} id - ID de la oferta a actualizar
   * @param {Object} ofertaData - Datos actualizados de la oferta
   * @returns {Promise<Object>} Oferta actualizada
   * @throws {Error} Si la oferta no existe, el ID es inválido o hay errores de validación
   */
  updateOferta: async (id, ofertaData) => {
    try {
      if (!OfertaService.validateId(id)) {
        throw new Error('ID de oferta inválido');
      }

      // Verificar si la oferta existe
      const ofertaExistente = await OfertaService.getOfertaById(id);

      // Validar datos
      const errors = await OfertaService.validateOferta(ofertaData, id);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Actualizar oferta
      await ofertaExistente.update(ofertaData);
      return await OfertaService.getOfertaById(id);
    } catch (error) {
      console.error('Error al actualizar oferta:', error);
      throw new Error(`Error al actualizar oferta: ${error.message}`);
    }
  },

  /**
   * Elimina una oferta
   * @param {number} id - ID de la oferta a eliminar
   * @returns {Promise<boolean>} true si se eliminó correctamente
   * @throws {Error} Si la oferta no existe o el ID es inválido
   */
  deleteOferta: async (id) => {
    try {
      if (!OfertaService.validateId(id)) {
        throw new Error('ID de oferta inválido');
      }

      const oferta = await OfertaService.getOfertaById(id);
      await oferta.destroy();
      return true;
    } catch (error) {
      console.error('Error al eliminar oferta:', error);
      throw new Error(`Error al eliminar oferta: ${error.message}`);
    }
  },

  /**
   * Filtra ofertas según criterios específicos
   * @param {Object} filters - Criterios de filtrado
   * @param {string} [filters.fecha_inicio] - Fecha de inicio para filtrar
   * @param {string} [filters.fecha_fin] - Fecha de fin para filtrar
   * @param {number} [filters.id_contrato] - ID del contrato
   * @param {number} [filters.id_usuario] - ID del usuario
   * @param {string} [filters.descripcion] - Descripción de la oferta
   * @returns {Promise<Array>} Lista de ofertas filtradas
   */
  filterOfertas: async (filters = {}) => {
    try {
      const whereClause = {};

      // Filtrar por fecha_inicio
      if (filters.fecha_inicio) {
        const fechaInicio = new Date(filters.fecha_inicio);
        if (!isNaN(fechaInicio.getTime())) {
          whereClause.fecha_inicio = {
            [Op.gte]: fechaInicio
          };
        }
      }

      // Filtrar por fecha_fin
      if (filters.fecha_fin) {
        const fechaFin = new Date(filters.fecha_fin);
        if (!isNaN(fechaFin.getTime())) {
          whereClause.fecha_fin = {
            [Op.lte]: fechaFin
          };
        }
      }

      // Filtrar por id_contrato
      if (filters.id_contrato) {
        const idContrato = parseInt(filters.id_contrato);
        if (!isNaN(idContrato) && Number.isInteger(idContrato) && idContrato > 0) {
          whereClause.id_contrato = idContrato;
        }
      }

      // Filtrar por id_usuario
      if (filters.id_usuario) {
        const idUsuario = parseInt(filters.id_usuario);
        if (!isNaN(idUsuario) && Number.isInteger(idUsuario) && idUsuario > 0) {
          whereClause.id_usuario = idUsuario;
        }
      }

      // Filtrar por descripción
      if (filters.descripcion) {
        whereClause.descripcion = {
          [Op.iLike]: `%${filters.descripcion.toLowerCase()}%`
        };
      }

      return await Oferta.findAll({
        where: whereClause,
        include: [
          {
            model: Contrato,
            as: 'contrato'
          },
          {
            model: Usuario,
            as: 'usuario'
          }
        ],
        order: [['fecha_inicio', 'DESC']]
      });
    } catch (error) {
      console.error('Error al filtrar ofertas:', error);
      throw new Error(`Error al filtrar ofertas: ${error.message}`);
    }
  }
};

module.exports = OfertaService; 