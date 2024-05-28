import dynamoose from 'dynamoose';
export const dbConfig = () => {
  const env = process.env.Env;

  // dynamoose.aws.ddb.local('http://dynamodb-local:8000')
  if (['local', 'dev'].includes(env)) {
    dynamoose.aws.ddb.local(process.env.DYNAMO_DB_LOCAL);
  } else if (env == 'test') {
    dynamoose.aws.ddb.local();
  }

  if (env == 'local' || env == 'dev' || env == 'uat' || env == 'prod' || env == 'preprod') {
    dynamoose.logger().then(
      (logger) => {
        logger.providers.set(console);
      },
      (error) => {
        console.error('The `dynamoose-logger` package has not been installed or :', error);
      }
    );
  }
};
