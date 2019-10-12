class APIError extends Error {
  constructor(message, code) {
    super(message);

    this.api = {
      message,
      code,
    };
  }
}

module.exports = APIError;