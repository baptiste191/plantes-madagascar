// backend/tests/routes/photo.test.js
const request = require('supertest');
const fs      = require('fs');
const path    = require('path');
const app     = require('../../src/index');
const resetDB = require('../common/setup');
let adminToken, planteId, photoId, testImgPath;

beforeAll(async () => {
  await resetDB();
  const login = await request(app)
    .post('/api/utilisateurs/login')
    .send({ nom: 'admin', mot_de_passe: 'admin123' });
  adminToken = login.body.token;
  // créer une plante
  const p = await request(app)
    .post('/api/plantes')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      nom_scientifique: 'PhotoTest',
      famille: 'F',
      nom_vernaculaire: 'Photo',
      regions: 'R',
      vertus: 'v',
      usages: '',
      parties_utilisees: '',
      mode_preparation: '',
      contre_indications: '',
      remarques: '',
      bibliographie: ''
    });
  planteId = p.body.id;
  // créer un fichier PNG minimal
  const assets = path.join(__dirname, '../assets');
  if (!fs.existsSync(assets)) fs.mkdirSync(assets);
  testImgPath = path.join(assets, 'test.png');
  if (!fs.existsSync(testImgPath)) {
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAmEBthtFKJsAAAAASUVORK5CYII=',
      'base64'
    );
    fs.writeFileSync(testImgPath, png);
  }
});

afterAll(done => {
  const db = require('../../src/config/db');
  db.close(done);
});

describe('API /api/photos', () => {
  it('POST upload .png OK', async () => {
    const res = await request(app)
      .post('/api/photos')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('plante_id', planteId)
      .attach('photo', testImgPath);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    photoId = res.body.id;
  });

  it('GET photos by plante_id renvoie 1', async () => {
    const res = await request(app)
      .get(`/api/photos?plante_id=${planteId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('filename');
  });

  it('DELETE /api/photos/:id supprime', async () => {
    const res = await request(app)
      .delete(`/api/photos/${photoId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.changes).toBe(1);
  });

  it('POST upload .txt refusé (400)', async () => {
    // créer un fichier .txt
    const txtPath = path.join(path.dirname(testImgPath), 'test.txt');
    fs.writeFileSync(txtPath, 'hello');
    const res = await request(app)
      .post('/api/photos')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('plante_id', planteId)
      .attach('photo', txtPath);
    expect(res.statusCode).toBe(400);
  });

  it('POST sans fichier renvoie 400', async () => {
    const res = await request(app)
      .post('/api/photos')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('plante_id', planteId);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Fichier manquant');
  });  
});
