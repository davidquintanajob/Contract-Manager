const express = require("express");
const router = express.Router();
const trabajadorAutorizadoController = require("../controllers/trabajadorAutorizadoController.js");

/**
 * @swagger
 * tags:
 *   name: TrabajadorAutorizado
 *   description: API para la gestión de trabajadores autorizados
 */

/**
 * @swagger
 * /api/trabajadores-autorizados:
 *   get:
 *     summary: Obtiene todos los trabajadores autorizados
 *     tags:
 *       - TrabajadorAutorizado
 *     responses:
 *       200:
 *         description: Lista de trabajadores autorizados obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: Error del servidor
 */
router.get("/api/trabajadores-autorizados", trabajadorAutorizadoController.getAllTrabajadoresAutorizados);

/**
 * @swagger
 * /api/trabajadores-autorizados/{id}:
 *   get:
 *     summary: Obtiene un trabajador autorizado por ID
 *     tags:
 *       - TrabajadorAutorizado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del trabajador autorizado a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trabajador autorizado obtenido exitosamente
 *         content:
 *           application/json:
 *       404:
 *         description: Trabajador autorizado no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/api/trabajadores-autorizados/:id", trabajadorAutorizadoController.getTrabajadorAutorizadoById);

/**
 * @swagger
 * /api/trabajadores-autorizados:
 *   post:
 *     summary: Crea un nuevo trabajador autorizado
 *     tags:
 *       - TrabajadorAutorizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id_usuario: 1
 *             id_entidad: 1
 *             cargo_puesto: "Desarrollador"
 *             fecha_contratacion: "2023-01-15"
 *             activo: true
 *     responses:
 *       201:
 *         description: Trabajador autorizado creado exitosamente
 *         content:
 *           application/json:
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post("/api/trabajadores-autorizados", trabajadorAutorizadoController.createTrabajadorAutorizado);

/**
 * @swagger
 * /api/trabajadores-autorizados/{id}:
 *   put:
 *     summary: Actualiza un trabajador autorizado existente
 *     tags:
 *       - TrabajadorAutorizado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del trabajador autorizado a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id_usuario: 1
 *             id_entidad: 1
 *             cargo_puesto: "Desarrollador Senior"
 *             fecha_contratacion: "2023-01-15"
 *             activo: false
 *     responses:
 *       200:
 *         description: Trabajador autorizado actualizado exitosamente
 *         content:
 *           application/json:
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Trabajador autorizado no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put("/api/trabajadores-autorizados/:id", trabajadorAutorizadoController.updateTrabajadorAutorizado);

/**
 * @swagger
 * /api/trabajadores-autorizados/{id}:
 *   delete:
 *     summary: Elimina un trabajador autorizado
 *     tags:
 *       - TrabajadorAutorizado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del trabajador autorizado a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Trabajador autorizado eliminado exitosamente
 *       404:
 *         description: Trabajador autorizado no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/api/trabajadores-autorizados/:id", trabajadorAutorizadoController.deleteTrabajadorAutorizado);

module.exports = router; 