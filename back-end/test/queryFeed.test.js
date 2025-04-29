import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import assert from 'assert';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import Pin from '../models/Pin.js';
import queryFeedRoute from '../routes/pin/queryFeed.js';
import { authenticate } from '../routes/auth.js';

const app = express();
app.use(express.json());

app.use('/', authenticate, queryFeedRoute);

let mongoServer;
let token;
let user;
let friend;

describe('GET /query_feed', function () {
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

    // test user
    user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test@password123'
    });

    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // friend user
    friend = await User.create({
      username: 'frienduser',
      email: 'friend@example.com',
      password: 'Friend@password123'
    });

    // add friend to user's friends list
    user.friends.push(friend._id);
    await user.save();

    // pin by the user (own pin)
    await Pin.create({
      title: 'Own Pin',
      description: 'My private pin',
      location: { type: 'Point', coordinates: [-74.0060, 40.7128] },
      locationName: 'Test Location',
      imageUrl: 'http://example.com/own-pin.jpg',
      visibility: 1,
      author: user._id
    });

    // public pin by the friend
    await Pin.create({
      title: 'Friend Public Pin',
      description: 'My public pin',
      location: { type: 'Point', coordinates: [-73.935242, 40.730610] },
      locationName: 'Friend Location',
      imageUrl: 'http://example.com/friend-pin.jpg',
      visibility: 3,
      author: friend._id
    });

    // private pin by the friend (should not be visible)
    await Pin.create({
      title: 'Friend Private Pin',
      description: 'Should not be visible',
      location: { type: 'Point', coordinates: [-73.961452, 40.678178] },
      locationName: 'Private Location',
      imageUrl: 'http://example.com/private-pin.jpg',
      visibility: 1,
      author: friend._id
    });

    // friend-only pin by the friend
    await Pin.create({
      title: 'Friend Only Pin',
      description: 'Visible to friends',
      location: { type: 'Point', coordinates: [-73.950000, 40.650000] },
      locationName: 'Friend Only Location',
      imageUrl: 'http://example.com/friend-only-pin.jpg',
      visibility: 2,
      author: friend._id
    });
  });

  it('should return transformed pins visible to user', async function () {
    const res = await request(app)
      .get('/query_feed')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 200);

    const pinTitles = res.body.map(pin => pin.title);

    assert.ok(pinTitles.includes('Own Pin'));
    assert.ok(pinTitles.includes('Friend Public Pin'));
    assert.ok(pinTitles.includes('Friend Only Pin'));
    assert.ok(!pinTitles.includes('Friend Private Pin'));
  });

  it('should return 400 if no user is injected by authenticate', async function () {
    authStub.restore();
    sinon.stub(authModule, 'authenticate').callsFake((req, res, next) => {
      req.user = null;
      return res.status(400).json({ error: 'Bad auth' });
    });

    const res = await request(app).get('/query_feed');
    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { error: 'Bad auth' });
  });

  it('should return 404 if user is not found in DB', async function () {
    userFindByIdStub = sinon.stub(User, 'findById').resolves(null);

    const res = await request(app).get('/query_feed');

    assert.equal(res.status, 404);
    assert.deepEqual(res.body, { error: 'User not found' });
  });

  it('should return 500 if Pin.find throws an error', async function () {
    sinon.stub(User, 'findById').resolves({ _id: 'fakeUserId', friends: [] });
    sinon.stub(Pin, 'find').rejects(new Error('Mock DB error'));

    const res = await request(app).get('/query_feed');

    assert.equal(res.status, 500);
    assert.deepEqual(res.body, { error: 'Failed to fetch pin data from back end.' });
  });
});