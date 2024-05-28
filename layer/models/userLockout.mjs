import dynamoose from 'dynamoose';

import { dbConfig } from '../common/util/dbConfig.mjs';

dbConfig();
const env = process.env.Env == 'preprod' ? 'uat' : process.env.Env;

const Schema = new dynamoose.Schema(
  {
    user_name: {
      type: String,
      rangeKey: true,
    },
    attempt_counter: {
      type: Number,
      hashKey: true,
    }
  },
  {
    timestamps: true
  }
);

const UserLockoutModel = dynamoose.model(`user-lockout-info-${env}`, Schema, {
  create: env === 'local',
  throughput: {
    read: 5,
    write: 5,
  },
});

export default UserLockoutModel;
