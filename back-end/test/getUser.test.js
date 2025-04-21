import express from 'express';
import request from 'supertest';
import sinon from 'sinon';
import { strict as assert } from 'assert';
import route from '../routes/user/getUser.js';
import User from '../models/User.js';
import * as authModule from '../routes/auth.js';

describe('GET /get_user', function () {
  let app;
  let findByIdStub;
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
    if (findByIdStub) findByIdStub.restore();
    if (authStub) authStub.restore();
  });

  it('should return 200 and user data when user exists', async function () {
    const fakeUser = {
      _id: '1',
      username: 'testuser',
      email: 'test@example.com',
      profilePicture: 'https://example.com/profilePic.jpg',
      friends: ['friend1', 'friend2']
    };

    findByIdStub = sinon.stub(User, 'findById').resolves(fakeUser);

    const res = await request(app)
      .get('/get_user')

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, {
      _id: fakeUser._id,
      username: fakeUser.username,
      email: fakeUser.email,
      profilePicture: fakeUser.profilePicture,
      friends: fakeUser.friends
    });
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