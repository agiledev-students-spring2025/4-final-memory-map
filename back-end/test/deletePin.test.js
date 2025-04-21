import supertest from 'supertest';
import assert from 'assert';
import app from '../app.js';

describe('DELETE /delete_pin', function () {
  it('should return 400 if pinId is not provided', async function () {
    const res = await request (app)
      .delete('/delete')
      .send({});

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'pinId is required');
  });

  it('should return 500 if pin does not exist in database', async function () {
    const res = await request (app)
      .delete('/delete')
      .send({ pinId: 999999 });

    assert.strictEqual(res.status, 500);
    assert.strictEqual(res.body.error, 'Failed to delete pin from database');
  });

  it('should return 200 if pin is found and "deleted"', async function () {
    const res = await request (app)
      .delete('/delete')
      .send({ pinId: 1 });

    assert.strictEqual(res.status, 200);
  })
});