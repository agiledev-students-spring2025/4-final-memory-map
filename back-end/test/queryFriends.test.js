import { use, should, assert } from 'chai'
import chaiHttp from 'chai-http';
import app from '../app.js';

const chai = use(chaiHttp);
const { expect } = chai;

describe('GET request to /query_friends route', () => {
    // TODO: when have backend add users to test database

    it('should respond with HTTP 200 and an object in the response body', async function () {
        chai.request(app)
            .get('/query_friends?userId=3')
            .end((err, res) => {
                expect(res).to.have.status(200);
                // expect(res.body.friends).to.have.lengthOf(5); // adjust as per actual response shape
                expect(err).to.be.null
                done();
            });
    });



    it('it should respond with an HTTP 400 status: no user id', async function () {
        chai.request(app)
            .get('/query_friends?user_id=')
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

});
