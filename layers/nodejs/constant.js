const responseMessage = {
    allowOriginHeaders: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
    },
    dynamoDBTable : {
        lockOut: "fortress-lockout-info"
    },
    capillaryBaseUrl: "https://apac.api.capillarytech.com/v1.1/organization/get"
}
export default responseMessage;