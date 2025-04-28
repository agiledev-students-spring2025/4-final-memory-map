process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import assert from 'assert';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';

import Pin from '../models/Pin.js';
import User from '../models/User.js';
import createPinRoute from '../routes/pin/createPin.js';
import { authenticate } from '../routes/auth.js';

const app = express();
app.use(express.json());

let mongoServer;

app.use('/', authenticate, createPinRoute);

describe('POST /create', function () {
  this.timeout(10000); 

  before(async function () {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  after(async function () {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  beforeEach(async function () {
    await User.deleteMany({});
    await Pin.deleteMany({});

    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword'
    });

    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  it('should create a new pin with valid data', async function () {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword'
    });
  
    const dummyImagePath = path.resolve('test/dummyimage.jpg');
  
    const res = await request(app)
      .post('/create')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test Pin')
      .field('description', 'This is a test pin')
      .field('latitude', '40.7128')
      .field('longitude', '-74.0060')
      .field('visibility', '1')
      .field('locationName', 'Test Location')
      .attach('image', dummyImagePath);
  });

  it('should return 400 if required fields are missing', async function () {
    const user = await User.create({
      username: 'testuser2',
      email: 'test2@example.com',
      password: 'testpassword'
    });
  
    const dummyImagePath = path.resolve('test/dummyimage.jpg');
  
    const res = await request(app)
      .post('/create')
      .set('Authorization', `Bearer ${token}`)
      .field('title', '') // title is missing
      .field('description', 'Missing title here')
      .field('latitude', '40.7128')
      .field('longitude', '-74.0060')
      .field('visibility', '1')
      .field('locationName', 'Somewhere')
      .attach('image', dummyImagePath);
  
    assert.strictEqual(res.statusCode, 400);
    assert.ok(res.body.error);
  });  
})