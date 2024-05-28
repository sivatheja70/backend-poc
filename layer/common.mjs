import moment from 'moment';
import axios from 'axios';
import dynamoose from 'dynamoose';
import UserLockoutInfoQueries from './dbQueries/UserLockoutInfoQueries.mjs';

if (process.env.Env == 'local') {
  dynamoose.aws.ddb.local(process.env.DYNAMO_DB_LOCAL);
}
export {
  moment,
  axios,
  dynamoose,
  UserLockoutInfoQueries
};
