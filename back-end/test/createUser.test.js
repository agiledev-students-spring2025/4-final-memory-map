import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import assert from 'assert';
import { MongoMemoryServer } from 'mongodb-memory-server';

import User from '../models/User.js';
import createUserRoute from '../routes/user/createUser.js';

const app = express();
app.use(express.json());

app.use('/', createUserRoute);

let mongoServer;

describe('POST /register', function () {
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
  });

  it('should register a new user with valid data', async function () {
    const res = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test@password123',
        confirmPassword: 'Test@password123'
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.message, 'Registration successful');
    assert.ok(res.body.token);
    assert.ok(res.body.user);
    assert.strictEqual(res.body.user.username, 'testuser');
    assert.strictEqual(res.body.user.email, 'test@example.com');
  });

  it('should return 400 if username or email already exists', async function () {
    await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test@password123',
        confirmPassword: 'Test@password123'
      });

    const res = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test@password123',
        confirmPassword: 'Test@password123'
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'User already exists');
    assert.ok(res.body.field);
  });

  it('should return 400 if missing required fields', async function () {
    const res = await request(app)
      .post('/register')
      .send({
        username: '',
        email: 'test@example.com',
        password: ''
      });

    assert.strictEqual(res.status, 400);
    assert.ok(res.body.errors);
    assert.ok(Array.isArray(res.body.errors));
  });
});
