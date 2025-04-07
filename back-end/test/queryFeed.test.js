import express from 'express';
import app from '../app.js';
import route from '../routes/pin/queryFeed.js';

import { use, expect } from 'chai';
import chaiHttp from 'chai-http';

const chai = use(chaiHttp);

describe('GET request to /query_feed route', function () {
    let app;

    before(function () {
        process.env.MOCKAROO_KEY = 'test-key';
        app = express();
        app.use(express.json());
        app.use('/', route);
      });

  it('should respond with HTTP 200 and an object in the response body', async function () {
    
      chai.request(app)
        .get('/query_feed?userId=3')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object'); // Check that body is object
          expect(err).to.be.null;
          done();
        });
    });

    it('should respond with HTTP 400 if user not provided', async function () {
        chai.request(app)
            .get('/query_feed?')
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

});