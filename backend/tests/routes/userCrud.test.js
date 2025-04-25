// backend/tests/routes/userCrud.test.js
const request = require('supertest');
const app     = require('../../src/index');
const resetDB = require('../common/setup');
let adminToken, userToken, newUserId;

beforeAll(async () => {
  await resetDB();
  // login admin + user
  const loginAdmin = await request(app)
    .post('/api/utilisateurs/login')
    .send({ nom: 'admin', mot_de_passe: 'admin123' });
  adminToken = loginAdmin.body.token;
  const loginUser = await request(app)
    .post('/api/utilisateurs/login')
    .send({ nom: 'utilisateur', mot_de_passe: 'utilisateur123' });
  userToken = loginUser.body.token;
});

afterAll(done => {
  const db = require('../../src/config/db');
  db.close(done);
});

describe('CRUD utilisateurs', () => {
  it('admin POST /api/utilisateurs crée un user', async () => {
    const res = await request(app)
      .post('/api/utilisateurs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nom: 'testusr', mot_de_passe: 'pwd', role: 'user' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    newUserId = res.body.id;
  });
  it('user simple POST /api/utilisateurs interdit (403)', async () => {
    const res = await request(app)
      .post('/api/utilisateurs')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ nom: 'x', mot_de_passe: 'x', role: 'user' });
    expect(res.statusCode).toBe(403);
  });
  it('admin DELETE /api/utilisateurs/:id supprime', async () => {
    const res = await request(app)
      .delete(`/api/utilisateurs/${newUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.changes).toBe(1);
  });
});
