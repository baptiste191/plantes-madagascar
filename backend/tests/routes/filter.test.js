// backend/tests/routes/filter.test.js
const request = require('supertest');
const app     = require('../../src/index');
const resetDB = require('../common/setup');
let adminToken;

beforeAll(async () => {
  await resetDB();
  // login admin et création de 3 plantes
  const login = await request(app)
    .post('/api/utilisateurs/login')
    .send({ nom: 'admin', mot_de_passe: 'admin123' });
  adminToken = login.body.token;
  const plantes = [
    { nom_scientifique:'Aaa', famille:'F', nom_vernaculaire:'Alpha', regions:'X', vertus:'u1', usages:'', parties_utilisees:'', mode_preparation:'', contre_indications:'', remarques:'', bibliographie:'' },
    { nom_scientifique:'Bbb', famille:'F', nom_vernaculaire:'Beta',  regions:'Y', vertus:'u2', usages:'', parties_utilisees:'', mode_preparation:'', contre_indications:'', remarques:'', bibliographie:'' },
    { nom_scientifique:'Ccc', famille:'F', nom_vernaculaire:'Gamma', regions:'X', vertus:'u1,u3', usages:'', parties_utilisees:'', mode_preparation:'', contre_indications:'', remarques:'', bibliographie:'' },
  ];
  for (const p of plantes) {
    await request(app)
      .post('/api/plantes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(p);
  }
});

afterAll(done => {
  const db = require('../../src/config/db');
  db.close(done);
});

describe('Filtres API /api/plantes', () => {
  it('?nom=aa renvoie Alpha', async () => {
    const res = await request(app)
      .get('/api/plantes?nom=aa')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].nom_vernaculaire).toBe('Alpha');
  });
  it('?region=X renvoie 2 plantes', async () => {
    const res = await request(app)
      .get('/api/plantes?region=X')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.body).toHaveLength(2);
  });
  it('?vertu=u1 renvoie 2 plantes', async () => {
    const res = await request(app)
      .get('/api/plantes?vertu=u1')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.body).toHaveLength(2);
  });
});
