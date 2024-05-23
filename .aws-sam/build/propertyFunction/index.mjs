import axios from 'axios';

export async function handler(event, context) {
  try {
    const authorization = event.headers.Authorization;
    if (!authorization) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: event.headers })
      };
    }
    const response = await axios.get('https://apac.api.capillarytech.com/v1.1/organization/entities?type=STORE', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authorization
      }
    });

    console.log('Response:', response.data);
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ error: error.response ? error.response.data : error.message })
    };
  }
}
