import {AppError} from "./ierror";

export class ApiError implements AppError{
  name: string;

  private _code : string;
  private _message : string;
  private _raw : Response;

  constructor(raw: Response, code? : string, message? : string) {
    this._code = code;
    this._message = message;
    this._raw = raw;
    this.name = "ApiError"
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

  displayString() : string {
    return this.message;
  }
}
