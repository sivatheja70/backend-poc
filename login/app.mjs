import _ from 'lodash';
const getDependencies = async () => {
  let common = process.env.NODE_ENV == 'dev' ? await import('../layer/common.mjs') : await import('/opt/common.mjs');
  return {
    axios: await common.axios,
    UserQry: await common.UserLockoutInfoQueries
  };
};

export const lambdaHandler = async (event, context) => {
  const capAPI = 'https://apac.api.capillarytech.com/v1.1/organization/get'
  const { axios, UserQry } = await getDependencies();
  try {
    // const bodyParams = JSON.parse(event.body);
    // const getMemberInfo = await new UserQry().getUserDetails(bodyParams.username);
    // console.log("-getM", getMemberInfo);
    // return {
    //   statusCode: 401,
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Headers': '*',
    //   },
    //   body: JSON.stringify({ error: "RETURNED from here!", })
    // }
    if(event.body && event.body !== undefined){
      const bodyParams = JSON.parse(event.body);
      if(_.isEmpty(bodyParams) || bodyParams.username == undefined || bodyParams.authToken == undefined){   
        return {
          statusCode: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
          body: JSON.stringify({ error: "Params Usename or AuthToken is missing!", })
        };
      } else {
        // Check whether user is in Capillary or not ?
        const isUserInCap = await axios.get(capAPI, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': bodyParams.authToken
          }
        }).catch((error) => {
          return {
            statusCode: error ?? error.response.status,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({ error: "Axios Error" })
          };
        }).finally(() => {
          return {
            statusCode: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({error: "Final Block"})
          };
        });
        if(isUserInCap && isUserInCap.data){
          // Login Success :
          // Update User Info with counter 0:
          await new UserQry().deleteUser(bodyParams.username);
          return {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify(isUserInCap.data)
          };
        }
        // Lockout Scenario :
        const getMemberInfo = await new UserQry().getUserDetails(bodyParams.username);
        if(_.isEmpty(getMemberInfo) && _.isEmpty(getMemberInfo.Item)){
          // Do the entry of user with counter 1:
          // Dynamoose :
          const UserInfo = await new UserQry().addUserWithCounter(bodyParams.username);
          if(_.isEmpty(UserInfo) || typeof UserInfo == 'object'){
            // Return error message login failed :
            return {
              statusCode: 401,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
              },
              body: JSON.stringify({ error: "Login Failed! Invalid Username and Password", responseKey: "invalidUsernameorPassword"})
            };
          } else {
            // DB Error :
            return {
              statusCode: 501,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
              },
              body: JSON.stringify({ error: "Internal Server Error", responseKey: "internalServerError" })
            };
          }
        } else {
          // If get the data with same user : DO the counter update :
          if(getMemberInfo.Item.attempt_counter >= 5){
            return {
              statusCode: 403,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
              },
              body: JSON.stringify({ error: "Account Locked!", responseKey: "accountIsLocked"})
            };
          } else if(getMemberInfo.Item.attempt_counter >= 1){
            // Update User counter :
            // let dataPresentWithCounter = {
            //   TableName: tableName,
            //   Key: { 
            //     user_name: bodyParams.username
            //   },
            //   UpdateExpression: "SET attempt_counter = if_not_exists(attempt_counter, :start) + :inc",
            //   ExpressionAttributeValues: { 
            //     ':inc': 1,
            //     ':start': 0
            //   }
            // }
            await new UserQry().updateUserWithCounter(bodyParams.username);
            return {
              statusCode: 401,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
              },
              body: JSON.stringify({ 
                error: "Login Failed! Invalid Username and Password",
                responseKey: "invalidUsernameorPassword"
              })
            };
          }
        }
        return {
          statusCode: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
          body: JSON.stringify({ error: "Login Failed! Invalid Username and Password", responseKey: "invalidUsernameorPassword" })
        };
      }
    } else {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
          body: JSON.stringify({ error: "Parameters or API Gateway Issue", })
        };
    }
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
