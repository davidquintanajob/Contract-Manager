// services/usuarioService.js

const  Usuario  = require("../models/usuario");
const Oferta = require("../models/oferta");
const { Op } = require('sequelize');

/**
 * Obtener todos los usuarios
 */
const getAllUsuarios = async () => {
  try {
    return await Usuario.findAll({
      include: [{
        model: Oferta,
        required: false // Esto permite que se incluyan usuarios sin ofertas
      }]
    });
  } catch (error) {
    console.log("Error en los servicios de getAllUsuarios: ", error);
    throw error; // Lanza el error para que el controlador pueda manejarlo
  }
};

/**
 * Obtener un usuario por ID
 */
const getUsuarioById = async (id) => {
  return await Usuario.findOne({
    where: { id_usuario: id },
    include: [{
      model: Oferta,
      required: false // Esto permite que se incluyan usuarios sin ofertas
    }]
  });
};

const usuarioExists = async (nombre_usuario) => {
  const usuario = await Usuario.findOne({ where: { nombre_usuario } });
  return usuario !== null; // Devuelve true si el usuario existe, false si no
};

/**
 * Crear un nuevo usuario
 */
const createUsuario = async (usuarioData) => {
  try {
    return await Usuario.create(usuarioData);
  } catch (error) {
    console.log("Error al en el servicio de crear usuario: ", error);
    throw error
  }
};

/**
 * Actualizar un usuario
 */
const updateUsuario = async (id, userData) => {
  try {
    const usuario = await Usuario.findOne({ where: { id_usuario: id } });
    if (usuario) {
      await usuario.update(userData);
      return usuario;
    }
    return null;
  } catch (error) {
    console.log("Error en el servicio de actualizar usuario: ", error);
    throw error;
  }
};

/**
 * Eliminar un usuario
 */
const deleteUsuario = async (id) => {
  try {
    const usuario = await Usuario.findOne({
      where: { id_usuario: id }
    });
    
    if (usuario) {
      await usuario.destroy();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error en el servicio de eliminar usuario:", error);
    throw error;
  }
};

const getUsuarioByNombreUsuario = async (nombre_usuario) => {
  try {
      return await Usuario.findOne({ where: { nombre_usuario } });
  } catch (error) {
      console.log("Error al obtener el usuario por nombre de usuario:", error);
      throw error;
  }
};

/**
 * Filtrar usuarios por múltiples criterios
 */
const filterUsuarios = async (filterCriteria) => {
  try {
    const whereClause = {};
    for (const key in filterCriteria) {
      if (Object.prototype.hasOwnProperty.call(filterCriteria, key)) {
        whereClause[key] = { [Op.iLike]: `%${filterCriteria[key].toLowerCase()}%` };
      }
    }

    return await Usuario.findAll({
      where: whereClause,
      include: [{
        model: Oferta,
        required: false
      }]
    });
  } catch (error) {
    console.error("Error en el servicio de filtrar usuarios:", error);
    throw error;
  }
};

// Exportar las funciones
module.exports = {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  usuarioExists,
  getUsuarioByNombreUsuario,
  filterUsuarios,
};