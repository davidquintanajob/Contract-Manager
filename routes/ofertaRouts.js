const express = require("express");
const router = express.Router();
const ofertaController = require("../controllers/ofertaController.js");
const authenticate = require("../helpers/authenticate");

/**
 * @swagger
 * tags:
 *   name: Oferta
 *   description: API para la gestión de ofertas
 */

/**
 * @swagger
 * /oferta:
 *   get:
 *     summary: Obtiene todas las ofertas
 *     tags:
 *       - Oferta
 *     responses:
 *       200:
 *         description: Lista de ofertas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *             example:
 *               - id_oferta: 1
 *                 fecha_inicio: "2023-01-01"
 *                 fecha_fin: "2023-01-31"
 *                 id_contrato: 101
 *                 descripcion: "Oferta de desarrollo de software para proyecto X."
 *                 id_usuario: 50
 *               - id_oferta: 2
 *                 fecha_inicio: "2023-02-15"
 *                 fecha_fin: "2023-03-15"
 *                 id_contrato: 102
 *                 descripcion: "Oferta de consultoría de TI."
 *                 id_usuario: 51
 *       500:
 *         description: Error del servidor
 */
router.get("/oferta",authenticate(), ofertaController.getAllOfertas);


/**
 * @swagger
 * /oferta/{id}:
 *   get:
 *     summary: Obtiene una oferta por ID
 *     tags:
 *       - Oferta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la oferta a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Oferta obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               id_oferta: 1
 *               fecha_inicio: "2023-01-01"
 *               fecha_fin: "2023-01-31"
 *               id_contrato: 101
 *               descripcion: "Oferta de desarrollo de software para proyecto X."
 *               id_usuario: 50
 *       404:
 *         description: Oferta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/oferta/:id",authenticate(), ofertaController.getOfertaById);

/**
 * @swagger
 * /oferta/CreateOferta:
 *   post:
 *     summary: Crea una nueva oferta
 *     tags:
 *       - Oferta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               fecha_inicio: "YYYY-MM-DD"
 *               fecha_fin: "YYYY-MM-DD"
 *               id_contrato: 1
 *               descripcion: "Se busca desarrollador con experiencia en Node.js y React."
 *               id_usuario: 1
 *     responses:
 *       201:
 *         description: Oferta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               fecha_inicio: "YYYY-MM-DD"
 *               fecha_fin: "YYYY-MM-DD"
 *               id_contrato: 1
 *               descripcion: "Se busca desarrollador con experiencia en Node.js y React."
 *               id_usuario: 1
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post("/oferta/CreateOferta",authenticate(), ofertaController.createOferta);

/**
 * @swagger
 * /oferta/updateOferta/{id}:
 *   put:
 *     summary: Actualiza una oferta existente
 *     tags:
 *       - Oferta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la oferta a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               fecha_inicio: "YYYY-MM-DD"
 *               fecha_fin: "YYYY-MM-DD"
 *               id_contrato: 1
 *               descripcion: "Actualización: Más énfasis en microservicios."
 *               id_usuario: 1
 *     responses:
 *       200:
 *         description: Oferta actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               fecha_inicio: "YYYY-MM-DD"
 *               fecha_fin: "YYYY-MM-DD"
 *               id_contrato: 1
 *               descripcion: "Actualización: Más énfasis en microservicios."
 *               id_usuario: 1
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Oferta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put("/oferta/updateOferta/:id",authenticate(), ofertaController.updateOferta);

/**
 * @swagger
 * /oferta/deleteOferta/{id}:
 *   delete:
 *     summary: Elimina una oferta
 *     tags:
 *       - Oferta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la oferta a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Oferta eliminada exitosamente
 *       404:
 *         description: Oferta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete("/oferta/deleteOferta/:id",authenticate(), ofertaController.deleteOferta);

/**
 * @swagger
 * /oferta/filterOfertas:
 *   get:
 *     summary: Filtra ofertas según criterios específicos
 *     tags:
 *       - Oferta
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio para filtrar (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin para filtrar (YYYY-MM-DD)
 *       - in: query
 *         name: id_contrato
 *         schema:
 *           type: integer
 *         description: ID del contrato
 *       - in: query
 *         name: id_usuario
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *       - in: query
 *         name: descripcion
 *         schema:
 *           type: string
 *         description: Texto a buscar en la descripción
 *     responses:
 *       200:
 *         description: Lista de ofertas filtradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *             example:
 *               - id_oferta: 1
 *                 fecha_inicio: "2023-01-01"
 *                 fecha_fin: "2023-01-31"
 *                 id_contrato: 101
 *                 descripcion: "Oferta de desarrollo de software para proyecto X."
 *                 id_usuario: 50
 *       500:
 *         description: Error del servidor
 */
router.get("/oferta/filterOfertas",authenticate(), ofertaController.filterOfertas);
module.exports = router; 