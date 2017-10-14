export class ApiError {

  private _code : string;
  private _message : string;
  private _raw : Response;

  constructor(raw: Response, code? : string, message? : string) {
    this._code = code;
    this._message = message;
    this._raw = raw;
  }

  get raw(): Response {
    return this._raw;
  }
  get message() {
    return this._message;
  }
  get code() {
    return this._code;
  }
}
