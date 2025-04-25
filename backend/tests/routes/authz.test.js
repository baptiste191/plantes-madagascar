// backend/tests/routes/authz.test.js
const request = require('supertest');
const app     = require('../../src/index');
const resetDB = require('../common/setup');
let userToken, adminToken, planteId;

beforeAll(async () => {
  await resetDB();
  // on crée un plant pour le GET/:id
  const loginAdmin = await request(app)
    .post('/api/utilisateurs/login')
    .send({ nom: 'admin', mot_de_passe: 'admin123' });
  adminToken = loginAdmin.body.token;
  const resP = await request(app)
    .post('/api/plantes')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      nom_scientifique: 'AuthTest',
      famille: 'Test',
      nom_vernaculaire: 'Auth',
      regions: 'DIANA',
      vertus: 'v',
      usages: 'u',
      parties_utilisees: 'p',
      mode_preparation: 'm',
      contre_indications: '',
      remarques: '',
      bibliographie: ''
    });
  planteId = resP.body.id;

  // login user simple
  const loginUser = await request(app)
    .post('/api/utilisateurs/login')
    .send({ nom: 'utilisateur', mot_de_passe: 'utilisateur123' });
  userToken = loginUser.body.token;
});

afterAll(done => {
  const db = require('../../src/config/db');
  db.close(done);
});

describe('Autorisation role=user', () => {
  it('GET /api/plantes autorisé', async () => {
    const res = await request(app)
      .get('/api/plantes')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
  });
  it('POST /api/plantes refusé (403)', async () => {
    const res = await request(app)
      .post('/api/plantes')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ nom_scientifique: 'X' });
    expect(res.statusCode).toBe(403);
  });
  it('GET /api/stats/total-plantes refusé (403)', async () => {
    const res = await request(app)
      .get('/api/stats/total-plantes')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });
  it('GET /api/plantes/:id autorisé', async () => {
    const res = await request(app)
      .get(`/api/plantes/${planteId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
  });
});
