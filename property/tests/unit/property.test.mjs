import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { handler } from '../../index.mjs'; 

describe('handler', () => {

  let mock;
  
  beforeAll(() => {
    mock = new MockAdapter(axios);
  });
  afterEach(() => {
    mock.reset();
  });
  afterAll(() => {
    mock.restore();
  });

  test('returns data successfully with authorization', async () => {
    const mockData = { data: '' };
    mock.onGet('https://apac.api.capillarytech.com/v1.1/organization/get').reply(200, mockData);
    const event = {
      headers: {
        Authorization: 'Basic test'
      }
    };
    const context = {};
    const result = await handler(event, context);
    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify(mockData));
  });

  test('returns 400 if authorization header is missing', async () => {
    const event = {
      headers: {}
    };
    const context = {};
    const result = await handler(event, context);
    expect(result.statusCode).toBe(400);
    expect(result.body).toBe(JSON.stringify({ error: event.headers }));
  });

  test('handles error response from API', async () => {
    mock.onGet('https://apac.api.capillarytech.com/v1.1/organization/get').reply(500, { message: 'Internal Server Error' });
    const event = {
      headers: {
        Authorization: 'Basic test'
      }
    };
    const context = {};
    const result = await handler(event, context);
    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(JSON.stringify({ error: { message: 'Internal Server Error' } }));
  });

  test('handles network error', async () => {
    mock.onGet('https://apac.api.capillarytech.com/v1.1/organization/get').networkError();
    const event = {
      headers: {
        Authorization: 'Basic test'
      }
    };
    const context = {};
    const result = await handler(event, context);
    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(JSON.stringify({ error: 'Network Error' }));
  });
});
