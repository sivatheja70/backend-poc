import { getConfig } from '../common.mjs';

const checkImplementationExist = (implementationId) => {
  const implementationConfig = getConfig();
  let implementationExist = false;
  for (let key in implementationConfig) {
    if (key == implementationId) {
      implementationExist = true;
      break;
    }
  }

  return implementationExist;
};

export default checkImplementationExist;
