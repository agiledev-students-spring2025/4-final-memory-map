import { expect, use } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';

const chai = use(chaiHttp);

describe('DELETE /delete_pin', function() {

  it('should return 400 if pinId is not provided', async function() {
    const res = await chai.request(app)
      .delete('/delete_pin')
      .send({});

    expect(res).to.have.status(400);
    expect(res.body).to.have.property('error', 'pinId is required');
  });

  it('should return 500 if pin does not exist in Mockaroo data', async function() {
    const res = await chai.request(app)
      .delete('/delete_pin')
      .send({ pinId: 999999 });

    expect(res).to.have.status(500);
    expect(res.body).to.have.property('error', 'Failed to delete pin from Mockaroo data');
  });

  it('should return 200 if pin is found and "deleted"', async function() {
    const res = await chai.request(app)
      .delete('/delete_pin')
      .send({ pinId: 85 });

    expect(res).to.have.status(200);
  });
});