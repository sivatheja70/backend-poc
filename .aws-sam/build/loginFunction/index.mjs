/* Importing Dependencies */
import axios from 'axios';
import _ from "lodash";
import moment from 'moment';

/* Importing Layer's Files & functions */
import DynamoDB from "/opt/nodejs/database.js";
import Constant from "/opt/nodejs/constant.js";

export async function handler(event, context) {
  try {
    if(event.body && event.body !== undefined){
      const bodyParams = JSON.parse(event.body);
      if(_.isEmpty(bodyParams) || bodyParams.username == undefined || bodyParams.authToken == undefined){
        return {
          statusCode: 400,
          headers: Constant.allowOriginHeaders,
          body: JSON.stringify({
            error: 'Either username or authToken is missing!'
          })
        };
      } else {
        // Check whether user is in Capillary or not ?
        const tableName = Constant.dynamoDbTable.lockOut;
        const isUserInCap = await axios.get(Constant.capillaryBaseUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': bodyParams.authToken
          }
        })
        if(isUserInCap && isUserInCap.data){
          // Login Success :
          return {
            statusCode: 200,
            headers: Constant.allowOriginHeaders,
            body: JSON.stringify(isUserInCap.data)
          };
        }
        // Lockout Scenario :
        let params = {
            TableName : tableName,
            Key: {
                username: bodyParams.username
            }
        };
        await DynamoDB.documentClient.get(params, async function(error, data) {
            if (error) {
              return {
                statusCode: error.response ? error.response.status : 500,
                headers: Constant.allowOriginHeaders,
                body: JSON.stringify({ error: error.response ? error.response.data : error.message })
              };
            } else {
              // 1 - If data found by params username :
              if(!_.isEmpty(data) && data !== undefined &&  !_.isEmpty(data.Item)){
                // 1.1 - If user has maxAttempts = 5 and attemptCounter = 5 : return the Error
                if(data.Item.maxAttempts >= 5 && data.Item.attemptCounter >= 5){
                  return {
                    statusCode: 400,
                    headers: Constant.responseMessage.allowOriginHeaders,
                    body: "Your Account has been blocked, Kindly contact to your manager!"
                  };
                } else if(data.Item.attemptCounter >= 1 && data.Item.attemptCounter < 5){
                  let dataPresentWithCounter = {
                    TableName: tableName,
                    Item: { 
                      username: bodyParams.username
                    },
                    UpdateExpression: "ADD attemptCounter :val",
                    ExpressionAttributeValues: { ":val": { N: 1 } }
                  }
                  // Run the udpate counter query :
                  await DynamoDB.documentClient.put(dataPresentWithCounter, async function(err, data) {
                    if (err) console.log("Update-eRR----->", err);
                    else console.log("Update-dATA---->", data);
                  }).promise();
                  return {
                    statusCode: 400,
                    headers: Constant.allowOriginHeaders,
                    body: "Login Failed!"
                  };
                } else {
                  return {
                    statusCode: 400,
                    headers: Constant.allowOriginHeaders,
                    body: "Login issue, Internal Server Error!"
                  };
                }
              } else { // Not Data Found
                // 2 - If data not found by params username
                // 2.1 - Do the entry in DB and make the counter set to 0 and maxAtempts 5:
                let presentInDBParmas = {
                  TableName: tableName,
                  Item: {
                    username: bodyParams.username,
                    maxAttempts: 5,
                    attemptCounter: 1
                  }
                }
                await DynamoDB.documentClient.put(presentInDBParmas, async function(error, data) {
                  if (error) console.log("93-Error----->", error);
                  else console.log("94-Data---->", data);
                }).promise();
                return {
                  statusCode: 200,
                  headers: Constant.allowOriginHeaders,
                  body: JSON.stringify("Login Failed")
              };
            }
          }
        }).promise();
        return {
          statusCode: 200,
          headers: Constant.allowOriginHeaders,
          body: JSON.stringify({ error: "Need to check the DBs Query" })
        };
      }
    } else {
      return {
        statusCode: 400,
        headers: Constant.allowOriginHeaders,
        body: JSON.stringify({ error: "Issue with API gateway or not sending proper params!" })
      };
    }
  } catch (error) {
    console.error('Error fetching data Login->:', error.response); // Log error details for debugging
    return {
      statusCode: error.response ? error.response.status : 500,
      headers: Constant.allowOriginHeaders,
      body: JSON.stringify({ error: error.response ? error.response.data : error.message })
    };
  }
}
