class CustomError extends Error {
  constructor({ message = '', data = {}, errorType = '' }) {
    super(message);

    this.name = 'CustomError';
    this.data = data;
    this.errorType = errorType;
  }
}

export default CustomError;
