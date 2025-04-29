import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import assert from 'assert';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import getUserRoute from '../routes/user/getUser.js';
import { authenticate } from '../routes/auth.js';

const app = express();
app.use(express.json());

app.use('/', authenticate, getUserRoute);

let mongoServer;
let token;
let user;

describe('GET /get_user', function () {
  this.timeout(10000);

  before(async function () {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  beforeEach(async function () {
    await User.deleteMany({});

    user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test@password123'
    });

    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  it('should return current authenticated user data', async function () {
    const res = await request(app)
      .get('/get_user')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.username, 'testuser');
    assert.strictEqual(res.body.email, 'test@example.com');
    assert.ok(res.body.profilePicture);
  });

  it('should return 401 if authenticated user not found', async function () {
    await User.deleteMany({});

    const res = await request(app)
      .get('/get_user')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.message, 'User not found');
  });

  it('should return 401 if no token is provided', async function () {
    const res = await request(app)
      .get('/get_user');

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.message, 'No token provided');
  });
});

describe('GET /get_user/:userId', function () {
  this.timeout(10000);

  beforeEach(async function () {
    await User.deleteMany({});

    user = await User.create({
      username: 'otheruser',
      email: 'other@example.com',
      password: 'Other@password123'
    });

    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  it('should return user data by userId', async function () {
    const res = await request(app)
      .get(`/get_user/${user._id}`)
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.username, 'otheruser');
    assert.ok(res.body.profilePicture);
  });

  it('should return 400 for invalid userId format', async function () {
    const res = await request(app)
      .get('/get_user/invalid-id')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'Invalid user ID format');
  });

  it('should return 404 if userId does not exist', async function () {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/get_user/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.error, 'User not found');
  });
});

after(async function () {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});