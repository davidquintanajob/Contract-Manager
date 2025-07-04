const ContratoService = require("../services/contratoService.js");

/**
 * Controlador para la gestión de contratos
 * Implementa el patrón MVC y sigue los principios SOLID:
 * - Single Responsibility: Cada método tiene una única responsabilidad
 * - Open/Closed: Extensible para nuevas funcionalidades sin modificar el código existente
 * - Interface Segregation: Métodos específicos para cada operación
 * - Dependency Inversion: Depende de abstracciones (ContratoService) no de implementaciones concretas
 */
const ContratoController = {
  /**
   * Obtiene todos los contratos
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  getAllContratos: async (req, res) => {
    try {
      const contratos = await ContratoService.getAll();
      return res.status(200).json({
        message: "Contratos obtenidos exitosamente",
        data: contratos
      });
    } catch (error) {
      console.error("Error al obtener los contratos:", error);
      return res.status(500).json({
        message: "Error al obtener los contratos",
        error: error.message
      });
    }
  },

  /**
   * Obtiene un contrato por su ID
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  getContratoById: async (req, res) => {
    const { id } = req.params;

    // Validar que el ID sea un número
    if (isNaN(id) || !Number.isInteger(Number(id))) {
      return res.status(400).json({
        message: "El ID debe ser un número entero válido",
        error: "ID inválido"
      });
    }

    try {
      const contrato = await ContratoService.getById(Number(id));
      if (!contrato) {
        return res.status(404).json({
          message: `No se encontró el contrato con ID: ${id}`,
          error: "Contrato no encontrado"
        });
      }
      return res.status(200).json({
        message: "Contrato encontrado exitosamente",
        data: contrato
      });
    } catch (error) {
      console.error("Error al obtener el contrato:", error);
      return res.status(500).json({
        message: "Error al obtener el contrato",
        error: error.message
      });
    }
  },

  /**
   * Crea un nuevo contrato
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  createContrato: async (req, res) => {
    const {
      id_entidad,
      id_tipo_contrato,
      fecha_inicio,
      fecha_fin,
      num_consecutivo,
      clasificacion,
      nota
    } = req.body;

    // Validar campos requeridos
    const camposRequeridos = [
      'id_entidad',
      'id_tipo_contrato',
      'fecha_inicio',
      'fecha_fin',
      'num_consecutivo',
      'clasificacion'
    ];

    const camposFaltantes = camposRequeridos.filter(campo => !req.body[campo]);
    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        message: "Faltan campos requeridos",
        error: `Campos faltantes: ${camposFaltantes.join(', ')}`
      });
    }

    try {
      const newContrato = await ContratoService.create({
        id_entidad,
        id_tipo_contrato,
        fecha_inicio,
        fecha_fin,
        num_consecutivo,
        clasificacion,
        nota
      });

      return res.status(201).json({
        message: "Contrato creado exitosamente",
        data: newContrato
      });
    } catch (error) {
      console.error("Error al crear el contrato:", error);
      // Mostrar el mensaje completo y los errores internos de Sequelize si existen
      return res.status(400).json({
        message: "Error al crear el contrato",
        error: error.message,
        details: error.errors || error
      });
    }
  },

  /**
   * Actualiza un contrato existente
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  updateContrato: async (req, res) => {
    const { id } = req.params;
    const {
      id_entidad,
      id_tipo_contrato,
      fecha_inicio,
      fecha_fin,
      num_consecutivo,
      clasificacion,
      nota
    } = req.body;

    // Validar que el ID sea un número
    if (isNaN(id) || !Number.isInteger(Number(id))) {
      return res.status(400).json({
        message: "El ID debe ser un número entero válido",
        error: "ID inválido"
      });
    }

    try {
      const updatedContrato = await ContratoService.update(Number(id), {
        id_entidad,
        id_tipo_contrato,
        fecha_inicio,
        fecha_fin,
        num_consecutivo,
        clasificacion,
        nota
      });

      if (!updatedContrato) {
        return res.status(404).json({
          message: `No se encontró el contrato con ID: ${id}`,
          error: "Contrato no encontrado"
        });
      }

      return res.status(200).json({
        message: "Contrato actualizado exitosamente",
        data: updatedContrato
      });
    } catch (error) {
      console.error("Error al actualizar el contrato:", error);
      // Mostrar el mensaje completo y los errores internos de Sequelize si existen
      return res.status(400).json({
        message: "Error al actualizar el contrato",
        error: error.message,
        details: error.errors || error
      });
    }
  },

  /**
   * Elimina un contrato
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  deleteContrato: async (req, res) => {
    const { id } = req.params;

    // Validar que el ID sea un número
    if (isNaN(id) || !Number.isInteger(Number(id))) {
      return res.status(400).json({
        message: "El ID debe ser un número entero válido",
        error: "ID inválido"
      });
    }

    try {
      const contrato = await ContratoService.getById(Number(id));
      if (!contrato) {
        return res.status(404).json({
          message: `No se encontró el contrato con ID: ${id}`,
          error: "Contrato no encontrado"
        });
      }

      // Validar si tiene ofertas asociadas
      if (contrato.oferta && contrato.oferta.length > 0) {
        return res.status(400).json({
          message: `No se puede eliminar el contrato porque está relacionado con ofertas.`,
          relaciones: contrato.oferta.map(o => ({
            id_oferta: o.id_oferta,
            descripcion: o.descripcion
          }))
        });
      }
      // Validar si tiene trabajadores autorizados asociados
      if (contrato.trabajadoresAutorizados && contrato.trabajadoresAutorizados.length > 0) {
        return res.status(400).json({
          message: `No se puede eliminar el contrato porque está relacionado con trabajadores autorizados.`,
          relaciones: contrato.trabajadoresAutorizados.map(t => ({
            id_trabajador_autorizado: t.id_trabajador_autorizado,
            nombre: t.nombre
          }))
        });
      }

      const deleted = await ContratoService.delete(Number(id));
      if (!deleted) {
        return res.status(404).json({
          message: `No se encontró el contrato con ID: ${id}`,
          error: "Contrato no encontrado"
        });
      }

      return res.status(200).json({
        message: "Contrato eliminado exitosamente"
      });
    } catch (error) {
      console.error("Error al eliminar el contrato:", error);
      return res.status(500).json({
        message: "Error al eliminar el contrato",
        error: error.message
      });
    }
  },

  /**
   * Obtiene el siguiente número consecutivo disponible para un año específico
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  getNextConsecutivo: async (req, res) => {
    const { year } = req.params;

    if (!year) {
      return res.status(400).json({
        message: "El año es requerido",
        error: "Año no proporcionado"
      });
    }

    // Validar que el año sea un número
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) {
      return res.status(400).json({
        message: "Formato de año inválido",
        error: "El año debe ser un número"
      });
    }

    try {
      const nextConsecutivo = await ContratoService.getNextConsecutivo(yearNum);
      return res.status(200).json({
        message: "Siguiente número consecutivo obtenido exitosamente",
        data: {
          year: yearNum,
          siguiente_consecutivo: nextConsecutivo
        }
      });
    } catch (error) {
      console.error("Error al obtener el siguiente número consecutivo:", error);
      return res.status(400).json({
        message: "Error al obtener el siguiente número consecutivo",
        error: error.message
      });
    }
  },

  /**
   * Filtra contratos según los criterios proporcionados
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  filterContratos: async (req, res) => {
    try {
      const filters = req.body;
      const page = parseInt(req.params.page) || 1;
      const limit = parseInt(req.params.limit) || 10;

      const result = await ContratoService.filterContratos(filters, page, limit);
      
      res.status(200).json({
        message: "Contratos filtrados exitosamente",
        data: result.contratos,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error en el controlador al filtrar contratos:', error);
      res.status(500).json({
        message: "Error al filtrar contratos",
        error: error.message
      });
    }
  },
};

module.exports = ContratoController; 