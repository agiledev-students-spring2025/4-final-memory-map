import request from 'supertest';
import app from '../app'; 

describe('PUT /api/update_user', () => {
  it('should update a user with valid data', async () => {
    const res = await request(app)
      .put('/api/update_user')
      .send({
        userId: 1,              
        firstName: 'Updated',
        lastName: 'Name'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Profile updated successfully!');
    expect(res.body.updatedUser).toHaveProperty('firstName', 'Updated');
  });

  it('should fail when required fields are missing', async () => {
    const res = await request(app)
      .put('/api/update_user')
      .send({ userId: 1 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 404 if user not found', async () => {
    const res = await request(app)
      .put('/api/update_user')
      .send({
        userId: 9999, 
        firstName: 'Ghost',
        lastName: 'User'
      });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'User not found.');
  });
});
