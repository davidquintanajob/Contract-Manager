const EntidadService = require("../services/entidadService.js");

/**
 * Controlador para la gestión de entidades
 * Implementa el patrón MVC y sigue los principios SOLID:
 * - Single Responsibility: Cada método tiene una única responsabilidad
 * - Open/Closed: Extensible para nuevas funcionalidades sin modificar el código existente
 * - Interface Segregation: Métodos específicos para cada operación
 * - Dependency Inversion: Depende de abstracciones (EntidadService) no de implementaciones concretas
 */
const EntidadController = {
  /**
   * Obtener todas las entidades
   */
  getAllEntidades: async (req, res) => {
    try {
      const entidades = await EntidadService.getAll();
      return res.status(200).json({
        message: "Entidades obtenidas exitosamente",
        data: entidades
      });
    } catch (error) {
      console.error("Error al obtener las entidades:", error);
      return res.status(500).json({
        message: "Error al obtener las entidades",
        error: error.message
      });
    }
  },

  /**
   * Obtener una entidad por su ID
   */
  getEntidadById: async (req, res) => {
    const { id } = req.params;

    // Validar que el ID sea un número
    if (isNaN(id) || !Number.isInteger(Number(id))) {
      return res.status(400).json({
        message: "El ID debe ser un número entero válido",
        error: "ID inválido"
      });
    }

    try {
      const entidad = await EntidadService.getById(Number(id));
      if (!entidad) {
        return res.status(404).json({
          message: `No se encontró la entidad con ID: ${id}`,
          error: "Entidad no encontrada"
        });
      }
      return res.status(200).json({
        message: "Entidad encontrada exitosamente",
        data: entidad
      });
    } catch (error) {
      console.error("Error al obtener la entidad:", error);
      return res.status(500).json({
        message: "Error al obtener la entidad",
        error: error.message
      });
    }
  },

  /**
   * Crear una nueva entidad
   */
  createEntidad: async (req, res) => {
    const {
      nombre,
      direccion,
      telefono,
      email,
      tipo_entidad,
      activo,
      codigo_reo,
      codigo_nit,
      cuenta_bancaria
    } = req.body;
    const errors = [];

    // Validar campos requeridos
    if (!nombre || !direccion || !telefono || !email || !tipo_entidad) {
      errors.push("Todos los campos son obligatorios: nombre, direccion, telefono, email, tipo_entidad");
    }

    // Validar formato del nombre
    if (nombre) {
      if (nombre.length < 3 || nombre.length > 100) {
        errors.push("El nombre debe tener entre 3 y 100 caracteres");
      }
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,&-]+$/.test(nombre)) {
        errors.push("El nombre solo puede contener letras, números, espacios y los caracteres: ., & -");
      }
    }

    // Validar formato de la dirección
    if (direccion) {
      if (direccion.length < 5 || direccion.length > 200) {
        errors.push("La dirección debe tener entre 5 y 200 caracteres");
      }
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,#-]+$/.test(direccion)) {
        errors.push("La dirección solo puede contener letras, números, espacios y los caracteres: ., # -");
      }
    }

    // Validar formato del teléfono
    if (telefono) {
      if (!/^\+?[0-9\s-]{8,15}$/.test(telefono)) {
        errors.push("El teléfono debe tener entre 8 y 15 dígitos y puede incluir +, espacios y guiones");
      }
    }

    // Validar formato del email
    if (email) {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        errors.push("El email debe tener un formato válido (ejemplo: usuario@dominio.com)");
      }

      // Verificar si el email ya existe
      try {
        const emailExists = await EntidadService.emailExists(email);
        if (emailExists) {
          return res.status(400).json({
            message: "Ya existe una entidad con ese email",
            error: "Email duplicado"
          });
        }
      } catch (error) {
        console.error("Error al verificar el email:", error);
        return res.status(500).json({
          message: "Error al crear la entidad",
          error: error.message
        });
      }
    }

    // Validar campo activo (opcional)
    if (activo !== undefined && typeof activo !== 'boolean') {
      errors.push("El campo activo debe ser un valor booleano (true/false)");
    }

    // Validar código REO (opcional)
    if (codigo_reo) {
      if (!/^[A-Z0-9]{6,10}$/.test(codigo_reo)) {
        errors.push("El código REO debe tener entre 6 y 10 caracteres alfanuméricos en mayúsculas");
      }
    }

    // Validar cuenta bancaria (opcional)
    if (cuenta_bancaria) {
      if (!/^[0-9-]{10,20}$/.test(cuenta_bancaria)) {
        errors.push("La cuenta bancaria debe tener entre 10 y 20 dígitos y puede incluir guiones");
      }
    }

    // Si hay errores de validación, retornarlos todos juntos
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Errores de validación",
        errors: errors
      });
    }

    const entidadData = {
      nombre,
      direccion,
      telefono,
      email,
      tipo_entidad,
      activo: activo !== undefined ? activo : true,
      codigo_reo: codigo_reo || "",
      codigo_nit: codigo_nit || "",
      cuenta_bancaria: cuenta_bancaria || ""
    };

    try {
      const newEntidad = await EntidadService.create(entidadData);
      return res.status(201).json({
        message: "Entidad creada exitosamente",
        data: newEntidad
      });
    } catch (error) {
      console.error("Error al crear la entidad:", error);
      return res.status(500).json({
        message: "Error al crear la entidad",
        error: error.message
      });
    }
  },

  /**
   * Actualizar una entidad existente
   */
  updateEntidad: async (req, res) => {
    const { id } = req.params;
    const {
      nombre,
      direccion,
      telefono,
      email,
      tipo_entidad,
      activo,
      codigo_reo,
      codigo_nit,
      cuenta_bancaria
    } = req.body;
    const errors = [];

    // Validar que el ID sea un número
    if (isNaN(id) || !Number.isInteger(Number(id))) {
      return res.status(400).json({
        message: "El ID debe ser un número entero válido",
        error: "ID inválido"
      });
    }

    // Validar campos requeridos
    if (!nombre || !direccion || !telefono || !email || !tipo_entidad) {
      errors.push("Todos los campos son obligatorios: nombre, direccion, telefono, email, tipo_entidad");
    }

    // Validar formato del nombre
    if (nombre) {
      if (nombre.length < 3 || nombre.length > 100) {
        errors.push("El nombre debe tener entre 3 y 100 caracteres");
      }
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,&-]+$/.test(nombre)) {
        errors.push("El nombre solo puede contener letras, números, espacios y los caracteres: ., & -");
      }
    }

    // Validar formato de la dirección
    if (direccion) {
      if (direccion.length < 5 || direccion.length > 200) {
        errors.push("La dirección debe tener entre 5 y 200 caracteres");
      }
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,#-]+$/.test(direccion)) {
        errors.push("La dirección solo puede contener letras, números, espacios y los caracteres: ., # -");
      }
    }

    // Validar formato del teléfono
    if (telefono) {
      if (!/^\+?[0-9\s-]{8,15}$/.test(telefono)) {
        errors.push("El teléfono debe tener entre 8 y 15 dígitos y puede incluir +, espacios y guiones");
      }
    }

    // Validar formato del email
    if (email) {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        errors.push("El email debe tener un formato válido (ejemplo: usuario@dominio.com)");
      }
    }

    // Validar campo activo (opcional)
    if (activo !== undefined && typeof activo !== 'boolean') {
      errors.push("El campo activo debe ser un valor booleano (true/false)");
    }

    // Validar código REO (opcional)
    if (codigo_reo) {
      if (!/^[A-Z0-9]{6,10}$/.test(codigo_reo)) {
        errors.push("El código REO debe tener entre 6 y 10 caracteres alfanuméricos en mayúsculas");
      }
    }

    // Validar cuenta bancaria (opcional)
    if (cuenta_bancaria) {
      if (!/^[0-9-]{10,20}$/.test(cuenta_bancaria)) {
        errors.push("La cuenta bancaria debe tener entre 10 y 20 dígitos y puede incluir guiones");
      }
    }

    // Si hay errores de validación, retornarlos todos juntos
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Errores de validación",
        errors: errors
      });
    }

    try {
      const entidad = await EntidadService.getById(Number(id));
      if (!entidad) {
        return res.status(404).json({
          message: `No se encontró la entidad con ID: ${id}`,
          error: "Entidad no encontrada"
        });
      }

      // Verificar si el nuevo email ya existe en otra entidad
      if (email && email !== entidad.email) {
        const emailExists = await EntidadService.emailExists(email, Number(id));
        if (emailExists) {
          return res.status(400).json({
            message: "Ya existe una entidad con ese email",
            error: "Email duplicado"
          });
        }
      }

      const entidadData = {
        nombre,
        direccion,
        telefono,
        email,
        tipo_entidad,
        activo: activo !== undefined ? activo : entidad.activo,
        codigo_reo: codigo_reo || entidad.codigo_reo,
        codigo_nit: codigo_nit || entidad.codigo_nit,
        cuenta_bancaria: cuenta_bancaria || entidad.cuenta_bancaria
      };

      const updatedEntidad = await EntidadService.update(Number(id), entidadData);
      return res.status(200).json({
        message: "Entidad actualizada exitosamente",
        data: updatedEntidad
      });
    } catch (error) {
      console.error("Error al actualizar la entidad:", error);
      return res.status(500).json({
        message: "Error al actualizar la entidad",
        error: error.message
      });
    }
  },

  /**
   * Elimina una entidad
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  deleteEntidad: async (req, res) => {
    const { id } = req.params;

    // Validar que el ID sea un número
    if (isNaN(id) || !Number.isInteger(Number(id))) {
      return res.status(400).json({
        message: "El ID debe ser un número entero válido",
        error: "ID inválido"
      });
    }

    try {
      const entidad = await EntidadService.getById(Number(id));
      if (!entidad) {
        return res.status(404).json({
          message: `No se encontró la entidad con ID: ${id}`,
          error: "Entidad no encontrada"
        });
      }

      await EntidadService.delete(Number(id));
      return res.status(200).json({
        message: "Entidad eliminada exitosamente"
      });
    } catch (error) {
      console.error("Error al eliminar la entidad:", error);
      return res.status(500).json({
        message: "Error al eliminar la entidad",
        error: error.message
      });
    }
  },

  /**
   * Filtrar entidades por múltiples criterios
   */
  filterEntidades: async (req, res) => {
    const {
      nombre,
      direccion,
      telefono,
      cuenta_bancaria,
      tipo_entidad,
      codigo_reo,
      codigo_nit
    } = req.body;

    const { page, limit } = req.params;

    // Validar parámetros de paginación
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    if (isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({
        message: "El número de página debe ser un número entero positivo",
        error: "PAGE_INVALID"
      });
    }

    if (isNaN(limitNumber) || limitNumber < 1) {
      return res.status(400).json({
        message: "El límite debe ser un número entre positivo",
        error: "LIMIT_INVALID"
      });
    }

    // Crear objeto de filtros solo con los campos que se proporcionaron
    const filters = {};
    if (nombre) filters.nombre = nombre;
    if (direccion) filters.direccion = direccion;
    if (telefono) filters.telefono = telefono;
    if (cuenta_bancaria) filters.cuenta_bancaria = cuenta_bancaria;
    if (tipo_entidad) filters.tipo_entidad = tipo_entidad;
    if (codigo_reo) filters.codigo_reo = codigo_reo;
    if (codigo_nit) filters.codigo_nit = codigo_nit;

    try {
      const { entidades, pagination } = await EntidadService.filterEntidades(filters, pageNumber, limitNumber);
      return res.status(200).json({
        message: "Entidades filtradas exitosamente",
        data: entidades,
        pagination
      });
    } catch (error) {
      console.error("Error al filtrar entidades:", error);
      return res.status(500).json({
        message: "Error al filtrar entidades",
        error: error.message
      });
    }
  },
};

module.exports = EntidadController; 