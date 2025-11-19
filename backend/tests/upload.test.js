const request = require('supertest');
const app = require('../app');

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgUXOc6cAAAAASUVORK5CYII=',
  'base64'
);

describe('Upload endpoints', () => {

  test('uploads a valid png image', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('image', tinyPng, {
        filename: 'test.png',
        contentType: 'image/png'
      });

    expect([200, 201]).toContain(res.statusCode);
  });

  test('rejects large files', async () => {
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB

    const res = await request(app)
      .post('/upload')
      .attach('image', largeBuffer, {
        filename: 'big.png',
        contentType: 'image/png'
      });

    // Correct expected codes
    expect([400, 413]).toContain(res.statusCode);
  });

  test('rejects non-image', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('image', Buffer.from('hello world'), {
        filename: 'fake.txt',
        contentType: 'text/plain'
      });

    // Correct expected codes
    expect([400, 415]).toContain(res.statusCode);
  });

});
