const express = require("express");
const router = express.Router();
const entidadController = require("../controllers/entidadController.js");
const authenticate = require("../helpers/authenticate");

/**
 * @swagger
 * tags:
 *   name: Entidad
 *   description: API para la gestión de entidades
 */

/**
 * @swagger
 * /entidad:
 *   get:
 *     summary: Obtiene todas las entidades
 *     tags:
 *       - Entidad
 *     responses:
 *       200:
 *         description: Lista de entidades obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_entidad:
 *                     type: integer
 *                     description: ID de la entidad
 *                   nombre:
 *                     type: string
 *                     description: Nombre de la entidad
 *                   direccion:
 *                     type: string
 *                     description: Dirección de la entidad
 *                   telefono:
 *                     type: string
 *                     description: Número de teléfono
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: Correo electrónico
 *                   cuenta_bancaria:
 *                     type: string
 *                     description: Número de cuenta bancaria
 *                   tipo_entidad:
 *                     type: string
 *                     description: Tipo de entidad (cliente, proveedor, etc.)
 *                   codigo_reo:
 *                     type: string
 *                     description: Código REO de la entidad
 *                   codigo_nit:
 *                     type: string
 *                     description: Código NIT de la entidad
 *             example:
 *               - id_entidad: 1
 *                 nombre: "Empresa ABC Ltda."
 *                 direccion: "Calle Principal 123"
 *                 telefono: "123-456-7890"
 *                 email: "contacto@empresaabc.com"
 *                 cuenta_bancaria: "1234-5678-9012-3456"
 *                 tipo_entidad: "cliente"
 *                 codigo_reo: "REO123456"
 *                 codigo_nit: "NIT123456789"
 *               - id_entidad: 2
 *                 nombre: "Proveedor XYZ S.A."
 *                 direccion: "Avenida Comercial 456"
 *                 telefono: "987-654-3210"
 *                 email: "info@proveedorxyz.com"
 *                 cuenta_bancaria: "9876-5432-1098-7654"
 *                 tipo_entidad: "proveedor"
 *                 codigo_reo: "REO789012"
 *                 codigo_nit: "NIT987654321"
 *       500:
 *         description: Error del servidor
 */
router.get("/entidad",authenticate(), entidadController.getAllEntidades);

