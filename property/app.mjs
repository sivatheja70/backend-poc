export const lambdaHandler = async (event, context) => {
  try {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({
        result: {
          data: [],
          message: "Login invoked"
        },
      }),
    };
  } catch (error) {
    return {
      statusCode: error.response ? error.response.status : 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({ error: error.response ? error.response.data : error.message })
    };
  }
};
