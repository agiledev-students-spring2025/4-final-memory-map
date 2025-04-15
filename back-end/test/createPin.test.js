import request from 'supertest';  
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';
import app from '../app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('POST /create_pin', function () {
  before(function () {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
  });

  it('should respond with 201 and pin data when valid fields + image are provided', async function () {
    const imagePath = path.join(__dirname, 'dummyimage.jpg');

    const res = await request(app)
      .post('/create')
      .field('title', 'Test Pin')
      .field('description', 'A test pin description')
      .field('latitude', '40.7128')
      .field('longitude', '-74.0060')
      .attach('image', imagePath);

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.message, 'Pin created successfully');
      assert.ok(res.body.pin);
      assert.strictEqual(res.body.pin.title, 'Test Pin');
  });

  it('should respond with 500 and error message if image file is missing', async function () {
    const res = await request(app)
      .post('/create')
      .field('title', 'Missing Image Pin')
      .field('description', 'This request has no image')
      .field('latitude', '40.7128')
      .field('longitude', '-74.0060');

      assert.strictEqual(res.status, 500);
      assert.ok(res.body.error);
  });
});