import axios from 'axios';

import { LogHelper } from '../common.mjs';
const axiosInstanceV2 = axios.create();

let userInfo = {};
let requestId = 'NA';

axiosInstanceV2.interceptors.request.use(
  (request) => {
    const logger = new LogHelper(requestId, 'AxiosLoggerV2', userInfo);
    const start = Date.now();
    logger?.log(logger?.levels?.info, {
      type: `Axios request log`,
      url: request.url,
      body: JSON.stringify(request.data),
    });
    return {
      ...request,
      meta: {
        start,
      },
    };
  },
  (error) => {
    const logger = new LogHelper(requestId, 'AxiosLoggerV2', userInfo);

    logger?.log(logger?.levels?.error, `Request Error:`, `${error}`);
    return Promise.reject(error);
  }
);

axiosInstanceV2.interceptors.response.use(
  (response) => {
    const logger = new LogHelper(requestId, 'AxiosLoggerV2', userInfo);

    const { method, url, params } = response.config;
    logger?.log(logger?.levels?.info, {
      type: `Axios response log`,
      method,
      url,
      params,
      status: response.status,
      statusText: response.statusText,
      responseData: JSON.stringify(response.data),
    });
    return response;
  },
  (error) => {
    const logger = new LogHelper(requestId, 'AxiosLoggerV2', userInfo);

    logger?.log(logger?.levels?.error, `Axio Response Error: ${error}`);
    logger?.log(logger?.levels?.error, `Error config => ${JSON.stringify(error.config)}`);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      logger?.log(logger?.levels?.error, {
        type: `Axio Response Error`,
        headers: error.response.headers,
        status: error.response.status,
        responseData: JSON.stringify(error.response.data),
      });
      return Promise.reject({
        data: error.response.data,
        statusCode: error.response.status,
        statusText: error.response.statusText,
        message: error.message,
      });
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      logger?.log(logger?.levels?.error, {
        type: `Axio Response Error`,
        responseData: error.request,
      });
      return Promise.reject({
        request: error.request,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      logger?.log(logger?.levels?.error, {
        type: `Axio Response Error`,
        responseData: error.message,
      });
      return Promise.reject({
        message: error.message,
      });
    }
  }
);

export const loadAxiosDataV2 = async (data) => {
  userInfo = data?.userInfo ? data?.userInfo : {};
  requestId = data?.requestId ? data?.requestId : 'NA';
};

export default axiosInstanceV2;
