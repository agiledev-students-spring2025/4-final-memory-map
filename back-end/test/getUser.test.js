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

  it('should return 404 if user is not found', async function () {
    findByIdStub = sinon.stub(User, 'findById').resolves(null);

    const res = await request(app).get('/get_user');

    assert.equal(res.status, 404);
    assert.deepEqual(res.body, { error: 'User not found' });
  });

  it('should return 500 if findById throws an error', async function () {
    findByIdStub = sinon.stub(User, 'findById').rejects(new Error('Database error'));

    const res = await request(app).get('/get_user');

    assert.equal(res.status, 500);
    assert.deepEqual(res.body, { error: 'Failed to fetch user data' });
  });
});