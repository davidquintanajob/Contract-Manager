/* eslint-env jest */
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

const { Sequelize } = require('sequelize');
const sequelize = require('../../helpers/database');
const EntidadService = require('../../services/entidadService');

/*
Integration test: ejecuta operaciones reales contra la BD dentro de una transacción.
- beforeEach: abre una transacción nueva.
- dentro del test: todas las operaciones de servicio reciben `{ transaction }`.
- afterEach: hacemos `rollback()` para que la BD quede exactamente igual que antes.

Esto permite verificar las validaciones y constraints reales sin alterar datos de producción.
*/
describe('Integración Entidad (DB) - transacciones con rollback', () => {
  let transaction;

  beforeAll(async () => {
    // Asegurar que la conexión a la BD está inicializada
    await sequelize.authenticate();
  });

  beforeEach(async () => {
    // Abrimos una transacción para aislar los cambios
    transaction = await sequelize.transaction();
    // Exponemos la transacción globalmente para que el middleware de la app la inyecte en req.transaction
    global.__TEST_TRANSACTION__ = transaction;
  });

  afterEach(async () => {
    // Deshacemos cualquier cambio hecho dentro de la transacción
    if (transaction) await transaction.rollback();
    // Limpiar la variable global para evitar fugas entre tests
    delete global.__TEST_TRANSACTION__;
  });

  test('create, update, delete vía HTTP (controlador -> servicio -> BD) dentro de una transacción y rollback', async () => {
    // Datos de prueba inline. Se usan valores únicos para evitar colisiones.
    const entidadData = {
      nombre: `Test Entidad ${Date.now()}`,
      direccion: 'Calle Test 123',
      telefono: '+1234567890',
      tipo_entidad: 'cliente'
    };

    // 1) Crear entidad vía endpoint HTTP. El middleware inyectará `req.transaction` desde global.__TEST_TRANSACTION__
    const request = require('supertest');
    const app = require('../../app');

    const resCreate = await request(app)
      .post('/entidad/CreateEntidad')
      .send(entidadData)
      .set('Accept', 'application/json');

    expect(resCreate.statusCode).toBe(201);
    const created = resCreate.body.data;
    expect(created).toHaveProperty('id_entidad');

    // 2) Actualizar la entidad vía endpoint HTTP (usa la misma transacción)
    const resUpdate = await request(app)
      .put(`/entidad/UpdateEntidad/${created.id_entidad}`)
      .send({ nombre: entidadData.nombre + ' Mod' })
      .set('Accept', 'application/json');

    expect(resUpdate.statusCode).toBe(200);

    // 3) Eliminar vía endpoint HTTP dentro de la transacción
    const resDelete = await request(app)
      .delete(`/entidad/deleteEntidad/${created.id_entidad}`)
      .set('Accept', 'application/json');

    expect(resDelete.statusCode).toBe(200);

    // NOTA: no hacemos commit; afterEach hará rollback y la BD queda intacta
  }, 20000);
});
