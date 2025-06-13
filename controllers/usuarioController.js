// controllers/usuarioController.js
/* global process */
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const usuarioService = require('../services/usuarioService');
/**
 * Obtener todos los usuarios
 */
const getUsuarios = async (req, res) => {
    try {
        // Obtener los usuarios desde el servicio
        const usuarios = await usuarioService.getAllUsuarios();

        // Verificar si hay usuarios
        if (!usuarios || usuarios.length === 0) {
            return res.status(200).json([]); // Retornar un array vacío si no hay usuarios
        }

        return res.status(200).json(usuarios); // Retornar la lista de usuarios
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        return res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
};

/**
 * Obtener un usuario por ID
 */
const getUsuarioById = async (req, res) => {
    const { id } = req.params; // Obtener el ID del usuario desde los parámetros
    try {
        const usuario = await usuarioService.getUsuarioById(id);

        // Verificar si el usuario fue encontrado
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json(usuario); // Retornar el usuario encontrado
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        return res.status(500).json({ message: "Error al obtener el usuario", error });
    }
};

/**
 * Crear un nuevo usuario
 */
const createUsuario = async (req, res) => {
  const { nombre, nombre_usuario, cargo, contrasenna, rol } = req.body;
  const errors = [];

  // Validar campos requeridos
  if (!nombre || !nombre_usuario || !cargo || !contrasenna || !rol) {
    errors.push("Todos los campos son obligatorios: nombre, nombre_usuario, cargo, contrasenna, rol");
  }

  // Validar formato del nombre
  if (nombre) {
    if (nombre.length < 3 || nombre.length > 50) {
      errors.push("El nombre debe tener entre 3 y 50 caracteres");
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
      errors.push("El nombre solo puede contener letras y espacios");
    }
  }

  // Validar formato del nombre de usuario
  if (nombre_usuario) {
    if (nombre_usuario.length < 4 || nombre_usuario.length > 20) {
      errors.push("El nombre de usuario debe tener entre 4 y 20 caracteres");
    }
    if (!/^[a-zA-Z0-9_]+$/.test(nombre_usuario)) {
      errors.push("El nombre de usuario solo puede contener letras, números y guiones bajos");
    }
  }

  // Validar formato del cargo
  if (cargo) {
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(cargo)) {
      errors.push("El cargo solo puede contener letras y espacios");
    }
  }

  // Validar formato de la contraseña
  if (contrasenna) {
    if (contrasenna.length < 6) {
      errors.push("La contraseña debe tener al menos 6 caracteres");
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(contrasenna)) {
      errors.push("La contraseña debe contener al menos una letra mayúscula, una minúscula y un número");
    }
  }

  // Validar rol
  if (rol) {
    const rolesValidos = ["Administrador", "Empleado", "Administrador General"];
    if (!rolesValidos.includes(rol)) {
      errors.push("El rol debe ser uno de los siguientes: Administrador, Empleado, Administrador General");
    }
  }

  // Si hay errores de validación, retornarlos todos juntos
  if (errors.length > 0) {
    return res.status(400).json({
      message: "Errores de validación",
      errors: errors
    });
  }

  // Verificar si el nombre de usuario ya existe
  try {
    const usuarioExists = await usuarioService.usuarioExists(nombre_usuario);
    if (usuarioExists) {
      return res.status(400).json({
        message: `Ya existe un usuario con el nombre de usuario: ${nombre_usuario}`,
      });
    }
  } catch (error) {
    console.error("Error al verificar el nombre de usuario:", error);
    return res.status(500).json({
      message: "Error al crear el usuario",
      error: error.message,
    });
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(contrasenna, 10);

  const usuarioData = {
    nombre,
    nombre_usuario,
    cargo,
    contrasenna: hashedPassword,
    rol,
    activo: true
  };
  
  try {
    const newUsuario = await usuarioService.createUsuario(usuarioData);
    return res.status(201).json({
      message: "Usuario creado exitosamente",
      data: {
        id_usuario: newUsuario.id_usuario,
        nombre: newUsuario.nombre,
        nombre_usuario: newUsuario.nombre_usuario,
        cargo: newUsuario.cargo,
        rol: newUsuario.rol,
        activo: newUsuario.activo
      }
    });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return res.status(500).json({
      message: "Error al crear el usuario",
      error: error.message,
    });
  }
};

/**
 * Actualizar un usuario
 */
const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, nombre_usuario, cargo, contrasenna, rol, activo } = req.body;
  
    // Validar que se proporcione al menos un campo para actualizar
    if (!nombre && !nombre_usuario && !cargo && !contrasenna && !rol && !activo) {
      return res.status(400).json({ 
        message: "Se debe proporcionar al menos un campo para actualizar: nombre, nombre_usuario, cargo, contrasenna, rol o activo" 
      });
    }

    // Validar que el rol de usuario sea correcto
    if (rol !== "Administrador" && rol !== "Empleado" && rol !== "Administrador General") {
      return res.status(400).json({
        message: "El rol de usuario debe ser Administrador, Administrador General o Empleado"
      });
    }
    
    try {
      // Verificar si el usuario existe
      const usuario = await usuarioService.getUsuarioById(id);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      // Preparar los datos para la actualización
      const updatedUserData = {};
  
      // Actualizar cada campo solo si se proporciona
      if (nombre) {
        updatedUserData.nombre = nombre;
      }
  
      if (nombre_usuario) {
        // Verificar si el nuevo nombre de usuario ya existe
        const usuarioExists = await usuarioService.usuarioExists(nombre_usuario);
        if (usuarioExists && usuario.nombre_usuario !== nombre_usuario) {
          return res.status(400).json({
            message: `Ya existe un usuario con el nombre de usuario: ${nombre_usuario}`
          });
        }
        updatedUserData.nombre_usuario = nombre_usuario;
      }
  
      if (cargo) {
        updatedUserData.cargo = cargo;
      }
  
      if (contrasenna) {
        const hashedPassword = await bcrypt.hash(contrasenna, 10);
        updatedUserData.contrasenna = hashedPassword;
      }
  
      if (rol) {
        updatedUserData.rol = rol;
      }
  
      if (activo) {
        updatedUserData.activo = activo;
      }
  
      // Actualizar el usuario
      const updatedUsuario = await usuarioService.updateUsuario(id, updatedUserData);
      if (!updatedUsuario) {
        return res.status(500).json({ message: "No se pudo actualizar el usuario" });
      }
  
      // Obtener el usuario actualizado
      const updatedUser = await usuarioService.getUsuarioById(id);
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      return res.status(500).json({ message: "Error al actualizar el usuario", error });
    }
};

