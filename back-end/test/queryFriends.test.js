import express from 'express';
import request from 'supertest';
import sinon from 'sinon';
import { strict as assert } from 'assert';
import route from '../routes/friend/queryFriends.js';
import User from '../models/User.js';
import * as authModule from '../routes/auth.js';

describe('GET /query_friends (unit test)', function () {
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
