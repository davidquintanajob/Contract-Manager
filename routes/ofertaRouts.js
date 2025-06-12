const express = require("express");
const router = express.Router();
const ofertaController = require("../controllers/ofertaController.js");

/**
 * @swagger
 * tags:
 *   name: Oferta
 *   description: API para la gestión de ofertas
 */

/**
 * @swagger
 * /api/ofertas:
 *   get:
 *     summary: Obtiene todas las ofertas
 *     tags:
 *       - Oferta
 *     responses:
 *       200:
 *         description: Lista de ofertas obtenida exitosamente
 *         content:
 *           application/json:
 *       500:
 *         description: Error del servidor
 */
router.get("/api/ofertas", ofertaController.getAllOfertas);

/**
 * @swagger
 * /api/ofertas/{id}:
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
 *       404:
 *         description: Oferta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/api/ofertas/:id", ofertaController.getOfertaById);

/**
 * @swagger
 * /api/ofertas:
 *   post:
 *     summary: Crea una nueva oferta
 *     tags:
 *       - Oferta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             titulo: "Desarrollador Full Stack"
 *             descripcion: "Se busca desarrollador con experiencia en Node.js y React."
 *             salario: 45000.00
 *             fecha_publicacion: "2023-10-26"
 *             fecha_cierre: "2023-11-26"
 *             activa: true
 *     responses:
 *       201:
 *         description: Oferta creada exitosamente
 *         content:
 *           application/json:
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post("/api/ofertas", ofertaController.createOferta);

/**
 * @swagger
 * /api/ofertas/{id}:
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
 *           example:
 *             titulo: "Desarrollador Backend Senior"
 *             descripcion: "Actualización: Más énfasis en microservicios."
 *             salario: 50000.00
 *             fecha_publicacion: "2023-10-26"
 *             fecha_cierre: "2023-12-26"
 *             activa: false
 *     responses:
 *       200:
 *         description: Oferta actualizada exitosamente
 *         content:
 *           application/json:
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Oferta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put("/api/ofertas/:id", ofertaController.updateOferta);

/**
 * @swagger
 * /api/ofertas/{id}:
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
router.delete("/api/ofertas/:id", ofertaController.deleteOferta);

module.exports = router; 