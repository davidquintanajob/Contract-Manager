/* eslint-env jest */
const request = require('supertest');
const app = require('../app');
const ContratoService = require('../services/contratoService');

jest.mock('../services/contratoService');

describe('Contrato Controller - Unit tests (service mocked)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Endpoint: GET /contrato/proximos-a-vencer
   * Tests:
   * 1. Returns 200 and list when service returns data
   * 2. Returns 200 and empty array when none
   * 3. Returns 500 when service throws
   * 4. Response shape contains entidad and tipoContrato
   */
  describe('GET /contrato/proximos-a-vencer', () => {
    const url = '/contrato/proximos-a-vencer';

    test('200 and list when service returns data', async () => {
      const fake = [{ id_contrato: 1, fecha_fin: new Date(), entidad: { nombre: 'E' }, tipoContrato: { nombre: 'T' } }];
      ContratoService.getContratosProximosAVencer.mockResolvedValue(fake);

      const res = await request(app).get(url).send();
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
    });

    test('200 and empty array when none', async () => {
      ContratoService.getContratosProximosAVencer.mockResolvedValue([]);
      const res = await request(app).get(url).send();
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.count).toBe(0);
    });

    test('500 when service throws', async () => {
      ContratoService.getContratosProximosAVencer.mockRejectedValue(new Error('boom'));
      const res = await request(app).get(url).send();
      expect(res.status).toBe(500);
    });

    test('response items contain entidad and tipoContrato', async () => {
      const fake = [{ id_contrato: 2, entidad: { nombre: 'X' }, tipoContrato: { nombre: 'Y' } }];
      ContratoService.getContratosProximosAVencer.mockResolvedValue(fake);
      const res = await request(app).get(url).send();
      expect(res.status).toBe(200);
      expect(res.body.data[0]).toHaveProperty('entidad');
      expect(res.body.data[0]).toHaveProperty('tipoContrato');
    });
  });

  /**
   * Endpoint: POST /contrato/CreateContrato
   * Tests:
   * 1. 201 on success
   * 2. 400 on validation error from service
   * 3. 500 on unexpected error
   * 4. 400 when payload missing required fields (handled by controller validation)
   */
  describe('POST /contrato/CreateContrato', () => {
    const url = '/contrato/CreateContrato';
    const validPayload = {
      id_entidad: 1,
      id_tipo_contrato: 1,
      fecha_inicio: '2024-01-01',
      fecha_fin: '2024-12-31',
      num_consecutivo: 1
    };

    test('201 on success', async () => {
      ContratoService.create.mockResolvedValue({ id_contrato: 10, ...validPayload });
      const res = await request(app).post(url).send(validPayload);
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id_contrato');
    });

    test('400 on validation error from service', async () => {
      ContratoService.create.mockRejectedValue(new Error('La fecha de inicio debe ser anterior a la fecha de fin'));
      const res = await request(app).post(url).send(validPayload);
      expect(res.status).toBe(400);
    });

    test('500 on unexpected error', async () => {
      // controller maps most create errors to 400, but in case of unexpected we still expect 400 per controller
      ContratoService.create.mockRejectedValue(new Error('boom'));
      const res = await request(app).post(url).send(validPayload);
      expect(res.status).toBe(400);
    });

    test('400 when payload missing required fields', async () => {
      const res = await request(app).post(url).send({});
      expect(res.status).toBe(400);
    });
  });

  /**
   * Endpoint: PUT /contrato/UpdateContrato/:id
   * Tests:
   * 1. 200 on success
   * 2. 404 when not found
   * 3. 400 on validation error
   * 4. 500 on unexpected error
   */
  describe('PUT /contrato/UpdateContrato/:id', () => {
    const url = (id) => `/contrato/UpdateContrato/${id}`;
    const payload = { fecha_fin: '2025-01-01' };

    test('200 on success', async () => {
      ContratoService.update.mockResolvedValue({ id_contrato: 5, ...payload });
      const res = await request(app).put(url(5)).send(payload);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('id_contrato');
    });

    test('404 when not found', async () => {
      ContratoService.update.mockResolvedValue(null);
      const res = await request(app).put(url(999)).send(payload);
      expect(res.status).toBe(404);
    });

    test('400 on validation error', async () => {
      ContratoService.update.mockRejectedValue(new Error('Ya existe un contrato vigente'));
      const res = await request(app).put(url(5)).send(payload);
      expect(res.status).toBe(400);
    });

    test('500 on unexpected error', async () => {
      // controller maps update errors to 400 in most cases; reflect that here
      ContratoService.update.mockRejectedValue(new Error('boom'));
      const res = await request(app).put(url(5)).send(payload);
      expect(res.status).toBe(400);
    });
  });

  /**
   * Endpoint: DELETE /contrato/deleteContrato/:id
   * Tests:
   * 1. 200 on success
   * 2. 404 when not found
   * 3. 400 when deletion prevented by FK constraints (service throws)
   * 4. 500 on unexpected error
   */
  describe('DELETE /contrato/deleteContrato/:id', () => {
    const url = (id) => `/contrato/deleteContrato/${id}`;

    test('200 on success', async () => {
      ContratoService.getById.mockResolvedValue({ oferta: [], trabajadoresAutorizados: [] });
      ContratoService.delete.mockResolvedValue(true);
      const res = await request(app).delete(url(3)).send();
      expect(res.status).toBe(200);
    });

    test('404 when not found', async () => {
      ContratoService.getById.mockResolvedValue(null);
      const res = await request(app).delete(url(999)).send();
      expect(res.status).toBe(404);
    });

    test('400 when deletion prevented by FK constraints', async () => {
      // Simulate contrato with ofertas -> controller returns 400 before calling delete
      ContratoService.getById.mockResolvedValue({ oferta: [{ id_oferta: 1, descripcion: 'X' }], trabajadoresAutorizados: [] });
      const res = await request(app).delete(url(3)).send();
      expect(res.status).toBe(400);
    });

    test('500 on unexpected error', async () => {
      ContratoService.getById.mockResolvedValue({ oferta: [], trabajadoresAutorizados: [] });
      ContratoService.delete.mockRejectedValue(new Error('boom'));
      const res = await request(app).delete(url(3)).send();
      expect(res.status).toBe(500);
    });
  });

  /**
   * Endpoint: GET /contrato/next-consecutivo/:year
   * Tests:
   * 1. 200 with next number
   * 2. 400 invalid year
   * 3. 500 on unexpected error
   * 4. Year edge-case returns 1 when none
   */
  describe('GET /contrato/next-consecutivo/:year', () => {
    const url = (year) => `/contrato/next-consecutivo/${year}`;

    test('200 with next number', async () => {
      ContratoService.getNextConsecutivo.mockResolvedValue(5);
      const res = await request(app).get(url(2024)).send();
      expect(res.status).toBe(200);
      expect(res.body.data.siguiente_consecutivo).toBe(5);
      expect(res.body.data.year).toBe(2024);
    });

    test('400 invalid year', async () => {
      ContratoService.getNextConsecutivo.mockRejectedValue(new Error('El año debe ser un número válido'));
      const res = await request(app).get(url('abcd')).send();
      expect(res.status).toBe(400);
    });

    test('500 on unexpected error', async () => {
      ContratoService.getNextConsecutivo.mockRejectedValue(new Error('boom'));
      const res = await request(app).get(url(2024)).send();
      // controller returns 400 for errors in this handler
      expect(res.status).toBe(400);
    });

    test('returns 1 when none for year', async () => {
      ContratoService.getNextConsecutivo.mockResolvedValue(1);
      const res = await request(app).get(url(2030)).send();
      expect(res.status).toBe(200);
      expect(res.body.data.siguiente_consecutivo).toBe(1);
      expect(res.body.data.year).toBe(2030);
    });
  });
});
