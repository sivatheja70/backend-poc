import isEmpty from './isEmpty.mjs';
const isQueryParamsEmpty = (queryParams) => {
  for (const key in queryParams) {
    if (Object.hasOwnProperty.call(queryParams, key)) {
      const element = queryParams[key];
      if (isEmpty(element)) {
        return key;
      }
    }
  }
  return false;
};

export default isQueryParamsEmpty;
