process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import assert from 'assert';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import path from 'path';
import cloudinary from 'cloudinary';

import Pin from '../models/Pin.js';
import User from '../models/User.js';
import deletePinRoute from '../routes/pin/deletePin.js';
import { authenticate } from '../routes/auth.js';

cloudinary.v2.uploader.destroy = async () => {
  return { result: 'ok' };
};

const app = express();
app.use(express.json());

app.use('/', authenticate, deletePinRoute);

let mongoServer;
let token;
let user;
let createdPin;

describe('DELETE /delete_pin', function () {
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

    user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword'
    });

    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    createdPin = await Pin.create({
      title: 'Test Pin',
      description: 'A pin to delete',
      latitude: 40.7128,
      longitude: -74.0060,
      visibility: 1,
      locationName: 'Test Location',
      userId: user._id,
      author: user._id, 
    
      imageUrl: 'http://example.com/dummy-image.jpg',
      cloudinaryPublicId: 'dummy_public_id',
    
      location: {
        type: 'Point',
        coordinates: [-74.0060, 40.7128] 
      }
    });    
  });

  it('should return 400 if pinId is not provided', async function () {
    const res = await request(app)
      .delete('/delete')
      .set('Authorization', `Bearer ${token}`)
      .send({});
  
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'Pin ID is required');
  });  

  it('should return 404 if pin does not exist in database', async function () {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete('/delete')
      .set('Authorization', `Bearer ${token}`)
      .send({ pinId: fakeId });
  
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.error, 'Pin not found');
  });  

  it('should return 200 if pin is found and deleted', async function () {
    const res = await request(app)
      .delete('/delete')
      .set('Authorization', `Bearer ${token}`)
      .send({ pinId: createdPin._id.toString() });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.message, 'Pin deleted successfully');
  });
});