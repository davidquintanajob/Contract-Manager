const Entidad = require("../models/entidad.js");
const Contrato = require("../models/contrato.js");
const TipoContrato = require("../models/tipo_contrato.js");
const Oferta = require("../models/oferta.js");
const TrabajadorAutorizado = require("../models/trabajador_autorizado.js");
const { ValidationError } = require('sequelize');
const { Op } = require('sequelize');

/**
 * Servicio para la gestión de entidades
 * Implementa el patrón Repository para el acceso a datos
 * Sigue el principio de Responsabilidad Única (SRP) al encapsular toda la lógica de negocio relacionada con entidades
 */
const EntidadService = {
  /**
   * Obtiene todas las entidades del sistema
   * @returns {Promise<Array>} Lista de entidades
   */
  getAll: async () => {
    try {
      return await Entidad.findAll({
        include: [{
          model: Contrato,
          as: 'contratos',
          include: [
            {
              model: TipoContrato,
              as: 'tipoContrato'
            },
            {
              model: Oferta,
              as: 'oferta'
            },
            {
              model: TrabajadorAutorizado,
              as: 'trabajadoresAutorizados'
            }
          ]
        }]
      });
    } catch (error) {
      console.error("Error en el servicio getAll de entidades:", error);
      throw error;
    }
  },

  /**
   * Obtiene una entidad específica por su ID
   * @param {number} id - ID de la entidad a buscar
   * @returns {Promise<Object|null>} Entidad encontrada o null
   */
  getById: async (id) => {
    try {
      return await Entidad.findByPk(id, {
        include: [{
          model: Contrato,
          as: 'contratos',
          include: [
            {
              model: TipoContrato,
              as: 'tipoContrato'
            },
            {
              model: Oferta,
              as: 'oferta'
            },
            {
              model: TrabajadorAutorizado,
              as: 'trabajadoresAutorizados'
            }
          ]
        }]
      });
    } catch (error) {
      console.error("Error en el servicio getById de entidades:", error);
      throw error;
    }
  },

  /**
   * Valida los datos de una entidad antes de crearla o actualizarla
   * @param {Object} data - Datos de la entidad a validar
   * @returns {Array} Lista de errores encontrados
   */
  validateEntidad: (data) => {
    const errors = [];

    // Validar nombre (requerido)
    if (!data.nombre || data.nombre.trim() === '') {
      errors.push('El nombre de la entidad es requerido');
    }



    // Validar cuenta bancaria si está presente
    if (data.cuenta_bancaria) {
      const accountRegex = /^[0-9-]{10,20}$/;
      if (!accountRegex.test(data.cuenta_bancaria)) {
        errors.push('El formato de la cuenta bancaria no es válido');
      }
    }

    return errors;
  },

  /**
   * Crea una nueva entidad
   * @param {Object} data - Datos de la entidad a crear
   * @returns {Promise<Object>} Entidad creada
   * @throws {Error} Si hay errores de validación
   */
  create: async (data, options = {}) => {
    try {
      // Validar datos
      const validationErrors = EntidadService.validateEntidad(data);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Verificar si ya existe una entidad con el mismo nombre
      const existingEntidad = await Entidad.findOne({ where: { nombre: data.nombre }, ...options });
      if (existingEntidad) {
        throw new Error('Ya existe una entidad con ese nombre');
      }

      return await Entidad.create(data, options);
    } catch (error) {
      console.error("Error en el servicio create de entidades:", error);
      if (error instanceof ValidationError) {
        throw new Error('Error de validación: ' + error.message);
      }
      throw error;
    }
  },

  /**
   * Actualiza una entidad existente
   * @param {number} id - ID de la entidad a actualizar
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object|null>} Entidad actualizada o null si no existe
   * @throws {Error} Si hay errores de validación
   */
  update: async (id, data, options = {}) => {
    try {
      // Validar datos
      const validationErrors = EntidadService.validateEntidad(data);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const entidad = await Entidad.findByPk(id, options);
      if (!entidad) {
        return null;
      }

      // Verificar si el nuevo nombre ya existe en otra entidad
      if (data.nombre && data.nombre !== entidad.nombre) {
        const existingEntidad = await Entidad.findOne({ where: { nombre: data.nombre }, ...options });
        if (existingEntidad) {
          throw new Error('Ya existe una entidad con ese nombre');
        }
      }

      return await entidad.update(data, options);
    } catch (error) {
      console.error("Error en el servicio update de entidades:", error);
      if (error instanceof ValidationError) {
        throw new Error('Error de validación: ' + error.message);
      }
      throw error;
    }
  },

  /**
   * Elimina una entidad
   * @param {number} id - ID de la entidad a eliminar
   * @returns {Promise<boolean>} true si se eliminó, false si no existe
   */
  delete: async (id, options = {}) => {
    try {
      const entidad = await Entidad.findByPk(id, options);
      if (entidad) {
        await entidad.destroy(options);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en el servicio delete de entidades:", error);
      throw error;
    }
  },



  /**
   * Filtra entidades por múltiples criterios con paginación
   * @param {Object} filters - Objeto con los criterios de filtrado
   * @param {number} page - Número de página (comienza en 1)
   * @param {number} limit - Número de elementos por página
   * @returns {Object} Objeto con las entidades filtradas y datos de paginación
   */
  filterEntidades: async (filters, page = 1, limit = 10, options = {}) => {
    try {
      const offset = (page - 1) * limit;
      
      // Construir el whereClause para los filtros
      const whereClause = {};
      for (const [key, value] of Object.entries(filters)) {
        if (value) {
          whereClause[key] = {
            [Op.iLike]: `%${value}%`
          };
        }
      }

      // Obtener el total de registros que coinciden con los filtros
  const total = await Entidad.count({ where: whereClause, ...options });

      // Obtener las entidades con paginación
      const entidades = await Entidad.findAll({
        where: whereClause,
        include: [{
          model: Contrato,
          as: 'contratos',
          include: [
            {
              model: TipoContrato,
              as: 'tipoContrato'
            },
            {
              model: Oferta,
              as: 'oferta'
            },
            {
              model: TrabajadorAutorizado,
              as: 'trabajadoresAutorizados'
            }
          ]
        }],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      }, options);

      return {
        entidades,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error("Error en filterEntidades:", error);
      throw error;
    }
  }
};

module.exports = EntidadService; 