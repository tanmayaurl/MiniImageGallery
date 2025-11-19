const request = require('supertest');
const app = require('../app');

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgUXOc6cAAAAASUVORK5CYII=',
  'base64'
);

describe('Images listing and deletion', () => {
  test('lists images after upload', async () => {
    const uploadRes = await request(app)
      .post('/upload')
      .attach('image', tinyPng, { filename: 'list.png', contentType: 'image/png' });

    expect([200, 201]).toContain(uploadRes.statusCode);
    const { id } = uploadRes.body;
    expect(id).toBeDefined();

    const listRes = await request(app).get('/images');
    expect(listRes.statusCode).toBe(200);
    const items = listRes.body;
    const found = items.find((it) => it.id === id);
    expect(found).toBeTruthy();
    expect(found.filename).toBe('list.png');
    expect(found.mimeType).toBe('image/png');
  });

  test('serves image binary data', async () => {
    const uploadRes = await request(app)
      .post('/upload')
      .attach('image', tinyPng, { filename: 'data.png', contentType: 'image/png' });
    const { id } = uploadRes.body;

    const dataRes = await request(app).get(`/images/${id}/data`);
    expect(dataRes.statusCode).toBe(200);
    expect(dataRes.headers['content-type']).toBe('image/png');
    expect(Buffer.isBuffer(dataRes.body)).toBe(true);
  });

  test('deletes image by id', async () => {
    const uploadRes = await request(app)
      .post('/upload')
      .attach('image', tinyPng, { filename: 'del.png', contentType: 'image/png' });
    const { id } = uploadRes.body;

    const delRes = await request(app).delete(`/images/${id}`);
    expect([200, 204]).toContain(delRes.statusCode);

    const listRes = await request(app).get('/images');
    const items = listRes.body;
    const found = items.find((it) => it.id === id);
    expect(found).toBeUndefined();
  });
});