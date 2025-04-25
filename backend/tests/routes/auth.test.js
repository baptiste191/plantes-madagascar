// backend/tests/routes/auth.test.js
const request = require('supertest');
const app     = require('../../src/index');
const resetDB = require('../common/setup');
let adminToken;

beforeAll(async () => {
  await resetDB();
});

afterAll(done => {
  const db = require('../../src/config/db');
  db.close(done);
});

describe('POST /api/utilisateurs/login', () => {
  it('renvoie un token pour admin valide', async () => {
    const res = await request(app)
      .post('/api/utilisateurs/login')
      .send({ nom: 'admin', mot_de_passe: 'admin123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    adminToken = res.body.token;
  });

  it('échoue si mot de passe incorrect', async () => {
    const res = await request(app)
      .post('/api/utilisateurs/login')
      .send({ nom: 'admin', mot_de_passe: 'wrong' });
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/utilisateurs (protégé)', () => {
  it('autorise l’admin', async () => {
    const res = await request(app)
      .get('/api/utilisateurs')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toMatchObject({ nom: 'admin', role: 'admin' });
  });

  it('refuse sans token', async () => {
    const res = await request(app).get('/api/utilisateurs');
    expect(res.statusCode).toBe(401);
  });
});
