const express = require("express");
const router = express.Router();
const contratoController = require("../controllers/contratoController.js");

/**
 * @swagger
 * tags:
 *   name: Contrato
 *   description: API para la gestión de contratos
 */

/**
 * @swagger
 * /api/contratos:
 *   get:
 *     summary: Obtiene todos los contratos
 *     tags:
 *       - Contrato
 *     responses:
 *       200:
 *         description: Lista de contratos obtenida exitosamente
 *         content:
 *           application/json:
 *       500:
 *         description: Error del servidor
 */
router.get("/api/contratos", contratoController.getAllContratos);

/**
 * @swagger
 * /api/contratos/{id}:
 *   get:
 *     summary: Obtiene un contrato por ID
 *     tags:
 *       - Contrato
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del contrato a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contrato obtenido exitosamente
 *         content:
 *           application/json:
 *       404:
 *         description: Contrato no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/api/contratos/:id", contratoController.getContratoById);

/**
 * @swagger
 * /api/contratos:
 *   post:
 *     summary: Crea un nuevo contrato
 *     tags:
 *       - Contrato
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id_tipo_contrato: 102
 *             id_entidad: 202
 *             fecha_inicio: "2023-02-01"
 *             fecha_fin: "2024-02-01"
 *             salario: 32000.00
 *             activo: true
 *     responses:
 *       201:
 *         description: Contrato creado exitosamente
 *         content:
 *           application/json:
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post("/api/contratos", contratoController.createContrato);

/**
 * @swagger
 * /api/contratos/{id}:
 *   put:
 *     summary: Actualiza un contrato existente
 *     tags:
 *       - Contrato
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del contrato a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id_tipo_contrato: 102
 *             id_entidad: 202
 *             fecha_inicio: "2023-02-01"
 *             fecha_fin: "2024-02-01"
 *             salario: 32000.00
 *             activo: true
 *     responses:
 *       200:
 *         description: Contrato actualizado exitosamente
 *         content:
 *           application/json:
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Contrato no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put("/api/contratos/:id", contratoController.updateContrato);

/**
 * @swagger
 * /api/contratos/{id}:
 *   delete:
 *     summary: Elimina un contrato
 *     tags:
 *       - Contrato
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del contrato a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Contrato eliminado exitosamente
 *       404:
 *         description: Contrato no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/api/contratos/:id", contratoController.deleteContrato);

module.exports = router; 