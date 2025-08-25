class ResponseDTO {
  constructor(code, status, data = null, message) {
    this.code = code;
    this.status = status;
    this.data = data;
    this.message = message;
  }
}

module.exports = ResponseDTO;
