import express from 'express';
import request from 'supertest';
import sinon from 'sinon';
import { strict as assert } from 'assert';
import route from '../routes/pin/queryFeed.js';
import * as authModule from '../routes/auth.js';
import User from '../models/User.js';
import Pin from '../models/Pin.js';

describe('GET /query_feed', function () {
  let app;
  let authStub;

  beforeEach(function () {
    app = express();
    app.use(express.json());

    authStub = sinon.stub(authModule, 'authenticate').callsFake((req, res, next) => {
      req.user = { _id: 'fakeUserId' };
      next();
    });

    app.use('/', route);
  });

  afterEach(function () {
    sinon.restore();
  });

  it('should return 200 and an array of filtered pins', async function () {
    const fakeUser = {
      _id: '1',
      friends: ['friendId1', 'friendId2']
    };

    const fakePins = [
      {
        _id: 'pin1',
        title: 'Public Pin',
        description: 'This is public',
        location: { coordinates: [-74.0060, 40.7128] },
        locationName: 'NYC',
        imageUrl: 'http://image.jpg',
        author: 'anotherUser',
        tags: [],
        visibility: '1',
        createdAt: new Date()
      },
      {
        _id: 'pin2',
        title: 'Private Pin',
        description: 'Should not appear',
        location: { coordinates: [-74.0060, 40.7128] },
        locationName: 'Hidden Place',
        imageUrl: 'http://image2.jpg',
        author: 'randomUser',
        tags: [],
        visibility: '3',
        createdAt: new Date()
      }
    ];

    userFindByIdStub = sinon.stub(User, 'findById').resolves(fakeUser);
    pinFindStub = sinon.stub(Pin, 'find').resolves(fakePins);

    const res = await request(app).get('/query_feed');

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.equal(res.body.length, 1); 
    assert.equal(res.body[0].title, 'Public Pin');
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