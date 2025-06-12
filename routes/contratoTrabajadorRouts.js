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
 * /api/contratos-trabajadores:
 *   get:
 *     summary: Obtiene todas las relaciones Contrato-Trabajador
 *     tags:
 *       - ContratoTrabajador
 *     responses:
 *       200:
 *         description: Lista de relaciones Contrato-Trabajador obtenida exitosamente
 *         content:
 *           application/json:
 *       500:
 *         description: Error del servidor
 */
router.get("/api/contratos-trabajadores", contratoTrabajadorController.getAllContratoTrabajadores);

/**
 * @swagger
 * /api/contratos-trabajadores/{id}:
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
 *       404:
 *         description: Relación Contrato-Trabajador no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/api/contratos-trabajadores/:id", contratoTrabajadorController.getContratoTrabajadorById);

/**
 * @swagger
 * /api/contratos-trabajadores:
 *   post:
 *     summary: Crea una nueva relación Contrato-Trabajador
 *     tags:
 *       - ContratoTrabajador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id_contrato: 1
 *             id_trabajador: 1
 *             fecha_asociacion: "2023-01-01"
 *             activo: true
 *     responses:
 *       201:
 *         description: Relación Contrato-Trabajador creada exitosamente
 *         content:
 *           application/json:
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post("/api/contratos-trabajadores", contratoTrabajadorController.createContratoTrabajador);

/**
 * @swagger
 * /api/contratos-trabajadores/{id}:
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
 *           example:
 *             id_contrato: 1
 *             id_trabajador: 1
 *             fecha_asociacion: "2023-02-01"
 *             activo: false
 *     responses:
 *       200:
 *         description: Relación Contrato-Trabajador actualizada exitosamente
 *         content:
 *           application/json:
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Relación Contrato-Trabajador no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put("/api/contratos-trabajadores/:id", contratoTrabajadorController.updateContratoTrabajador);

/**
 * @swagger
 * /api/contratos-trabajadores/{id}:
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
router.delete("/api/contratos-trabajadores/:id", contratoTrabajadorController.deleteContratoTrabajador);

module.exports = router; 