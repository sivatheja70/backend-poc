exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event));
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello World'),
    };
    
    return response;
};
