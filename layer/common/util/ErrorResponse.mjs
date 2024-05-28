const errorResponse = (statusCode, message, error = {}) => {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
    },
    body: JSON.stringify({
      error: message,
      data: error,
    }),
  };
};

export default errorResponse;
