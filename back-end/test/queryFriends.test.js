import { expect, use } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';

use(chaiHttp);

describe('GET request to /query_friends route', () => {
    const users = [
        {
            "userId": 63,
            "allFriendsId": [3, 71, 30, 21, 45, 65, 29],
            "allPinsId": [77, 82, 76, 70, 28, 50, 79, 59, 28, 18, 98, 69, 54, 27, 37, 99],
            "userName": "iionnidisw",
            "firstName": "Izabel",
            "lastName": "Ionnidis",
            "email": "iionnidisw@usnews.com",
            "gender": "Female",
            "birthdate": "5/21/1997",
            "profilePicture": "https://robohash.org/doloresrecusandaehic.png?size=50x50&set=set1"
        },
        {
            "userId": 78,
            "allFriendsId": [3, 37, 44, 99, 14, 43, 77, 61, 35, 94],
            "allPinsId": [92, 40, 15, 36, 73, 34, 88, 50, 12, 93, 85],
            "userName": "dpurvisx",
            "firstName": "Dur",
            "lastName": "Purvis",
            "email": "dpurvisx@yelp.com",
            "gender": "Male",
            "birthdate": "2/2/2001",
            "profilePicture": "https://robohash.org/blanditiisreprehenderitut.png?size=50x50&set=set1"
        },
        {
            "userId": 38,
            "allFriendsId": [50, 54, 70, 94, 3, 83, 41],
            "allPinsId": [44],
            "userName": "ddzenisenkab",
            "firstName": "Domini",
            "lastName": "Dzenisenka",
            "email": "ddzenisenkab@w3.org",
            "gender": "Female",
            "birthdate": "4/16/1990",
            "profilePicture": "https://robohash.org/etexercitationemet.png?size=50x50&set=set1"
        },
        {
            "userId": 69,
            "allFriendsId": [29, 3, 65, 51, 11, 85, 72],
            "allPinsId": [3, 32, 28, 10, 9, 33, 33, 51, 70, 14, 90, 61, 54, 28, 7, 20, 91, 95, 73, 17],
            "userName": "vponde1d",
            "firstName": "Vick",
            "lastName": "Ponde",
            "email": "vponde1d@businesswire.com",
            "gender": "Male",
            "birthdate": "3/10/1957",
            "profilePicture": "https://robohash.org/teneturquisenim.png?size=50x50&set=set1"
        },
        {
            "userId": 23,
            "allFriendsId": [98, 12, 77, 3, 65, 43],
            "allPinsId": [27, 14, 86, 65, 62, 63, 75, 72, 11, 6, 82, 16, 84, 27, 68, 98],
            "userName": "htonner2e",
            "firstName": "Hedvig",
            "lastName": "Tonner",
            "email": "htonner2e@scientificamerican.com",
            "gender": "Agender",
            "birthdate": "11/6/1994",
            "profilePicture": "https://robohash.org/recusandaevoluptasprovident.png?size=50x50&set=set1"
        },
        {
            "userId": 67,
            "allFriendsId": [74, 6, 69, 66],
            "allPinsId": [53, 80, 61, 16, 22, 41, 89, 68, 55, 74, 34, 47, 57, 49, 51, 7, 30, 37],
            "userName": "bbazoche4",
            "firstName": "Banky",
            "lastName": "Bazoche",
            "email": "bbazoche4@google.es",
            "gender": "Agender",
            "birthdate": "9/17/1983",
            "profilePicture": "https://robohash.org/cumqueestsint.png?size=50x50&set=set1"
          },
    ];

    // TODO: when have backend add users to test database

    it('it should respond with an HTTP 200 status code and an object in the response body', done => {
        chaiHttp
            .request(app)
            .get('/query_friends?userId=101')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.have.property('success', true);
                expect(res).to.be.a('object');
                expect(res).to.have.property('body').with.lengthOf(5);
                expect(err).be(null);
                done();
            });
    });

    // it('it should respond with an HTTP 500 status', done => {
    //     chaiHttp
    //         .request(app)
    //         .get('/query_friends?userId=101')
    //         .end((err, res) => {
    //             expect(res).to.have.status(500);
    //         });
    // });
});
