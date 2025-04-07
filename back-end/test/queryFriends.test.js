import { use, expect, should, assert } from 'chai'
import { default as chaiHttp, request } from 'chai-http'
import app from '../app.js';

use(chaiHttp);

describe('GET request to /query_friends route', () => {
    // TODO: when have backend add users to test database

    it('should respond with HTTP 200 and an object in the response body', done => {
        request
            .execute(app)
            .get('/query_friends?userId=101')
            .end((err, res) => {
                expect(res).to.have.status(200);
                // expect(res.body.friends).to.have.lengthOf(5); // adjust as per actual response shape
                expect(err).to.be.null
                done();
            });
    });



    it('it should respond with an HTTP 400 status: no user id', done => {
        request
            .execute(app)
            .get('/query_friends?user_id=')
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

});
