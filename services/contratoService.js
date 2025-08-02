const Contrato = require("../models/contrato.js");
const Entidad = require("../models/entidad.js");
const TipoContrato = require("../models/tipo_contrato.js");
const Oferta = require("../models/oferta.js");
const TrabajadorAutorizado = require("../models/trabajador_autorizado.js");
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');

/**
 * Servicio para la gestión de contratos
 * Implementa el patrón Repository para el acceso a datos
 * Sigue los principios SOLID:
 * - Single Responsibility: Cada método tiene una única responsabilidad
 * - Open/Closed: Extensible para nuevas funcionalidades sin modificar el código existente
 * - Interface Segregation: Métodos específicos para cada operación
 * - Dependency Inversion: Depende de abstracciones (modelos) no de implementaciones concretas
 */
const ContratoService = {
  /**
   * Obtiene todos los contratos con sus relaciones
   * @returns {Promise<Array>} Lista de contratos con sus relaciones
   */
  getAll: async () => {
    return await Contrato.findAll({
      include: [
        {
          model: Entidad,
          as: 'entidad'
        },
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
    });
  },

  /**
   * Obtiene un contrato por su ID con sus relaciones
   * @param {number} id - ID del contrato a buscar
   * @returns {Promise<Object|null>} Contrato encontrado o null
   */
  getById: async (id) => {
    return await Contrato.findByPk(id, {
      include: [
        {
          model: Entidad,
          as: 'entidad'
        },
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
    });
  },

  /**
   * Obtiene el siguiente número consecutivo disponible para un año específico
   * @param {number} year - Año para determinar el número consecutivo
   * @returns {Promise<number>} El siguiente número consecutivo disponible
   * @throws {Error} Si el año es inválido
   */
  getNextConsecutivo: async (year) => {
    try {
      // Validar que el año sea un número válido
      const yearNum = parseInt(year);
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2200) {
        throw new Error('El año debe ser un número válido entre 1900 y 2200');
      }

      // Calcular el rango de fechas para el año
      const startOfYear = new Date(yearNum, 0, 0);
      const endOfYear = new Date(yearNum, 11, 32);

      // Buscar todos los contratos del año
      const contratos = await Contrato.findAll({
        where: {
          fecha_inicio: {
            [Op.between]: [startOfYear, endOfYear]
          }
        },
        attributes: ['num_consecutivo'],
        order: [['num_consecutivo', 'DESC']]
      });

      // Si no hay contratos en el año, retornar 1
      if (contratos.length === 0) {
        return 1;
      }

      // Obtener el número consecutivo más alto
      const maxConsecutivo = contratos[0].num_consecutivo;
      console.log("Número consecutivo más alto:", maxConsecutivo);

      // Retornar el siguiente número consecutivo
      return maxConsecutivo + 1;
    } catch (error) {
      console.error('Error al obtener el siguiente número consecutivo:', error);
      throw new Error(`Error al obtener el siguiente número consecutivo: ${error.message}`);
    }
  },

  /**
   * Valida los datos de un contrato antes de crearlo o actualizarlo
   * @param {Object} data - Datos del contrato a validar
   * @param {number} [excludeId] - ID del contrato a excluir en validaciones (para actualizaciones)
   * @returns {Promise<Array>} Lista de errores encontrados
   */
  validateContrato: async (data, excludeId = null) => {
    const errors = [];

    // Validar fechas
    if (data.fecha_inicio && data.fecha_fin) {
      const fechaInicio = new Date(data.fecha_inicio);
      const fechaFin = new Date(data.fecha_fin);

      if (fechaInicio >= fechaFin) {
        errors.push('La fecha de inicio debe ser anterior a la fecha de fin');
      }
    }

    // Validar número consecutivo único por año
    if (data.num_consecutivo && data.fecha_inicio) {
      const fechaInicio = new Date(data.fecha_inicio);
      const year = fechaInicio.getUTCFullYear();
      const startOfYear = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
      const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59));

      const whereClause = {
        num_consecutivo: data.num_consecutivo,
        fecha_inicio: {
          [Op.between]: [startOfYear, endOfYear]
        }
      };

      if (excludeId) {
        whereClause.id_contrato = { [Op.ne]: excludeId };
      }

      const existingContrato = await Contrato.findOne({ where: whereClause });
      if (existingContrato) {
        errors.push(`Ya existe un contrato con el número consecutivo ${data.num_consecutivo} en el año ${year}`);
      }
    }

    // Validar entidad
    if (data.id_entidad) {
      const entidad = await Entidad.findByPk(data.id_entidad);
      if (!entidad) {
        errors.push('La entidad especificada no existe');
      }
    }

    // Validar tipo de contrato
    if (data.id_tipo_contrato) {
      const tipoContrato = await TipoContrato.findByPk(data.id_tipo_contrato);
      if (!tipoContrato) {
        errors.push('El tipo de contrato especificado no existe');
      }
    }

    // Validar que no exista un contrato vigente con la misma entidad y tipo de contrato
    if (data.id_entidad && data.id_tipo_contrato) {
      const fechaActual = new Date();
      
      const whereClause = {
        id_entidad: data.id_entidad,
        id_tipo_contrato: data.id_tipo_contrato,
        fecha_fin: {
          [Op.gt]: fechaActual // Solo contratos que no han vencido
        }
      };

      // Excluir el contrato actual en caso de actualización
      if (excludeId) {
        whereClause.id_contrato = { [Op.ne]: excludeId };
      }

      const contratoVigente = await Contrato.findOne({
        where: whereClause,
        include: [
          {
            model: Entidad,
            as: 'entidad',
            attributes: ['nombre']
          },
          {
            model: TipoContrato,
            as: 'tipoContrato',
            attributes: ['nombre']
          }
        ]
      });

      if (contratoVigente) {
        errors.push(`Ya existe un contrato vigente para la entidad "${contratoVigente.entidad.nombre}" con el tipo de contrato "${contratoVigente.tipoContrato.nombre}"`);
      }
    }

    return errors;
  },

  /**
   * Crea un nuevo contrato
   * @param {Object} data - Datos del contrato a crear
   * @returns {Promise<Object>} Contrato creado
   * @throws {Error} Si hay errores de validación
   */
  create: async (data) => {
    // Validar datos
    const errors = await ContratoService.validateContrato(data);
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return await Contrato.create(data);
  },

  /**
   * Actualiza un contrato existente
   * @param {number} id - ID del contrato a actualizar
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object|null>} Contrato actualizado o null si no existe
   * @throws {Error} Si hay errores de validación
   */
  update: async (id, data) => {
    const contrato = await Contrato.findByPk(id);
    if (!contrato) {
      return null;
    }

    // Validar datos
    const errors = await ContratoService.validateContrato(data, id);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    await contrato.update(data);
    return await Contrato.findByPk(id, {
      include: [
        {
          model: Entidad,
          as: 'entidad'
        },
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
    });
  },

  /**
   * Elimina un contrato
   * @param {number} id - ID del contrato a eliminar
   * @returns {Promise<boolean>} true si se eliminó, false si no existe
   */
  delete: async (id) => {
    const contrato = await Contrato.findByPk(id);
    if (contrato) {
      await contrato.destroy();
      return true;
    }
    return false;
  },

  /**
   * Filtra contratos según los criterios proporcionados
   * @param {Object} filters - Objeto con los criterios de filtrado
   * @param {string} [filters.nombre_entidad] - Nombre de la entidad (búsqueda case-insensitive)
   * @param {number} [filters.id_tipo_contrato] - ID del tipo de contrato
   * @param {Date} [filters.fecha_inicio] - Fecha de inicio mínima
   * @param {Date} [filters.fecha_fin] - Fecha de fin máxima
   * @param {number} [filters.num_consecutivo] - Número consecutivo
   * @param {number} page - Número de página
   * @param {number} limit - Límite de registros por página
   * @returns {Promise<Object>} Objeto con los contratos filtrados y metadatos de paginación
   */
  filterContratos: async (filters, page = 1, limit = 10) => {
    try {
      const whereClause = {};
      const includeClause = [
        {
          model: Entidad,
          as: 'entidad',
          attributes: ['id_entidad', 'nombre', 'direccion', 'telefono', 'email', 'tipo_entidad']
        },
        {
          model: TipoContrato,
          as: 'tipoContrato',
          attributes: ['id_tipo_contrato', 'nombre']
        },
        {
          model: Oferta,
          as: 'oferta'
        },
        {
          model: TrabajadorAutorizado,
          as: 'trabajadoresAutorizados'
        }
      ];

      // Filtrar por nombre de entidad (case-insensitive)
      if (filters.nombre_entidad) {
        includeClause[0].where = {
          nombre: Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('entidad.nombre')),
            'LIKE',
            `%${filters.nombre_entidad.toLowerCase()}%`
          )
        };
      }

      // Filtrar por tipo de contrato
      if (filters.id_tipo_contrato) {
        whereClause.id_tipo_contrato = filters.id_tipo_contrato;
      }

      // Filtrar por fecha de inicio
      if (filters.fecha_inicio) {
        whereClause.fecha_inicio = {
          [Op.gte]: new Date(filters.fecha_inicio)
        };
      }

      // Filtrar por fecha de fin
      if (filters.fecha_fin) {
        whereClause.fecha_fin = {
          [Op.lte]: new Date(filters.fecha_fin)
        };
      }

      // Filtrar por número consecutivo
      if (filters.num_consecutivo) {
        whereClause.num_consecutivo = filters.num_consecutivo;
      }

      // Calcular offset para la paginación
      const offset = (page - 1) * limit;

      // Primero, contar el total de contratos únicos que coinciden con los filtros
      // Solo incluir relaciones que no dupliquen registros (Entidad y TipoContrato)
      const countIncludeClause = includeClause.filter(include => 
        include.model === Entidad || include.model === TipoContrato
      );
      
      const totalCount = await Contrato.count({
        where: whereClause,
        include: countIncludeClause,
        distinct: true
      });

      // Luego, obtener los contratos con todas las relaciones para la página actual
      const contratos = await Contrato.findAll({
        where: whereClause,
        include: includeClause,
        order: [['fecha_inicio', 'DESC'], ['num_consecutivo', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      // Calcular metadatos de paginación
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        contratos,
        pagination: {
          total: totalCount,
          totalPages,
          currentPage: parseInt(page),
          limit: parseInt(limit),
          hasNextPage,
          hasPrevPage
        }
      };
    } catch (error) {
      console.error('Error al filtrar contratos:', error);
      throw new Error(`Error al filtrar contratos: ${error.message}`);
    }
  },

  /**
   * Obtiene contratos que están próximos a vencer (1 mes o menos antes de la fecha fin)
   * @returns {Promise<Array>} Lista de contratos próximos a vencer
   */
  getContratosProximosAVencer: async () => {
    try {
      const fechaActual = new Date();
      const fechaLimite = new Date();
      fechaLimite.setMonth(fechaLimite.getMonth() + 1); // 1 mes desde hoy

      return await Contrato.findAll({
        where: {
          fecha_fin: {
            [Op.between]: [fechaActual, fechaLimite]
          }
        },
        include: [
          {
            model: Entidad,
            as: 'entidad',
            attributes: ['id_entidad', 'nombre', 'direccion', 'telefono', 'email', 'tipo_entidad']
          },
          {
            model: TipoContrato,
            as: 'tipoContrato',
            attributes: ['id_tipo_contrato', 'nombre']
          }
        ],
        order: [['fecha_fin', 'ASC']] // Ordenar por fecha de vencimiento (más próximos primero)
      });
    } catch (error) {
      console.error('Error al obtener contratos próximos a vencer:', error);
      throw new Error(`Error al obtener contratos próximos a vencer: ${error.message}`);
    }
  },
};

module.exports = ContratoService; 