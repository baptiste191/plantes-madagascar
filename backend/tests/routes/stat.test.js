// backend/tests/routes/stat.test.js
const request = require('supertest');
const app     = require('../../src/index');
const resetDB = require('../common/setup');
let adminToken;

beforeAll(async () => {
  await resetDB();
  // crée 2 plantes pour tester les stats
  const login = await request(app)
    .post('/api/utilisateurs/login')
    .send({ nom: 'admin', mot_de_passe: 'admin123' });
  adminToken = login.body.token;

  const sample = {
    nom_scientifique:  'Stat Plant1',
    famille:           'Stataceae',
    nom_vernaculaire:  'Stat1',
    regions:           'DIANA,SAVA',
    vertus:            'a,b',
    usages:            'u',
    parties_utilisees: 'tige',
    mode_preparation:  'm1',
    contre_indications:'aucune',
    remarques:         '',
    bibliographie:     ''
  };
  await request(app)
    .post('/api/plantes')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(sample);
  await request(app)
    .post('/api/plantes')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ ...sample, nom_scientifique: 'Stat Plant2', nom_vernaculaire: 'Stat2' });
});

afterAll(done => {
  const db = require('../../src/config/db');
  db.close(done);
});

describe('/api/stats', () => {
  it('total-plantes', async () => {
    const res = await request(app)
      .get('/api/stats/total-plantes')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ total: 2 });
  });

  it('par-region', async () => {
    const res = await request(app)
      .get('/api/stats/par-region')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.DIANA).toBe(2);
    expect(res.body.SAVA).toBe(2);
  });

  it('par-vertu', async () => {
    const res = await request(app)
      .get('/api/stats/par-vertu')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.a).toBe(2);
    expect(res.body.b).toBe(2);
  });

  it('connexions', async () => {
    const res = await request(app)
      .get('/api/stats/connexions')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
