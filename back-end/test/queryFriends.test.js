import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import assert from 'assert';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import queryFriendsRoute from '../routes/friend/queryFriends.js';
import { authenticate } from '../routes/auth.js';

const app = express();
app.use(express.json());

app.use('/', authenticate, queryFriendsRoute);

let mongoServer;
let token;
let user;
let friend;

describe('GET /query_friends', function () {
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

    user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test@password123'
    });

    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    friend = await User.create({
      username: 'frienduser',
      email: 'friend@example.com',
      password: 'Friend@password123'
    });

    user.friends.push(friend._id);
    await user.save();
  });

  it('should return the list of friends for the user', async function () {
    const res = await request(app)
      .get('/query_friends')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.strictEqual(res.body.length, 1);
    assert.strictEqual(res.body[0].username, 'frienduser');
    assert.strictEqual(res.body[0].email, 'friend@example.com');
  });

  it('should return empty array if user has no friends', async function () {
    await user.updateOne({ friends: [] });

    const res = await request(app)
      .get('/query_friends')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.strictEqual(res.body.length, 0);
  });

  it('should return 401 if no token provided', async function () {
    const res = await request(app)
      .get('/query_friends');

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.message, 'No token provided');
  });

  it('should return 401 if authenticated user not found', async function () {
    await User.deleteMany({});

    const res = await request(app)
      .get('/query_friends')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 401);
    const msg = res.body.message || res.body.error;
    assert.ok(msg, 'Expected an error message');
    assert.match(msg, /user not found/i);
  });
});
