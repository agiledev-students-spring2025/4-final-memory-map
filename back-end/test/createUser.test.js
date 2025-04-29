import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import assert from 'assert';
import { MongoMemoryServer } from 'mongodb-memory-server';

import User from '../models/User.js';
import createUserRoute from '../routes/user/createUser.js';
import { authenticate } from '../routes/auth.js';

const app = express();
app.use(express.json());

app.use('/', createUserRoute);

let mongoServer;

describe('POST /create_user', () => {
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
  
  it('should create a user with valid data', async () => {
    const newUser = {
      user_id: '1',
      username: 'john_doe',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      gender: 'male',
      password: 'securepassword123',
    };

    const res = await request(app)
      .post('/create_user')
      .send(newUser);

    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'User created');
    assert.ok(res.body.user);
    assert.equal(res.body.user.user_id, newUser.user_id);
    assert.equal(res.body.user.username, newUser.username);
    assert.equal(res.body.user.email, newUser.email);
    assert.ok(res.body.user.profile_picture);
  });

  it('should return 400 if required fields are missing', async () => {
    const incompleteUser = {
      user_id: '2',
      username: 'jane_doe',
      first_name: 'Jane',
      email: 'jane.doe@example.com',
      gender: 'female',
      password: 'password123',
    };

    const res = await request(app)
      .post('/create_user')
      .send(incompleteUser);

    assert.equal(res.status, 400);
    assert.equal(res.text, 'Error');
  });

  it('should return 400 if user_id is missing', async () => {
    const invalidUser = {
      username: 'invalid_user',
      first_name: 'Invalid',
      last_name: 'User',
      email: 'invalid.user@example.com',
      gender: 'non-binary',
      password: 'password',
    };

    const res = await request(app)
      .post('/create_user')
      .send(invalidUser);

    assert.equal(res.status, 400);
    assert.equal(res.text, 'Error');
  });
});
