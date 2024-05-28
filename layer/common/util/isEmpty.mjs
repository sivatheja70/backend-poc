import validator from 'validator';
const isEmpty = (variable, error) => {
  if (variable !== undefined) {
    if (validator.isEmpty(variable, { ignore_whitespace: true })) {
      return true;
    }
    return false;
  } else {
    return false;
  }
};

export default isEmpty;
