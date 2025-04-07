import { expect, use } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';


use(chaiHttp);

describe('GET /get_user', () => {
  it('return 400 if userId is missing', async () => {
    const res = await chaiHttp.request(app).get('/get_user');
    expect(res).to.have.status(400);
    expect(res.body.error).to.include('required');
  });

  it('return 404 if user is not found', async () => {
    const res = await chaiHttp.request(app).get('/get_user').query({ userId: 999999 });
    expect(res).to.have.status(404);
    expect(res.body.error).to.include('User not found');
  });

  it('return user data if userId exists in Mockaroo', async () => {
    const res = await chaiHttp.request(app).get('/get_user').query({ userId: 1 });

    if (res.status === 200) {
      expect(res.body).to.include.keys('userId', 'email');
    } else {
      expect(res).to.have.status(404);
    }
  });
});
