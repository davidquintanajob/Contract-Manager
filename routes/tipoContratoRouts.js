const express = require("express");
const router = express.Router();
const tipoContratoController = require("../controllers/tipoContratoController.js");

/**
 * @swagger
 * tags:
 *   name: TipoContrato
 *   description: API para la gestión de tipos de contrato
 */

/**
 * @swagger
 * /api/tipoContratos:
 *   get:
 *     summary: Obtiene todos los tipos de contrato
 *     tags:
 *       - TipoContrato
 *     responses:
 *       200:
 *         description: Lista de tipos de contrato obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: Error del servidor
 */
router.get("/api/tipoContratos", tipoContratoController.getAllTipoContratos);

/**
 * @swagger
 * /api/tipoContratos/{id}:
 *   get:
 *     summary: Obtiene un tipo de contrato por ID
 *     tags:
 *       - TipoContrato
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del tipo de contrato a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tipo de contrato obtenido exitosamente
 *         content:
 *           application/json:
 *       404:
 *         description: Tipo de contrato no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/api/tipoContratos/:id", tipoContratoController.getTipoContratoById);

/**
 * @swagger
 * /api/tipoContratos:
 *   post:
 *     summary: Crea un nuevo tipo de contrato
 *     tags:
 *       - TipoContrato
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: "Contrato Temporal"
 *             activo: true
 *     responses:
 *       201:
 *         description: Tipo de contrato creado exitosamente
 *         content:
 *           application/json:
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post("/api/tipoContratos", tipoContratoController.createTipoContrato);

/**
 * @swagger
 * /api/tipoContratos/{id}:
 *   put:
 *     summary: Actualiza un tipo de contrato existente
 *     tags:
 *       - TipoContrato
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del tipo de contrato a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: "Contrato Fijo Actualizado"
 *             activo: false
 *     responses:
 *       200:
 *         description: Tipo de contrato actualizado exitosamente
 *         content:
 *           application/json:
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Tipo de contrato no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put("/api/tipoContratos/:id", tipoContratoController.updateTipoContrato);

/**
 * @swagger
 * /api/tipoContratos/{id}:
 *   delete:
 *     summary: Elimina un tipo de contrato
 *     tags:
 *       - TipoContrato
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del tipo de contrato a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Tipo de contrato eliminado exitosamente
 *       404:
 *         description: Tipo de contrato no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/api/tipoContratos/:id", tipoContratoController.deleteTipoContrato);

module.exports = router; 