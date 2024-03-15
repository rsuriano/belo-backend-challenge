/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import request from 'supertest';
import { app } from '../src/app';

describe('GET /pairs', () => {
    it('should fetch all pairs', async () => {

        const response = await request(app).get('/pairs');

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        // Add more assertions based on the expected structure of your pairs
        // For example, if you expect each pair to have a 'name' property:
        // expect(response.body.every(pair => 'name' in pair)).toBeTruthy();
    });
});
