import request from 'supertest';  
import app from './app';  

describe('POST /create_user', () => {
    it('should create a user with valid data', async () => {
        const newUser = {
            user_id: '1',
            username: 'john_doe',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            gender: 'male',
            password: 'securepassword123',
        };

        const response = await request(app)
            .post('/create_user')
            .send(newUser);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User created');
        expect(response.body.user).toHaveProperty('user_id');
        expect(response.body.user.username).toBe(newUser.username);
        expect(response.body.user.email).toBe(newUser.email);
        expect(response.body.user.profile_picture).toBeTruthy();
    });

    it('should return error if required fields are missing', async () => {
        const incompleteUser = {
            user_id: '2',
            username: 'jane_doe',
            first_name: 'Jane',
            email: 'jane.doe@example.com',
            gender: 'female',
            password: 'password123',
        };

        const response = await request(app)
            .post('/create_user')
            .send(incompleteUser);

        expect(response.status).toBe(400);
        expect(response.text).toBe('Error');
    });

    it('should return error if user_id is missing', async () => {
        const invalidUser = {
            username: 'invalid_user',
            first_name: 'Invalid',
            last_name: 'User',
            email: 'invalid.user@example.com',
            gender: 'non-binary',
            password: 'password',
        };

        const response = await request(app)
            .post('/create_user')
            .send(invalidUser);

        expect(response.status).toBe(400);
        expect(response.text).toBe('Error');
    });
});
