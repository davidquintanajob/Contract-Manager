const express = require("express");
const router = express.Router();
const entidadController = require("../controllers/entidadController.js");

/**
 * @swagger
 * tags:
 *   name: Entidad
 *   description: API para la gestión de entidades
 */

/**
 * @swagger
 * /api/entidades:
 *   get:
 *     summary: Obtiene todas las entidades
 *     tags:
 *       - Entidad
 *     responses:
 *       200:
 *         description: Lista de entidades obtenida exitosamente
 *         content:
 *           application/json:
 *       500:
 *         description: Error del servidor
 */
router.get("/api/entidades", entidadController.getAllEntidades);

/**
 * @swagger
 * /api/entidades/{id}:
 *   get:
 *     summary: Obtiene una entidad por ID
 *     tags:
 *       - Entidad
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la entidad a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entidad obtenida exitosamente
 *         content:
 *           application/json:
 *       404:
 *         description: Entidad no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/api/entidades/:id", entidadController.getEntidadById);

/**
 * @swagger
 * /api/entidades:
 *   post:
 *     summary: Crea una nueva entidad
 *     tags:
 *       - Entidad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: "Nueva Empresa Ltda."
 *             tipo: "proveedor"
 *             direccion: "Avenida Siempre Viva 742"
 *             telefono: "987-654-3210"
 *             email: "info@nuevaempresa.com"
 *     responses:
 *       201:
 *         description: Entidad creada exitosamente
 *         content:
 *           application/json:
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post("/api/entidades", entidadController.createEntidad);

/**
 * @swagger
 * /api/entidades/{id}:
 *   put:
 *     summary: Actualiza una entidad existente
 *     tags:
 *       - Entidad
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la entidad a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: "Nombre Actualizado Entidad"
 *             tipo: "cliente"
 *             direccion: "Nueva Calle 456"
 *             telefono: "111-222-3333"
 *             email: "contacto_act@ejemplo.com"
 *     responses:
 *       200:
 *         description: Entidad actualizada exitosamente
 *         content:
 *           application/json:
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Entidad no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put("/api/entidades/:id", entidadController.updateEntidad);

/**
 * @swagger
 * /api/entidades/{id}:
 *   delete:
 *     summary: Elimina una entidad
 *     tags:
 *       - Entidad
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la entidad a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Entidad eliminada exitosamente
 *       404:
 *         description: Entidad no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete("/api/entidades/:id", entidadController.deleteEntidad);

module.exports = router; 