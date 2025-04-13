import express from 'express';
import sinon from 'sinon';
import axios from 'axios';
import route from '../routes/friend/getUser.js';

import {expect, use} from 'chai';
import chaiHttp from "chai-http";
// Attach chai‑http to chai
const chai = use(chaiHttp);

describe('GET /get_user', function () {
  let app;
  let axiosGetStub;

  before(function () {
    process.env.MOCKAROO_KEY = 'test-key';
    app = express();
    app.use(express.json());
    app.use('/', route);
  });

  afterEach(function () {
    if (axiosGetStub) {
      axiosGetStub.restore();
    }
  });

  it('should return 400 if userId is not present', async function () {
    const res = await chai.request(app).get('/get_user');
    expect(res).to.have.status(400);
    expect(res.body).to.deep.equal({ error: 'userId is required.' });
  });

  it('should return 404 if user is not found', async function () {
    const fakeUsers = [
      { userId: 2, name: 'Person1' },
      { userId: 3, name: 'Bob' }
    ];
    axiosGetStub = sinon.stub(axios, 'get').resolves({ data: fakeUsers });

    const res = await chai.request(app)
      .get('/get_user')
      .query({ userId: '1' });
    expect(res).to.have.status(404);
    expect(res.body).to.deep.equal({ error: 'User not found.' });
  });

  it('should return the user data if found', async function () {
    const fakeUsers = [
      { userId: 1, name: 'Person1' },
      { userId: 2, name: 'Person2' }
    ];
    axiosGetStub = sinon.stub(axios, 'get').resolves({ data: fakeUsers });

    const res = await chai.request(app)
      .get('/get_user')
      .query({ userId: '1' });
    expect(res).to.have.status(200);
    expect(res.body).to.deep.equal({ userId: 1, name: 'Person1' });
  });

  it('should return 500 if error fetching data', async function () {
    axiosGetStub = sinon.stub(axios, 'get').rejects(new Error('Network error'));

    const res = await chai.request(app)
      .get('/get_user')
      .query({ userId: '1' });
    expect(res).to.have.status(500);
    expect(res.body).to.deep.equal({ error: 'Failed to fetch user data from Mockaroo' });
  });
});
