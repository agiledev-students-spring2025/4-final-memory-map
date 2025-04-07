import { expect, use } from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import app from '../app.js';

const chai = use(chaiHttp);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('POST /create_pin route', function () {
  before(function () {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
  });

  it('should respond with 200 and pin data when valid fields + image are provided', function (done) {
    const imagePath = path.join(__dirname, 'dummyimage.jpg');
    const fileBuffer = fs.readFileSync(imagePath);

    chai.request(app)
      .post('/create_pin')
      .field('pinName', 'Test Pin')
      .field('pinDescription', 'A test pin description')
      .field('locationLatitude', '40.7128')
      .field('locationLongitude', '-74.0060')
      .attach('image', fileBuffer, 'dummyimage.jpg')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Pin created successfully');
        expect(res.body).to.have.property('data');

        expect(res.body.data).to.include({
          pinName: 'Test Pin',
          pinDescription: 'A test pin description',
          locationLatitude: '40.7128',
          locationLongitude: '-74.0060'
        });
        done();
      });
  });

  it('should respond with 500 and error message if image file is missing', function (done) {
    chai.request(app)
      .post('/create_pin')
      .field('pinName', 'Test Pin')
      .field('pinDescription', 'A test pin description')
      .field('locationLatitude', '40.7128')
      .field('locationLongitude', '-74.0060')
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('error', 'Image file is missing');
        done();
      });
  });
});