/**
 * Eliminar un usuario
 */
const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Verificar si el usuario existe antes de intentar eliminarlo
        const usuario = await usuarioService.getUsuarioById(id);
        if (!usuario) {
            return res.status(404).json({ 
                message: "Usuario no encontrado" 
            });
        }

        // Verificar si el usuario está activo
        if (!usuario.activo) {
            return res.status(400).json({ 
                message: "El usuario ya está inactivo" 
            });
        }

        // Intentar eliminar el usuario
        const result = await usuarioService.deleteUsuario(id);
        
        if (!result) {
            return res.status(500).json({ 
                message: "Error al eliminar el usuario" 
            });
        }

        return res.status(200).json({ 
            message: "Usuario eliminado exitosamente",
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                nombre_usuario: usuario.nombre_usuario
            }
        });
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        return res.status(500).json({ 
            message: "Error al eliminar el usuario", 
            error: error.message 
        });
    }
};

const login = async (req, res) => {
  const { nombre_usuario, contrasenna } = req.body;

  try {
    const usuario = await usuarioService.getUsuarioByNombreUsuario(nombre_usuario);
    if (!usuario) {
      return res.status(404).json({ message: "No se ha encontrado el usuario con el nombre de usuario pasado por parámetros." });
    }

    const isValidPassword = await bcrypt.compare(contrasenna, usuario.contrasenna);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Modificar el payload del token para incluir más datos del usuario
    const token = jwt.sign(
      {
        userId: usuario.id_usuario,
        nombre: usuario.nombre,
        nombre_usuario: usuario.nombre_usuario,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign({ userId: usuario.id_usuario }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '24h' });

    // Modificar el objeto de respuesta
    const respuesta = {
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre, // Incluir nombre
        nombre_usuario: usuario.nombre_usuario,
        rol: usuario.rol // Incluir rol
        // Eliminar email si no es necesario en la respuesta
      },
      token: token,
      refreshToken
    };

    return res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

/**
 * Filtrar usuarios por múltiples criterios
 */
const filterUsuarios = async (req, res) => {
  const { nombre, nombre_usuario, cargo, rol } = req.body;

  // Construir el objeto de criterios de filtro
  const filterCriteria = {};
  if (nombre) {
    filterCriteria.nombre = nombre;
  }
  if (nombre_usuario) {
    filterCriteria.nombre_usuario = nombre_usuario;
  }
  if (cargo) {
    filterCriteria.cargo = cargo;
  }
  if (rol) {
    filterCriteria.rol = rol;
  }

  // Validar que al menos un criterio de filtro fue proporcionado
  if (Object.keys(filterCriteria).length === 0) {
    return res.status(400).json({ message: "Se debe proporcionar al menos un criterio de filtro (nombre, nombre_usuario, cargo o rol)." });
  }

  try {
    const usuariosFiltrados = await usuarioService.filterUsuarios(filterCriteria);
    return res.status(200).json(usuariosFiltrados);
  } catch (error) {
    console.error("Error al filtrar usuarios:", error);
    return res.status(500).json({ message: "Error al filtrar usuarios", error });
  }
};

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    login,
    filterUsuarios,
};