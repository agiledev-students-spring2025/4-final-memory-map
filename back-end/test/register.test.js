import { expect, use } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';
import User from '../models/User.js';

use(chaiHttp);

describe('POST /api/user/register', () => {
  const user = { email: 'test@example.com', password: '12345678' };

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('registers a new user', async () => {
    const res = await chaiHttp.request(app).post('/api/user/register').send(user);
    expect(res).to.have.status(201);
  });

  it('fails if email is missing', async () => {
    const res = await chaiHttp.request(app).post('/api/user/register').send({ password: '12345678' });
    expect(res).to.have.status(400);
  });

  it('fails if password is missing', async () => {
    const res = await chaiHttp.request(app).post('/api/user/register').send({ email: 'test@example.com' });
    expect(res).to.have.status(400);
  });
});
