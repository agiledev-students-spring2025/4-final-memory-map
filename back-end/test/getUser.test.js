import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import express from 'express';
import axios from 'axios';
import route from '../path/to/your/routeFile'; 

chai.use(chaiHttp);

describe('GET /get_user', () => {
  let app;
  let axiosGetStub;

  before(() => {
    process.env.MOCKAROO_KEY = 'test-key';
    app = express();
    app.use(express.json());
    app.use('/', route);
  });
  afterEach(() => {
    if (axiosGetStub) {
      axiosGetStub.restore();
    }
  });

  it('should return 400 if userId is not provided', (done) => {
    chai.request(app)
      .get('/get_user')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error', 'userId is required.');
        done();
      });
  });

  it('should return 404 if user is not found', (done) => {
    const fakeUsers = [
      { userId: 1, name: 'Alice' },
      { userId: 2, name: 'Bob' },
    ];
    
    axiosGetStub = sinon.stub(axios, 'get').resolves({ data: fakeUsers });

    chai.request(app)
      .get('/get_user')
      .query({ userId: '3' })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error', 'User not found.');
        done();
      });
  });

  it('should return the user data if found', (done) => {
    const fakeUsers = [
      { userId: 1, name: 'Alice' },
      { userId: 2, name: 'Bob' },
    ];
    axiosGetStub = sinon.stub(axios, 'get').resolves({ data: fakeUsers });

    chai.request(app)
      .get('/get_user')
      .query({ userId: '1' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ userId: 1, name: 'Alice' });
        done();
      });
  });

  it('should handle errors from axios.get', (done) => {
    axiosGetStub = sinon.stub(axios, 'get').rejects(new Error('Network error'));

    chai.request(app)
      .get('/get_user')
      .query({ userId: '1' })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('error', 'Failed to fetch user data from Mockaroo');
        done();
      });
  });
});
