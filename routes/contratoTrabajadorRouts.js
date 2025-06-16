const express = require("express");
const router = express.Router();
const contratoTrabajadorController = require("../controllers/contratoTrabajadorController.js");

/**
 * @swagger
 * tags:
 *   name: ContratoTrabajador
 *   description: API para la gestión de la relación Contrato-Trabajador
 */

/**
 * @swagger
 * /contratoTrabajador:
 *   get:
 *     summary: Obtiene todas las relaciones Contrato-Trabajador
 *     tags:
 *       - ContratoTrabajador
 *     responses:
 *       200:
 *         description: Lista de relaciones Contrato-Trabajador obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - id_contrato_trabajador: 1
 *                 id_contrato: 2
 *                 id_trabajador_autorizado: 3
 *                 createdAt: "2024-03-20T10:00:00.000Z"
 *                 updatedAt: "2024-03-20T10:00:00.000Z"
 *               - id_contrato_trabajador: 2
 *                 id_contrato: 3
 *                 id_trabajador_autorizado: 4
 *                 createdAt: "2024-03-21T11:00:00.000Z"
 *                 updatedAt: "2024-03-21T11:00:00.000Z"
 *       500:
 *         description: Error del servidor
 */
router.get("/contratoTrabajador", contratoTrabajadorController.getAllContratoTrabajadores);

/**
 * @swagger
 * /contratoTrabajador/{id}:
 *   get:
 *     summary: Obtiene una relación Contrato-Trabajador por ID
 *     tags:
 *       - ContratoTrabajador
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la relación Contrato-Trabajador a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relación Contrato-Trabajador obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               id_contrato_trabajador: 1
 *               id_contrato: 2
 *               id_trabajador_autorizado: 3
 *               createdAt: "2024-03-20T10:00:00.000Z"
 *               updatedAt: "2024-03-20T10:00:00.000Z"
 *       404:
 *         description: Relación Contrato-Trabajador no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/contratoTrabajador/:id", contratoTrabajadorController.getContratoTrabajadorById);

/**
 * @swagger
 * /contratoTrabajador/CreateContratoTrabajador:
 *   post:
 *     summary: Crea una nueva relación Contrato-Trabajador
 *     tags:
 *       - ContratoTrabajador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_contrato
 *               - id_trabajador_autorizado
 *             properties:
 *               id_contrato:
 *                 type: integer
 *                 description: ID del contrato
 *                 example: 2
 *               id_trabajador_autorizado:
 *                 type: integer
 *                 description: ID del trabajador autorizado
 *                 example: 3
 *           example:
 *             id_contrato: 2
 *             id_trabajador_autorizado: 3
 *     responses:
 *       201:
 *         description: Relación Contrato-Trabajador creada exitosamente
 *         content:
 *           application/json:
 *             example:
 *               id_contrato_trabajador: 1
 *               id_contrato: 2
 *               id_trabajador_autorizado: 3
 *               createdAt: "2024-03-20T10:00:00.000Z"
 *               updatedAt: "2024-03-20T10:00:00.000Z"
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post("/contratoTrabajador/CreateContratoTrabajador", contratoTrabajadorController.createContratoTrabajador);

/**
 * @swagger
 * /contratoTrabajador/UpdateContratoTrabajador/{id}:
 *   put:
 *     summary: Actualiza una relación Contrato-Trabajador existente
 *     tags:
 *       - ContratoTrabajador
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la relación Contrato-Trabajador a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_contrato:
 *                 type: integer
 *                 description: ID del contrato
 *                 example: 2
 *               id_trabajador_autorizado:
 *                 type: integer
 *                 description: ID del trabajador autorizado
 *                 example: 3
 *           example:
 *             id_contrato: 2
 *             id_trabajador_autorizado: 3
 *     responses:
 *       200:
 *         description: Relación Contrato-Trabajador actualizada exitosamente
 *         content:
 *           application/json:
 *             example:
 *               id_contrato_trabajador: 1
 *               id_contrato: 2
 *               id_trabajador_autorizado: 3
 *               createdAt: "2024-03-20T10:00:00.000Z"
 *               updatedAt: "2024-03-20T10:00:00.000Z"
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Relación Contrato-Trabajador no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put("/contratoTrabajador/UpdateContratoTrabajador/:id", contratoTrabajadorController.updateContratoTrabajador);

/**
 * @swagger
 * /contratoTrabajador/DeleteContratoTrabajador{id}:
 *   delete:
 *     summary: Elimina una relación Contrato-Trabajador
 *     tags:
 *       - ContratoTrabajador
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la relación Contrato-Trabajador a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Relación Contrato-Trabajador eliminada exitosamente
 *       404:
 *         description: Relación Contrato-Trabajador no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete("/contratoTrabajador/DeleteContratoTrabajador:id", contratoTrabajadorController.deleteContratoTrabajador);

module.exports = router; 