import axios from 'axios';

import { LogHelper } from '../common.mjs';

const axiosInstance = axios.create();
const env = process.env.Env;

let userInfo = {};
let requestId = 'NA';

axiosInstance.interceptors.request.use(
  (request) => {
    const logger = new LogHelper(requestId, 'AxiosLogger', userInfo);

    const start = new Date().getTime();
    const textColor = '\x1b[34m';
    if (env === 'local') {
      // logger.info(`${textColor}Axios Request: ${JSON.stringify(request.data)}\x1b[0m`);
    } else {
      logger?.log(logger?.levels?.info, {
        type: `Axios request log`,
        headers: request.headers,
        auth: request.auth,
        url: request.url,
        body: JSON.stringify(request.data),
      });
    }
    return {
      ...request,
      meta: {
        start,
      },
    };
  },
  (error) => {
    const logger = new LogHelper(requestId, 'AxiosLogger', userInfo);
    logger?.log(logger?.levels?.error, `Request Error: ${error}`);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    const logger = new LogHelper(requestId, 'AxiosLogger', userInfo);
    const { headers, method, url, params } = response.config;

    logger?.log(logger?.levels?.info, {
      type: `Axios response log`,
      method,
      url,
      params,
      headers,
      status: response.status,
      statusText: response.statusText,
      responseData: JSON.stringify(response.data),
    });

    return response;
  },
  (error) => {
    const logger = new LogHelper(requestId, 'AxiosLogger', userInfo);

    logger?.log(logger?.levels?.error, `Axio Response Error: ${error}`);
    return Promise.reject(error);
  }
);

export const loadAxiosData = async (data) => {
  userInfo = data?.userInfo ? data?.userInfo : {};
  requestId = data?.requestId ? data?.requestId : 'NA';
};

export default axiosInstance;
