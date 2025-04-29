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

  it('should return 200 and a list of friends', async function () {
    const fakeFriends = [
      { username: 'abby', email: 'abby@example.com', profilePicture: 'pic1.jpg' },
      { username: 'chris', email: 'chris@example.com', profilePicture: 'pic2.jpg' }
    ];

    findByIdStub = sinon.stub(User, 'findById').returns({
      populate: sinon.stub().resolves({
        _id: 'fakeUserId',
        username: 'testuser',
        friends: fakeFriends
      })
    });

    const res = await request(app).get('/query_friends');

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.equal(res.body.length, 2);
    assert.deepEqual(res.body[0], fakeFriends[0]);
    assert.deepEqual(res.body[1], fakeFriends[1]);
  });

  it('should return 404 if user is not found', async function () {
    findByIdStub = sinon.stub(User, 'findById').returns({
      populate: sinon.stub().resolves(null)
    });

    const res = await request(app).get('/query_friends');

    assert.equal(res.status, 404);
    assert.deepEqual(res.body, { error: 'User not found' });
  });

  it('should return 500 if DB throws an error', async function () {
    findByIdStub = sinon.stub(User, 'findById').returns({
      populate: sinon.stub().rejects(new Error('DB error'))
    });

    const res = await request(app).get('/query_friends');

    assert.equal(res.status, 500);
    assert.deepEqual(res.body, { error: 'Failed to fetch friend data' });
  });

  it('should return 401 if no token is provided', async function () {
    authStub.restore();

    const res = await request(app).get('/query_friends');

    assert.equal(res.status, 401);
    assert.deepEqual(res.body, { message: 'No token provided' });
  });
});
