/* eslint-env jest */
/* global process */
// Unit tests para endpoints de `entidad`.
// - Estos tests usan `jest.mock` para mockear `EntidadService`.
// - Se prueban los controladores y las respuestas HTTP aisladas del acceso real a la BD.
// - Los datos de prueba (payloads) están definidos inline en cada test.
// Asegurar entorno de test y desactivar autenticación en helpers/authenticate
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.ENVIRONMENT = 'development';

const request = require('supertest');
const app = require('../app');

// Mockeamos el servicio para controlar las respuestas y simular distintos escenarios
jest.mock('../services/entidadService');
const EntidadService = require('../services/entidadService');

describe('Rutas Entidad', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('POST /entidad/CreateEntidad', () => {
        // Pruebas para la creación de entidades
        test('crea una entidad válida y responde 201', async () => {
            // Payload de ejemplo usado en esta prueba
            const payload = {
                nombre: 'Empresa Test',
                direccion: 'Calle 123',
                telefono: '+12345678',
                tipo_entidad: 'cliente'
            };

            // Configuramos el mock del servicio para que devuelva la entidad creada
            EntidadService.create.mockResolvedValue({ id_entidad: 1, ...payload });

            const res = await request(app)
                .post('/entidad/CreateEntidad')
                .send(payload)
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'Entidad creada exitosamente');
            expect(res.body.data).toMatchObject({ id_entidad: 1, nombre: 'Empresa Test' });
            // El servicio ahora puede recibir un segundo parámetro `options` (transacción). Nos limitamos a comprobar el primer arg.
            expect(EntidadService.create).toHaveBeenCalled();
            expect(EntidadService.create.mock.calls[0][0]).toEqual(expect.objectContaining({ nombre: 'Empresa Test' }));
        });

        test('retorna 400 cuando faltan campos obligatorios', async () => {
            // Enviamos un payload inválido (nombre vacío) y esperamos 400
            const payload = { nombre: '' };

            const res = await request(app)
                .post('/entidad/CreateEntidad')
                .send(payload)
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Errores de validación');
        });

        test('retorna 400 si email tiene formato inválido', async () => {
            const payload = { nombre: 'X', direccion: 'Calle', telefono: '12345678', tipo_entidad: 'cliente', email: 'bad-email' };
            const res = await request(app)
                .post('/entidad/CreateEntidad')
                .send(payload)
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Errores de validación');
        });

        test('retorna 400 si cuenta bancaria inválida', async () => {
            const payload = { nombre: 'EmpresaBC', direccion: 'Calle', telefono: '12345678', tipo_entidad: 'cliente', cuenta_bancaria: 'abc' };
            const res = await request(app)
                .post('/entidad/CreateEntidad')
                .send(payload)
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Errores de validación');
        });

        test('retorna 500 si el servicio lanza un error (nombre duplicado)', async () => {
            const payload = { nombre: 'Duplicada', direccion: 'Calle', telefono: '12345678', tipo_entidad: 'cliente' };
            EntidadService.create.mockRejectedValueOnce(new Error('Ya existe una entidad con ese nombre'));

            const res = await request(app)
                .post('/entidad/CreateEntidad')
                .send(payload)
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('PUT /entidad/UpdateEntidad/:id', () => {
        // Pruebas para la actualización de entidades
        test('actualiza una entidad existente y responde 200', async () => {
            const id = 1;
            const payload = { nombre: 'Empresa Actualizada' };

            EntidadService.getById.mockResolvedValue({ id_entidad: id, nombre: 'Old' });
            EntidadService.update.mockResolvedValue({ id_entidad: id, nombre: payload.nombre });

            const res = await request(app)
                .put(`/entidad/UpdateEntidad/${id}`)
                .send(payload)
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Entidad actualizada exitosamente');
            expect(res.body.data).toMatchObject({ id_entidad: id, nombre: payload.nombre });
        });

        // Asegura que si el servicio no encuentra la entidad, el controlador devuelve 404
        test('retorna 404 si la entidad no existe', async () => {
            const id = 999;
            EntidadService.getById.mockResolvedValue(null);

            const res = await request(app)
                .put(`/entidad/UpdateEntidad/${id}`)
                .send({ nombre: 'Nombre Valido' })
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message');
        });

        test('retorna 400 si el id no es un número entero', async () => {
            const res = await request(app)
                .put('/entidad/UpdateEntidad/abc')
                .send({ nombre: 'Nombre Valido' })
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
        });

        test('retorna 400 si email inválido al actualizar', async () => {
            const id = 1;
            EntidadService.getById.mockResolvedValue({ id_entidad: id, nombre: 'Old' });
            const res = await request(app)
                .put(`/entidad/UpdateEntidad/${id}`)
                .send({ email: 'nope' })
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Errores de validación');
        });

        test('retorna 500 si el servicio update lanza error', async () => {
            const id = 2;
            EntidadService.getById.mockResolvedValue({ id_entidad: id, nombre: 'Old' });
            EntidadService.update.mockRejectedValueOnce(new Error('DB error'));

            const res = await request(app)
                .put(`/entidad/UpdateEntidad/${id}`)
                .send({ nombre: 'Nuevo' })
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('DELETE /entidad/deleteEntidad/:id', () => {
        // Pruebas para eliminar una entidad
        test('elimina una entidad sin contratos y responde 200', async () => {
            const id = 2;
            EntidadService.getById.mockResolvedValue({ id_entidad: id, contratos: [] });
            EntidadService.delete.mockResolvedValue(true);

            const res = await request(app)
                .delete(`/entidad/deleteEntidad/${id}`)
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Entidad eliminada exitosamente');
        });

        test('retorna 400 si la entidad tiene contratos asociados', async () => {
            // Simulamos que la entidad tiene contratos relacionados y esperamos 400
            const id = 3;
            EntidadService.getById.mockResolvedValue({ id_entidad: id, contratos: [{ id_contrato: 1 }] });

            const res = await request(app)
                .delete(`/entidad/deleteEntidad/${id}`)
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('relaciones');
        });

        test('retorna 400 si id no es entero en delete', async () => {
            const res = await request(app)
                .delete('/entidad/deleteEntidad/abc')
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
        });

        test('retorna 500 si el servicio delete lanza error', async () => {
            const id = 4;
            EntidadService.getById.mockResolvedValue({ id_entidad: id, contratos: [] });
            EntidadService.delete.mockRejectedValueOnce(new Error('DB delete error'));

            const res = await request(app)
                .delete(`/entidad/deleteEntidad/${id}`)
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('message');
        });

        test('retorna 404 si no existe al eliminar (getById null)', async () => {
            EntidadService.getById.mockResolvedValue(null);

            const res = await request(app)
                .delete('/entidad/deleteEntidad/9999')
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(404);
        });
    });

    describe('POST /entidad/filter/:page/:limit', () => {
        // Pruebas para el endpoint de filtrado con paginación
        test('filtra entidades y responde 200 con paginación', async () => {
            const page = 1;
            const limit = 10;
            const filters = { nombre: 'Emp' };

            EntidadService.filterEntidades.mockResolvedValue({ entidades: [{ id_entidad: 1, nombre: 'Empresa' }], pagination: { total: 1, page, limit, totalPages: 1 } });

            const res = await request(app)
                .post(`/entidad/filter/${page}/${limit}`)
                .send(filters)
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.pagination).toMatchObject({ total: 1, page, limit });
        });

        // Validación de parámetros de paginación
        test('retorna 400 si page o limit inválidos', async () => {
            const res = await request(app)
                .post('/entidad/filter/0/10')
                .send({})
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error', 'PAGE_INVALID');
        });

        test('retorna 400 si limit inválido', async () => {
            const res = await request(app)
                .post('/entidad/filter/1/0')
                .send({})
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error', 'LIMIT_INVALID');
        });

        test('filter devuelve vacio si no hay coincidencias', async () => {
            EntidadService.filterEntidades.mockResolvedValue({ entidades: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } });
            const res = await request(app)
                .post('/entidad/filter/1/10')
                .send({ nombre: 'no-match' })
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveLength(0);
        });

        test('retorna 500 si service.filter lanza error', async () => {
            EntidadService.filterEntidades.mockRejectedValueOnce(new Error('filter error'));
            const res = await request(app)
                .post('/entidad/filter/1/10')
                .send({})
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('GET endpoints', () => {
        // Pruebas para GET /entidad y GET /entidad/:id
        test('GET /entidad devuelve lista (200)', async () => {
            const entidadesMock = [{ id_entidad: 1, nombre: 'E1' }, { id_entidad: 2, nombre: 'E2' }];
            EntidadService.getAll.mockResolvedValue(entidadesMock);

            const res = await request(app)
                .get('/entidad')
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveLength(2);
        });

        test('GET /entidad/:id devuelve entidad (200)', async () => {
            const entidad = { id_entidad: 5, nombre: 'Entidad5' };
            EntidadService.getById.mockResolvedValue(entidad);

            const res = await request(app)
                .get('/entidad/5')
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toMatchObject({ id_entidad: 5, nombre: 'Entidad5' });
        });

        test('GET /entidad/:id no existe (404)', async () => {
            EntidadService.getById.mockResolvedValue(null);

            const res = await request(app)
                .get('/entidad/9999')
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error');
        });
    });
});
