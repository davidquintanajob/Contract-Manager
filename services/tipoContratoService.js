const TipoContrato = require("../models/tipo_contrato.js");

/**
 * Servicio para la gestión de tipos de contrato
 * Implementa la lógica de negocio y la interacción con la base de datos
 */
const TipoContratoService = {
  /**
   * Obtiene todos los tipos de contrato
   * @returns {Promise<Array>} Lista de tipos de contrato
   */
  getAll: async () => {
    return await TipoContrato.findAll();
  },

  /**
   * Obtiene un tipo de contrato por su ID
   * @param {number} id - ID del tipo de contrato
   * @returns {Promise<Object|null>} Tipo de contrato encontrado o null
   */
  getById: async (id) => {
    return await TipoContrato.findByPk(id);
  },

  /**
   * Obtiene un tipo de contrato por su nombre
   * @param {string} nombre - Nombre del tipo de contrato
   * @returns {Promise<Object|null>} Tipo de contrato encontrado o null
   */
  getByName: async (nombre) => {
    return await TipoContrato.findOne({
      where: {
        nombre: nombre
      }
    });
  },

  /**
   * Crea un nuevo tipo de contrato
   * @param {Object} tipoContratoData - Datos del tipo de contrato
   * @returns {Promise<Object>} Tipo de contrato creado
   */
  create: async (tipoContratoData) => {
    return await TipoContrato.create(tipoContratoData);
  },

  /**
   * Actualiza un tipo de contrato existente
   * @param {number} id - ID del tipo de contrato
   * @param {Object} tipoContratoData - Datos actualizados del tipo de contrato
   * @returns {Promise<Object|null>} Tipo de contrato actualizado o null
   */
  update: async (id, tipoContratoData) => {
    const tipoContrato = await TipoContrato.findByPk(id);
    if (tipoContrato) {
      await tipoContrato.update(tipoContratoData);
      return tipoContrato;
    }
    return null;
  },

  /**
   * Elimina un tipo de contrato
   * @param {number} id - ID del tipo de contrato
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  delete: async (id) => {
    const tipoContrato = await TipoContrato.findByPk(id);
    if (tipoContrato) {
      await tipoContrato.destroy();
      return true;
    }
    return false;
  },
};

module.exports = TipoContratoService; 