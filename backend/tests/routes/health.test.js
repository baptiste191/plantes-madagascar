const request = require('supertest');
const app     = require('../../src/index');

describe('GET /health', () => {
  it('doit renvoyer { status: "ok" }', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

afterAll(done => {
    const db = require('../../src/config/db');
    db.close(err => done(err));
  });
  