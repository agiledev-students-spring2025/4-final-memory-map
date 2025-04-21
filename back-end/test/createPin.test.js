import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { strict as assert } from 'assert';
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
      .field('visibility', '1')
      .attach('image', imagePath);

    assert.equal(res.status, 201);
    assert.ok(res.body._id);
    assert.equal(res.body.title, 'Test Pin');
    assert.equal(res.body.description, 'A test pin description');
  });

  it('should respond with 500 and error message if image file is missing', async function () {
    const res = await request(app)
      .post('/create')
      .field('title', 'Test Pin')
      .field('description', 'A test pin description')
      .field('latitude', '40.7128')
      .field('longitude', '-74.0060')
      .field('visibility', '1');

    assert.equal(res.status, 500);
    assert.equal(res.body.error, 'Image file is missing');
  });
});