/**
 * @swagger
 * /entidad/{id}:
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
 *             schema:
 *               type: object
 *               properties:
 *                 id_entidad:
 *                   type: integer
 *                   description: ID de la entidad
 *                 nombre:
 *                   type: string
 *                   description: Nombre de la entidad
 *                 direccion:
 *                   type: string
 *                   description: Dirección de la entidad
 *                 telefono:
 *                   type: string
 *                   description: Número de teléfono
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Correo electrónico
 *                 cuenta_bancaria:
 *                   type: string
 *                   description: Número de cuenta bancaria
 *                 tipo_entidad:
 *                   type: string
 *                   description: Tipo de entidad (cliente, proveedor, etc.)
 *                 codigo_reo:
 *                   type: string
 *                   description: Código REO de la entidad
 *                 codigo_nit:
 *                   type: string
 *                   description: Código NIT de la entidad
 *             example:
 *               id_entidad: 1
 *               nombre: "Empresa ABC Ltda."
 *               direccion: "Calle Principal 123"
 *               telefono: "123-456-7890"
 *               email: "contacto@empresaabc.com"
 *               cuenta_bancaria: "1234-5678-9012-3456"
 *               tipo_entidad: "cliente"
 *               codigo_reo: "REO123456"
 *               codigo_nit: "NIT123456789"
 *       404:
 *         description: Entidad no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/entidad/:id",authenticate(), entidadController.getEntidadById);

/**
 * @swagger
 * /entidad/CreateEntidad:
 *   post:
 *     summary: Crea una nueva entidad
 *     tags:
 *       - Entidad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la entidad
 *               direccion:
 *                 type: string
 *                 description: Dirección de la entidad
 *               telefono:
 *                 type: string
 *                 description: Número de teléfono
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico
 *               cuenta_bancaria:
 *                 type: string
 *                 description: Número de cuenta bancaria
 *               tipo_entidad:
 *                 type: string
 *                 description: Tipo de entidad (cliente, proveedor, etc.)
 *               codigo_reo:
 *                 type: string
 *                 description: Código REO de la entidad
 *               codigo_nit:
 *                 type: string
 *                 description: Código NIT de la entidad
 *           example:
 *             nombre: "Nueva Empresa Ltda."
 *             direccion: "Avenida Siempre Viva 742"
 *             telefono: "987-654-3210"
 *             email: "info@nuevaempresa.com"
 *             cuenta_bancaria: "1234-5678-9012-3456"
 *             tipo_entidad: "proveedor"
 *             codigo_reo: "REO123456"
 *             codigo_nit: "NIT123456789"
 *     responses:
 *       201:
 *         description: Entidad creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_entidad:
 *                   type: integer
 *                   description: ID de la entidad creada
 *                 nombre:
 *                   type: string
 *                   description: Nombre de la entidad
 *                 direccion:
 *                   type: string
 *                   description: Dirección de la entidad
 *                 telefono:
 *                   type: string
 *                   description: Número de teléfono
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Correo electrónico
 *                 cuenta_bancaria:
 *                   type: string
 *                   description: Número de cuenta bancaria
 *                 tipo_entidad:
 *                   type: string
 *                   description: Tipo de entidad
 *                 codigo_reo:
 *                   type: string
 *                   description: Código REO de la entidad
 *                 codigo_nit:
 *                   type: string
 *                   description: Código NIT de la entidad
 *             example:
 *               id_entidad: 3
 *               nombre: "Nueva Empresa Ltda."
 *               direccion: "Avenida Siempre Viva 742"
 *               telefono: "987-654-3210"
 *               email: "info@nuevaempresa.com"
 *               cuenta_bancaria: "1234-5678-9012-3456"
 *               tipo_entidad: "proveedor"
 *               codigo_reo: "REO123456"
 *               codigo_nit: "NIT123456789"
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post("/entidad/CreateEntidad",authenticate(), entidadController.createEntidad);

/**
 * @swagger
 * /entidad/UpdateEntidad/{id}:
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
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la entidad
 *               direccion:
 *                 type: string
 *                 description: Dirección de la entidad
 *               telefono:
 *                 type: string
 *                 description: Número de teléfono
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico
 *               cuenta_bancaria:
 *                 type: string
 *                 description: Número de cuenta bancaria
 *               tipo_entidad:
 *                 type: string
 *                 description: Tipo de entidad (cliente, proveedor, etc.)
 *               codigo_reo:
 *                 type: string
 *                 description: Código REO de la entidad
 *               codigo_nit:
 *                 type: string
 *                 description: Código NIT de la entidad
 *           example:
 *             nombre: "Nombre Actualizado Entidad"
 *             direccion: "Nueva Calle 456"
 *             telefono: "111-222-3333"
 *             email: "contacto_act@ejemplo.com"
 *             cuenta_bancaria: "9876-5432-1098-7654"
 *             tipo_entidad: "cliente"
 *             codigo_reo: "REO789012"
 *             codigo_nit: "NIT987654321"
 *     responses:
 *       200:
 *         description: Entidad actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_entidad:
 *                   type: integer
 *                   description: ID de la entidad actualizada
 *                 nombre:
 *                   type: string
 *                   description: Nombre de la entidad
 *                 direccion:
 *                   type: string
 *                   description: Dirección de la entidad
 *                 telefono:
 *                   type: string
 *                   description: Número de teléfono
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Correo electrónico
 *                 cuenta_bancaria:
 *                   type: string
 *                   description: Número de cuenta bancaria
 *                 tipo_entidad:
 *                   type: string
 *                   description: Tipo de entidad
 *                 codigo_reo:
 *                   type: string
 *                   description: Código REO de la entidad
 *                 codigo_nit:
 *                   type: string
 *                   description: Código NIT de la entidad
 *             example:
 *               id_entidad: 1
 *               nombre: "Nombre Actualizado Entidad"
 *               direccion: "Nueva Calle 456"
 *               telefono: "111-222-3333"
 *               email: "contacto_act@ejemplo.com"
 *               cuenta_bancaria: "9876-5432-1098-7654"
 *               tipo_entidad: "cliente"
 *               codigo_reo: "REO789012"
 *               codigo_nit: "NIT987654321"
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Entidad no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put("/entidad/UpdateEntidad/:id",authenticate(), entidadController.updateEntidad);

/**
 * @swagger
 * /entidad/deleteEntidad/{id}:
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
router.delete("/entidad/deleteEntidad/:id",authenticate(), entidadController.deleteEntidad);

module.exports = router; 