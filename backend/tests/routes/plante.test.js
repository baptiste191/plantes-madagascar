// backend/tests/routes/plante.test.js
const request = require('supertest');
const app     = require('../../src/index');
const resetDB = require('../common/setup');
let adminToken, createdId;

beforeAll(async () => {
  await resetDB();
  const login = await request(app)
    .post('/api/utilisateurs/login')
    .send({ nom: 'admin', mot_de_passe: 'admin123' });
  adminToken = login.body.token;
});

afterAll(done => {
  const db = require('../../src/config/db');
  db.close(done);
});

const sample = {
  nom_scientifique:  'Testus plantus',
  famille:           'Testaceae',
  nom_vernaculaire:  'TestPlante',
  regions:           'DIANA',
  vertus:            'test',
  usages:            'infusion',
  parties_utilisees: 'feuille',
  mode_preparation:  'infusion 5min',
  contre_indications:'aucune',
  remarques:         'aucune',
  bibliographie:     'Doc Test 2025'
};

describe('CRUD /api/plantes', () => {
  it('crée une plante (201)', async () => {
    const res = await request(app)
      .post('/api/plantes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(sample);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('récupère la liste (GET 200)', async () => {
    const res = await request(app)
      .get('/api/plantes')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find(p => p.id === createdId)).toMatchObject({
      nom_scientifique: sample.nom_scientifique
    });
  });

  it('récupère par id (GET 200)', async () => {
    const res = await request(app)
      .get(`/api/plantes/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.nom_vernaculaire).toBe(sample.nom_vernaculaire);
  });

  it('met à jour (PUT 200)', async () => {
    const res = await request(app)
      .put(`/api/plantes/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...sample, famille: 'Modifié' });
    expect(res.statusCode).toBe(200);
    expect(res.body.changes).toBe(1);
  });

  it('supprime (DELETE 200)', async () => {
    const res = await request(app)
      .delete(`/api/plantes/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.changes).toBe(1);
  });

  it('renvoie 404 si id inconnu', async () => {
    const res = await request(app)
      .get(`/api/plantes/9999`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });
});
